function getUrlVar()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};


$(document).ready(function(){
	var token = auth.getToken();
	var cls = decodeURIComponent(getUrlVar()["cls"]);
    var session = decodeURIComponent(getUrlVar()["session"]);
	var ref_id = $('head').attr('id')	
	var table = null
    var first_term_table = null
    var second_term_table = null
    var third_term_table = null
	if(auth.isLoggedIn())
	{
		var href = 'https://alxproject.virilesoftware.com/api/academicteacher';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			for(var i = 0; i < data.length; i++)
			{
				$('#select_class').append('<option value="'+data[i].ref_id+'">'+data[i].name+'</option>')
				$('#edit_select_class').append('<option value="'+data[i].ref_id+'">'+data[i].name+'</option>')
			}
			
		});

		var href = 'https://alxproject.virilesoftware.com/api/subjectteacher/'+ref_id;
		$.ajax({
			type: 'GET',
			data: {session:session, subject_id:ref_id, class_id:cls},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			//console.log(data)
			var bio = ''
			for(var s = 0; s < data.length; s++){
				var info = data[s]
				bio += '<div class="media">\
                  <img src="'+info.image+'" alt="" style="width:48px; height:48px; border-radius:50%;">\
                  <div class="media-body">\
                    <h5 class="card-profile-name" style="margin-top:10px;padding-left:5px">'+info.name+'<span style="margin-left:10px;">\
					<a href="#" class="btn btn-outline-danger btn-icon tx-20 remove_class_teacher" data-id="'+info.ref_id+'" data-name="'+info.name+'"><i class="fa fa-trash"></i></a></span></h5>\
                    </div><!-- media-body -->\
                </div><!-- media -->'
			}
			$('#biodata').html(bio)
			
		});

		var href = 'https://alxproject.virilesoftware.com/api/studentlistbysubject';
		$.ajax({
			type: 'GET',
			data: {academic_session:session, subject_id:ref_id, class_id:cls},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			//console.log(data)
			var payload = jwt_decode(token);
			if(table == null){}
			else{
				table.destroy();
			}
			var htmls = ''
			for(var i = 0; i < data.length; i++)
			{
				var s = 1 + i
				htmls  +='<tr id="row'+data[i].ref_id+'">\
					<td>'+s+'</td>\
					<td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+data[i].student_id+'" class="">'+ data[i].name+'</a></td>\
					<td>'+ data[i].admission_no+'</td>\
					<td>'+ data[i].student_class+'</td>\
					<td>'+ data[i].gender+'</td>\
					<td>'+ data[i].admission_date+'</td>\
					<td><a href="#" class="btn btn-outline-danger btn-icon removeschoolclass" id="' +data[i].ref_id + '"  data-name ="' + data[i].name + '" \
					data-arm ="' + data[i].arm + '"  data-school-class ="' + data[i].sch_class + '">\
				 <div class="tx-20"><i class="fa fa-trash"></i></div>\
			   </a></td>\
					</tr>'
					
			}
			
			$('#tablebodys').html(htmls)
			table = $('#tabledata').DataTable({
                retrieve:true,
                sorting:false,
				ordering:false,
                "aLengthMenu": [
                    [10, 30, 50, -1],
                    [10, 30, 50, "All"]
                ],
                "iDisplayLength": 50,
                dom: 'Bfrtip',
				buttons: [
					'csv', 'excel','pdf', 'print'
				],
                "language": {
                    search: ""
                }
                });
                $('#tabledata').each(function() {
                var datatable = $(this);
                // SEARCH - Add the placeholder for Search and Turn this into in-line form control
                var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
                search_input.attr('placeholder', 'Search');
                search_input.removeClass('form-control-sm');
                // LENGTH - Inline-Form control
                var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
                length_sel.removeClass('form-control-sm');
                
            });

		})
		
		
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
		$.ajax({
			type: 'GET',
			data:  {academic_session:session, student_subject:ref_id, student_class:cls, session_term:'First Term'},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            console.log(datas)
            if(datas.status == 200){
				var column = [{title:"Admission No", field:"admission_no", width:150},{title:"Name", field:"name", width:300}]
				var mark = datas.mark
				for(var i = 0; i < mark.length; i++)
				{
					column.push({title:mark[i].abbr, field:mark[i].abbr, align:"center",editor:"input", width:80, validator:["numeric", "min:0", "max:"+mark[i].point]})
				}
				//console.log(column)
				var fors  = []
				var data = datas.data
				console.log(data.length)
				for(var i = 0; i < data.length; i++){
					var sn = i + 1
					var files = {}
					files.id = data[i].ref_id
					files.admission_no = data[i].admission_no
					files.name = data[i].student_name
					var sc = JSON.parse(data[i].score)
					var array_sc = []
					var info = {}
					for(var s = 0; s < sc.length; s++){
						
						info[sc[s].abbr] = sc[s].value
						//var info = {sc[s].abbr:sc[s].value}
						//array_sc.push(info)
					}
					var fl = {...files, ...info}
					fors.push(fl)
				}
				console.log(fors)
				first_term_table = new Tabulator("#first_term_table", {
					//height:320, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
					//width:1240,
					height:"100%",
					data:fors, //assign data to table
					layout:"fitColumns", //fit columns to width of table (optional)
					//autoResize: false,
					addRowPos:"top",
					columns:column,
					rowClick:function(e, row){ //trigger an alert message when the row is clicked
						//alert("Row " + row.getData().id + " Clicked!!!!");
					},
					cellEditing:function(cell){},
					cellEdited:function(cell){
                        var new_d = cell.getRow().getData()
                        //console.log(new_d)
                        var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
						$.ajax({
							url: href,
							type: "POST",
							dataType: "json",
							timeout: 10000,
							data: {info:JSON.stringify([new_d]), academic_session:session, student_subject:ref_id, student_class:cls, session_term:'First Term'},
                            beforeSend : function(req) {
                                req.setRequestHeader('Authorization', 'Bearer '+token);
                            },
							success: function(data) { 
								if(data.status == 200){}
								else
								{
									alert(data.message)
									cell.restoreOldValue();
								}
							},
							error: function(x, t, m) {
								if(t==="timeout") {
									alert("got timeout");
									cell.restoreOldValue();
								} else {
									alert(t);
									cell.restoreOldValue();
								}
							}
						});
                        
                    },
					validationFailed:function(cell, value, validators){
						
					//cell - cell component for the edited cell
					//value - the value that failed validation
					//validatiors - an array of validator objects that failed
					},
			   });
            }
        })
		//second term
        $.ajax({
			type: 'GET',
			data:  {academic_session:session, student_subject:ref_id, student_class:cls, session_term:'Second Term'},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            //console.log(datas)
            if(datas.status == 200){
				var column = [{title:"Admission No", field:"admission_no", width:150},{title:"Name", field:"name", width:300}]
				var mark = datas.mark
				for(var i = 0; i < mark.length; i++)
				{
					column.push({title:mark[i].abbr, field:mark[i].abbr, align:"center",editor:"input", width:80, validator:["numeric", "min:0", "max:"+mark[i].point]})
				}
				//console.log(column)
				var fors  = []
				var data = datas.data
				for(var i = 0; i < data.length; i++){
					var sn = i + 1
					var files = {}
					files.id = data[i].ref_id
					files.admission_no = data[i].admission_no
					files.name = data[i].student_name
					var sc = JSON.parse(data[i].score)
					var array_sc = []
					var info = {}
					for(var s = 0; s < sc.length; s++){
						
						info[sc[s].abbr] = sc[s].value
						//var info = {sc[s].abbr:sc[s].value}
						//array_sc.push(info)
					}
					var fl = {...files, ...info}
					fors.push(fl)
				}
				//console.log(fors)
				second_term_table = new Tabulator("#second_term_table", {
					//height:320, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
					//width:1240,
					height:"100%",
					data:fors, //assign data to table
					layout:"fitColumns", //fit columns to width of table (optional)
					//autoResize: false,
					addRowPos:"top",
					columns:column,
					rowClick:function(e, row){ //trigger an alert message when the row is clicked
						//alert("Row " + row.getData().id + " Clicked!!!!");
					},
					cellEditing:function(cell){},
					cellEdited:function(cell){
                        var new_d = cell.getRow().getData()
                        //console.log(new_d)
                        var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
						$.ajax({
							url: href,
							type: "POST",
							dataType: "json",
							timeout: 10000,
							data: {info:JSON.stringify([new_d]), academic_session:session, student_subject:ref_id, student_class:cls, session_term:'Second Term'},
                            beforeSend : function(req) {
                                req.setRequestHeader('Authorization', 'Bearer '+token);
                            },
							success: function(data) { 
								if(data.status == 200){}
								else
								{
									alert(data.message)
									cell.restoreOldValue();
								}
							},
							error: function(x, t, m) {
								if(t==="timeout") {
									alert("got timeout");
									cell.restoreOldValue();
								} else {
									alert(t);
									cell.restoreOldValue();
								}
							}
						});
                        
                    },
					validationFailed:function(cell, value, validators){
						
					//cell - cell component for the edited cell
					//value - the value that failed validation
					//validatiors - an array of validator objects that failed
					},
			   });
            }
        })
		//Third term
        $.ajax({
			type: 'GET',
			data:  {academic_session:session, student_subject:ref_id, student_class:cls, session_term:'Third Term'},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            //console.log(datas)
            if(datas.status == 200){
				var column = [{title:"Admission No", field:"admission_no", width:100},{title:"Name", field:"name", width:300}]
				var mark = datas.mark
				for(var i = 0; i < mark.length; i++)
				{
					column.push({title:mark[i].abbr, field:mark[i].abbr, align:"center",editor:"input", width:80, validator:["numeric", "min:0", "max:"+mark[i].point]})
				}
				//console.log(column)
				var fors  = []
				var data = datas.data
				for(var i = 0; i < data.length; i++){
					var sn = i + 1
					var files = {}
					files.id = data[i].ref_id
					files.admission_no = data[i].admission_no
					files.name = data[i].student_name
					var sc = JSON.parse(data[i].score)
					var array_sc = []
					var info = {}
					for(var s = 0; s < sc.length; s++){
						
						info[sc[s].abbr] = sc[s].value
						//var info = {sc[s].abbr:sc[s].value}
						//array_sc.push(info)
					}
					var fl = {...files, ...info}
					fors.push(fl)
				}
				//console.log(fors)
				third_term_table = new Tabulator("#third_term_table", {
					//height:320, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
					//width:1240,
					height:"100%",
					height:"100%",
					data:fors, //assign data to table
					layout:"fitColumns", //fit columns to width of table (optional)
					//autoResize: false,
					addRowPos:"top",
					//resizableColumns: false,
					columns:column,
					rowClick:function(e, row){ //trigger an alert message when the row is clicked
						//alert("Row " + row.getData().id + " Clicked!!!!");
					},
					cellEditing:function(cell){},
					cellEdited:function(cell){
                        var new_d = cell.getRow().getData()
                        //console.log(new_d)
                        var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
						$.ajax({
							url: href,
							type: "POST",
							dataType: "json",
							timeout: 10000,
							data: {info:JSON.stringify([new_d]), academic_session:session, student_subject:ref_id, student_class:cls, session_term:'Third Term'},
                            beforeSend : function(req) {
                                req.setRequestHeader('Authorization', 'Bearer '+token);
                            },
							success: function(data) { 
								if(data.status == 200){}
								else
								{
									alert(data.message)
									cell.restoreOldValue();
								}
							},
							error: function(x, t, m) {
								if(t==="timeout") {
									alert("got timeout");
									cell.restoreOldValue();
								} else {
									alert(t);
									cell.restoreOldValue();
								}
							}
						});
                        
                    },
					validationFailed:function(cell, value, validators){
						
					//cell - cell component for the edited cell
					//value - the value that failed validation
					//validatiors - an array of validator objects that failed
					},
			   });
            }
        })
		
        
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
	$(document).on('click', '#first-processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		var data = first_term_table.getData()
		console.log(data)
		$('#first-processtransaction').addClass('d-none');
		$('#first-processing-btn').removeClass('d-none');
		var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
		$.ajax({
			type: 'POST',
			data: {info:JSON.stringify(data), academic_session:session, student_subject:ref_id, student_class:cls, session_term:'First Term'},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 200){
				alert(data.message)
				window.location.reload()
			}
			else
			{
				alert(data.message)
				$('#first-processtransaction').removeClass('d-none');
				$('#first-processing-btn').addClass('d-none');
			}
							
		});

	})


	$(document).on('click', '#second-processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		var data = second_term_table.getData()
		console.log(data)
		$('#second-processtransaction').addClass('d-none');
		$('#seconf-processing-btn').removeClass('d-none');
		var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
		$.ajax({
			type: 'POST',
			data: {info:JSON.stringify(data), academic_session:session, student_subject:ref_id, student_class:cls, session_term:'Second Term'},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 200){
				alert(data.message)
				window.location.reload()
			}
			else
			{
				alert(data.message)
				$('#second-processtransaction').removeClass('d-none');
				$('#second-processing-btn').addClass('d-none');
			}
							
		});

	})


	$(document).on('click', '#third-processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		var data = third_term_table.getData()
		console.log(data)
		$('#third-processtransaction').addClass('d-none');
		$('#third-processing-btn').removeClass('d-none');
		var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
		$.ajax({
			type: 'POST',
			data: {info:JSON.stringify(data), academic_session:session, student_subject:ref_id, student_class:cls, session_term:'Third Term'},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 200){
				alert(data.message)
				window.location.reload()
			}
			else
			{
				alert(data.message)
				$('#third-processtransaction').removeClass('d-none');
				$('#third-processing-btn').addClass('d-none');
			}
							
		});

	})
    
    $(document).on('click', '.remove_class_teacher', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        event.preventDefault()
        var sn = $(this).attr('data-id')
		var name =$(this).attr('data-name')
		var href = 'https://alxproject.virilesoftware.com/api/subjectteacher/'+ref_id;
		
        var con = confirm('You are about to delete class teacher: ' + name)
        if (con == true) {
            $.ajax({
                type: 'DELETE',
                data: {session:session, subject_id:ref_id, class_id:cls, teacher:sn},
                url: href,
                dataType: 'JSON',
                beforeSend: function (req) {
                    req.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }).done(function (data) {
                if (data.status == 'ok') {
                    alert(data.message)
					window.location.reload()
                    
                } else {
                    alert(data.message)
                }

            });
        } else {
            return false;
        }
    })
	
	
	
	
	
    $(document).on('click', '#load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		event.preventDefault()
		var token = auth.getToken();
        $('#load-submit').addClass('d-none');
		$('#processing-btn').removeClass('d-none');
        var name = $('#select_class').val();
        var passd = {'name': name, session:session, subject_id:ref_id, class_id:cls}
				
		var ref_id = $('head').attr('id')		
                $.ajax({
                    type: 'POST',
                    data: passd,
                    url: 'https://alxproject.virilesoftware.com/api/subjectteacher/'+ref_id,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
                    if (data.status == 'ok') {
						alert(data.message)
						
                        window.location.reload()
						
						
                    } else {
                        alert(data.message)
                        $('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
           

    });
	
	
	$(document).on('click', '.removeschoolclass', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        event.preventDefault()
        var ref_id = this.id
        var sn = $(this).attr('data-name')
		
        var con = confirm('You are about to ' + sn+' from subject')
        if (con == true) {
            $.ajax({
                type: 'DELETE',
                data: null,
                url: 'https://alxproject.virilesoftware.com/api/studentsubject/' + ref_id,
                dataType: 'JSON',
                beforeSend: function (req) {
                    req.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }).done(function (data) {
                if (data.status == 'ok') {
                    alert(data.msg)
					document.getElementById("row"+ref_id+"").outerHTML=""
                    //window.location.reload()
                } else {
                    alert(data.msg)
                }

            });
        } else {
            return false;
        }
    })
	
	
});