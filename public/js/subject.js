$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var token = auth.getToken();
	var constraints = {
         sch_class: {
             presence: true,
          },
	};
	var basic_index = 0
	var jss_index = 0
	var sss_index = 0
	if(auth.isLoggedIn())
	{
		var href = 'https://alxproject.virilesoftware.com/api/basicsubjectadmin';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			//console.log(data)
			var data = datas.data
			if(datas.add == true){
				$('.addsubject').removeClass('d-none')
			}
			if(datas.edit == true){
					var edit = ''
				}
				else{
					var edit = 'd-none'
				}
				if(datas.delete == true){
					var del = ''
				}
				else{
					var del = 'd-none'
				}
			var htmls = ''
			var amount  = 0
			for(i = 0; i < data.length; i++)
			{
				if(data[i].editable == true){
					htmls +=
					  '<tr id="basicrow'+data[i].ref_id+'">\
					  <td style="padding-top:20px" colspan="4">'+ data[i].name + '</td>\
					  <td><div class="user-btn-wrapper">\
                    <a href="#" class="btn btn-outline-warning btn-icon  editsubject '+edit+'" id="' +data[i].ref_id + '" data-class="basic" data-name ="' + data[i].name + '" >\
                      <div class="tx-20"><i class="fa fa-edit"></i></div>\
                    </a>\
                  <a href="#" class="btn btn-outline-danger btn-icon removesubject '+del+'" id="' +data[i].ref_id + '" data-class="basic"  data-name ="' + data[i].name + '" >\
                      <div class="tx-20"><i class="fa fa-trash"></i></div>\
                    </a>\
                    </div></td>\
				   </tr>';
				  }
				  else{
					htmls +=
					  '<tr id="row'+data[i].ref_id+'">\
					  <td colspan="4">'+ data[i].name + '</td>\
					  <td></td>\
				   </tr>';
				  }
					
			}
			$('#basicbody').html(htmls)
			
		});
		
		
		var href = 'https://alxproject.virilesoftware.com/api/jsssubjectadmin';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			//console.log(data)
			var data = datas.data
			if(datas.add == true){
				$('.addsubject').removeClass('d-none')
			}
			if(datas.edit == true){
					var edit = ''
				}
				else{
					var edit = 'd-none'
				}
				if(datas.delete == true){
					var del = ''
				}
				else{
					var del = 'd-none'
				}
			var htmls = ''
			var amount  = 0
			for(i = 0; i < data.length; i++)
			{
				if(data[i].editable == true){
					htmls +=
					  '<tr id="jssrow'+data[i].ref_id+'">\
					  <td style="padding-top:20px" colspan="4">'+ data[i].name + '</td>\
					  <td><div class="user-btn-wrapper">\
                    <a href="#" class="btn btn-outline-warning btn-icon  editsubject '+edit+'" id="' +data[i].ref_id + '" data-class="jss" data-name ="' + data[i].name + '" >\
                      <div class="tx-20"><i class="fa fa-edit"></i></div>\
                    </a>\
                  <a href="#" class="btn btn-outline-danger btn-icon removesubject '+del+'" id="' +data[i].ref_id + '" data-class="jss"  data-name ="' + data[i].name + '" >\
                      <div class="tx-20"><i class="fa fa-trash"></i></div>\
                    </a>\
                    </div></td>\
				   </tr>';
				  }
				  else{
					htmls +=
					  '<tr id="row'+data[i].ref_id+'">\
					  <td colspan="4">'+ data[i].name + '</td>\
					  <td></td>\
				   </tr>';
				  }
					
			}
			$('#jssbody').html(htmls)
			
		});
		
		var href = 'https://alxproject.virilesoftware.com/api/ssssubjectadmin';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			//console.log(data)
			var data = datas.data
			if(datas.add == true){
				$('.addsubject').removeClass('d-none')
			}
			if(datas.edit == true){
					var edit = ''
				}
				else{
					var edit = 'd-none'
				}
				if(datas.delete == true){
					var del = ''
				}
				else{
					var del = 'd-none'
				}
			var htmls = ''
			var amount  = 0
			for(i = 0; i < data.length; i++)
			{
				if(data[i].editable == true){
					htmls +=
					  '<tr id="sssrow'+data[i].ref_id+'">\
					  <td style="padding-top:20px" colspan="4">'+ data[i].name + '</td>\
					  <td><div class="user-btn-wrapper">\
                    <a href="#" class="btn btn-outline-warning btn-icon  editsubject '+edit+'" id="' +data[i].ref_id + '" data-class="sss" data-name ="' + data[i].name + '" >\
                      <div class="tx-20"><i class="fa fa-edit"></i></div>\
                    </a>\
                  <a href="#" class="btn btn-outline-danger btn-icon removesubject '+del+'" id="' +data[i].ref_id + '" data-class="sss"  data-name ="' + data[i].name + '" >\
                      <div class="tx-20"><i class="fa fa-trash"></i></div>\
                    </a>\
                    </div></td>\
				   </tr>';
				  }
				  else{
					htmls +=
					  '<tr id="row'+data[i].ref_id+'">\
					  <td colspan="4">'+ data[i].name + '</td>\
					  <td></td>\
				   </tr>';
				  }
					
			}
			$('#sssbody').html(htmls)
		})
        
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
    
    $(document).on('click', '.removesubject', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        event.preventDefault()
        var ref_id = this.id
        var sn = $(this).attr('data-name')
		var dt = $(this).attr('data-class')
		var href = 'https://alxproject.virilesoftware.com/api/subject/'+ref_id;
		
        var con = confirm('You are about to delete school class: ' + sn)
        if (con == true) {
            $.ajax({
                type: 'DELETE',
                data: null,
                url: href,
                dataType: 'JSON',
                beforeSend: function (req) {
                    req.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }).done(function (data) {
                if (data.status == 'ok') {
                    alert(data.msg)
					if(dt == 'basic'){
						document.getElementById("basicrow"+ref_id+"").outerHTML=""
					}
					else if(dt == 'jss'){
						document.getElementById("jssrow"+ref_id+"").outerHTML=""
					}
					else{
						document.getElementById("sssrow"+ref_id+"").outerHTML=""
					}
                    
                } else {
                    alert(data.msg)
                }

            });
        } else {
            return false;
        }
    })
	
	
	$(document).on('click', '.addsubject', function (event) {
		event.preventDefault()
		$('#addsubject_modal').attr('data-class', $(this).attr('data-class')) 
		$('#addsubject_modal').modal('show'); 
        
    })
	
	
	$(document).on('click', '.editsubject', function (event) {
		event.preventDefault()
		var ref_id = this.id
		var dt = $(this).attr('data-class')
		table_index = this.parentNode.parentNode.rowIndex;
		$('#edit_sch_subject').val($(this).attr('data-name'))
		$('#updatesubject_modal').attr('data-ref', ref_id) 
		$('#updatesubject_modal').attr('data-class', dt) 
		$('#updatesubject_modal').modal('show'); 
        
    })
	
	
	
	
	
    $(document).on('click', '#load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#schoolclassform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('#load-submit').addClass('d-none');
				$('#processing-btn').removeClass('d-none');
                var name = $('input[name=sch_subject]').val();
                var passd = {
                    'name': name,
                }
				var ref_id = $('#addsubject_modal').attr('data-class') 
				if(ref_id == 'basic'){
					var href = 'https://alxproject.virilesoftware.com/api/basicsubject';
				}
				else if(ref_id == 'jss'){
					var href = 'https://alxproject.virilesoftware.com/api/jsssubject'
				}
				else{
					var href = 'https://alxproject.virilesoftware.com/api/ssssubject';
				}
				
                $.ajax({
                    type: 'POST',
                    data: passd,
                    url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
                    if (data.status == 'ok') {
						alert(data.msg)
						if(ref_id == 'basic'){
							var table = document.getElementById("basicdata");
							var tbl = $('table#basicdata  tr:last').index() + 1
							var thtmls =
							  '<tr id="basicrow'+data.ref_id+'">\
							  <td style="padding-top:20px" colspan="4">'+ data.name + '</td>\
							  <td><div class="user-btn-wrapper">\
							<a href="#" class="btn btn-outline-warning btn-icon  editsubject" id="' +data.ref_id + '" data-class="basic" data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-edit"></i></div>\
							</a>\
						  <a href="#" class="btn btn-outline-danger btn-icon removesubject" id="' +data.ref_id + '" data-class="basic"  data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-trash"></i></div>\
							</a>\
							</div></td>\
						   </tr>';
							var row = table.insertRow(tbl).outerHTML = thtmls;
						}
						else if(ref_id == 'jss'){
							var table = document.getElementById("jssdata");
							var tbl = $('table#jssdata  tr:last').index() + 1
							var thtmls =
							  '<tr id="jssrow'+data.ref_id+'">\
							  <td style="padding-top:20px" colspan="4">'+ data.name + '</td>\
							  <td><div class="user-btn-wrapper">\
							<a href="#" class="btn btn-outline-warning btn-icon  editsubject" id="' +data.ref_id + '" data-class="jss" data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-edit"></i></div>\
							</a>\
						  <a href="#" class="btn btn-outline-danger btn-icon removesubject" id="' +data.ref_id + '" data-class="jss"  data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-trash"></i></div>\
							</a>\
							</div></td>\
						   </tr>';
							var row = table.insertRow(tbl).outerHTML = thtmls;
						}
						else{
							var table = document.getElementById("sssdata");
							var tbl = $('table#sssdata  tr:last').index() + 1
							var thtmls =
							  '<tr id="sssrow'+data.ref_id+'">\
							  <td style="padding-top:20px" colspan="4">'+ data.name + '</td>\
							  <td><div class="user-btn-wrapper">\
							<a href="#" class="btn btn-outline-warning btn-icon  editsubject" id="' +data.ref_id + '" data-class="sss" data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-edit"></i></div>\
							</a>\
						  <a href="#" class="btn btn-outline-danger btn-icon removesubject" id="' +data.ref_id + '" data-class="sss"  data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-trash"></i></div>\
							</a>\
							</div></td>\
						   </tr>';
							var row = table.insertRow(tbl).outerHTML = thtmls;
						}
                        
						$('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						$('#addsubject_modal').modal('hide');
						$('input[name=sch_subject]').val('');
						
                    } else {
                        alert(data.msg)
                        $('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
	
	$(document).on('click', '#edit_load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#updatesubjectform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('#edit_load-submit').addClass('d-none');
				$('#edit_processing-btn').removeClass('d-none');
                var name = $('input[name=edit_sch_subject]').val();
                var passd = {
                    'name': name,
                }
				var ref_id = $('#updatesubject_modal').attr('data-ref') 
				var dt = $('#updatesubject_modal').attr('data-class') 
				var href = 'https://alxproject.virilesoftware.com/api/subject/'+ref_id;

                $.ajax({
                    type: 'PUT',
                    data: passd,
                    url: href,
                    dataType: 'JSON',
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', 'Bearer ' + token);
                    }
                }).done(function (data) {
					console.log(data)
                    if (data.status == 'ok') {
						alert(data.msg)
						if(dt == 'basic'){
							var thtmls =
							  '<td style="padding-top:20px" colspan="4">'+ data.name + '</td>\
							  <td><div class="user-btn-wrapper">\
							<a href="#" class="btn btn-outline-warning btn-icon  editsubject" id="' +data.ref_id + '" data-class="basic" data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-edit"></i></div>\
							</a>\
						  <a href="#" class="btn btn-outline-danger btn-icon removesubject" id="' +data.ref_id + '" data-class="basic"  data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-trash"></i></div>\
							</a>\
							</div></td>\
						   ';
						 $('#basicrow'+data.ref_id).html( thtmls)
						}
						else if(dt == 'jss'){
							var thtmls =
							  '<td style="padding-top:20px" colspan="4">'+ data.name + '</td>\
							  <td><div class="user-btn-wrapper">\
							<a href="#" class="btn btn-outline-warning btn-icon  editsubject" id="' +data.ref_id + '" data-class="jss" data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-edit"></i></div>\
							</a>\
						  <a href="#" class="btn btn-outline-danger btn-icon removesubject" id="' +data.ref_id + '" data-class="sss"  data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-trash"></i></div>\
							</a>\
							</div></td>\
						   ';
							$('#jssrow'+data.ref_id).html( thtmls)
						}
						else{
							var thtmls =
							  '<td style="padding-top:20px" colspan="4">'+ data.name + '</td>\
							  <td><div class="user-btn-wrapper">\
							<a href="#" class="btn btn-outline-warning btn-icon  editsubject" id="' +data.ref_id + '" data-class="sss" data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-edit"></i></div>\
							</a>\
						  <a href="#" class="btn btn-outline-danger btn-icon removesubject" id="' +data.ref_id + '" data-class="sss"  data-name ="' + data.name + '" >\
							  <div class="tx-20"><i class="fa fa-trash"></i></div>\
							</a>\
							</div></td>\
						   ';
							$('#sssrow'+data.ref_id).html( thtmls)
							
						}
						
						
						$('#edit_load-submit').removeClass('d-none');
                        $('#edit_processing-btn').addClass('d-none');
						$('input[name=edit_sch_subject]').val('');
						$('#updatesubject_modal').modal('hide');
						
                    } else {
                        alert(data.msg)
                        $('#edit_load-submit').removeClass('d-none');
                        $('#edit_processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
	
	
});