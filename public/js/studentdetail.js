$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var table = null
	var token = auth.getToken();
	var sess_id = 0
	var payload = jwt_decode(token);
	var ref_id = $('head').attr('id')
	if(auth.isLoggedIn())
	{
		var href = 'https://alxproject.virilesoftware.com/api/session';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			console.log(datas)
			for(var i = 0; i < datas.length; i++)
			{
				$('#academic_session').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				$('#academic_session_home').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
			}
			var href = 'https://alxproject.virilesoftware.com/api/academicsession';
			$.ajax({
				type: 'GET',
				data: null,
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(data){
				console.log(data)
				$('#academic_session').val(data.session_id)
				$('#academic_session').trigger('change')
				$('#academic_session_home').val(data.session_id)
				$('#academic_session_home').trigger('change')
				$('#session_term_home').val(data.term)
				$('#session_term_home').trigger('change')

				var href = 'https://alxproject.virilesoftware.com/api/studentbill/'+ref_id;
                $.ajax({
                    type: 'GET',
                    data: {session:data.session_id, term:data.term},
                    url: href,
                    dataType:'JSON',
                    beforeSend : function(req) {
                        req.setRequestHeader('Authorization', 'Bearer '+token);
                    }
                }).done(function(datas){
					console.log(datas)
                    if(datas.status == 'ok'){
                        var info = datas.data
                        var fees = info.fees_info
                        var html_fees = ''
                        for(var i = 0; i < fees.length; i++){
                            html_fees += '<tr>\
                            <th scope="row">'+fees[i].fees+'</th>\
                            <td>'+new Number(fees[i].amount).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].weaver).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].fine).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].payment).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].balance).toLocaleString('en')+'</td>\
                            </tr>'
                        }
                        html_fees += '<tr>\
                            <th scope="row">Total</th>\
                            <th scope="row">'+new Number(info.amount).toLocaleString('en')+'</th>\
                            <th scope="row">'+new Number(info.weaver).toLocaleString('en')+'</th>\
                            <th scope="row">'+new Number(info.fine).toLocaleString('en')+'</th>\
                            <th scope="row">'+new Number(info.payment).toLocaleString('en')+'</th>\
                            <th scope="row">'+new Number(info.balance).toLocaleString('en')+'</th>\
                            </tr>'
                        $('#bill_info').html(html_fees)
                    }
                })
                var href = 'https://alxproject.virilesoftware.com/api/studentbillpayment/'+ref_id;
                $.ajax({
                    type: 'GET',
                    data: {session:data.session_id, term:data.term},
                    url: href,
                    dataType:'JSON',
                    beforeSend : function(req) {
                        req.setRequestHeader('Authorization', 'Bearer '+token);
                    }
                }).done(function(fees){
                    var payload = jwt_decode(token);
                    var html_fees = ''
                    for(var i = 0; i < fees.length; i++){
                        var sn = i + 1
                            html_fees += '<tr id="'+fees[i].ref_id+'">\
                            <td>'+sn+'</td>\
                            <td>'+moment(fees[i].trans_date).format('DD/MM/YYYY')+'</td>\
                            <td>'+fees[i].receipt+'</td>\
                        <td>'+fees[i].payment_method+'</td>\
                            <td>'+new Number(fees[i].amount).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].prev_payment).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].due).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].paid).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].balance).toLocaleString('en')+'</td>\
                        <td><div class="user-btn-wrapper">\
                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+fees[i].ref_id+'" class="btn btn-oblong btn-sm btn-outline-primary btn-icon"\
                        data-toggle="tooltip-success" data-placement="top" title="View Bill">View Invoice</a>\
                        </div></td>\
                            </tr>'
                    }
                    $('#billpayment_info').html(html_fees)
                    
                })
				
			});
		});
		
		var href = 'https://alxproject.virilesoftware.com/api/classarm';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			//console.log(datas)
			for(var i = 0; i < datas.length; i++)
			{
				$('#student_class').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
			}
		});

		
		var href = 'https://alxproject.virilesoftware.com/api/studentdetail/'+ref_id;
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			//console.log(datas)
			var payload = jwt_decode(token);
			if(datas.status == 'ok'){
				var info = datas.data
				var bio = '<div class="media">\
                  <img src="'+info.passport+'" alt="">\
                  <div class="media-body">\
                    <h3 class="card-profile-name">'+info.name+'</h3>\
                    <p class="card-profile-position">Class : <a href="#">'+info.student_class+'</a></p>\
				<p class="card-profile-position">Admission No : <a href="#">'+info.admission_no+'</a></p>\
				<p class="card-profile-position">Gender : <a href="#">'+info.gender+'</a></p>\
					</div><!-- media-body -->\
                </div><!-- media -->'
				$('#biodata').html(bio)
				
				var fee = '<div class="row row-xs">\
				<div class="col-12">Due Fees</div>\
                <div class="col-12 col-text tx-danger">N'+new Number(info.due).toLocaleString('en')+'</div>\
                </div><!-- row --><hr>\
				<div class="row row-xs">\
				<div class="col-12">Enrolled</div>\
                <div class="col-12 col-text tx-primary">'+moment(info.admission_date).format('DD, MMM YYYY')+'</div>\
                </div><!-- row -->'
				$('#fees_info').html(fee)
				
				var access = datas.access
				var htmls = ''
				if(access.edit_student){
					htmls += '<a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/editstudentdetail/'+ref_id+'">Edit Profile</a>'
				}
				if(access.edit_student_class){
					htmls += '<a href="#" class="editstudentclass" data-id="'+info.session_id+'">Change Class</a>'
				}
				/*if(access.edit_student_session){
					//htmls += '<a href="#" class="editstudentsession">Change Session</a>'
				}
				if(access.edit_student_subject){
					htmls += '<a href="#">Edit Subject</a>'
				}*/
				$('#footer_pro').html(htmls)

				var htmls = ''
                htmls += '<tr><td>Admission Date</td><td>'+info.admission_date+'</td></tr>'
                htmls += '<tr><td>Address</td><td>'+info.address+'</td></tr>'
                htmls += '<tr><td>City</td><td>'+info.city+'</td></tr>'
                htmls += '<tr><td>State</td><td>'+info.state+'</td></tr>'
                htmls += '<tr><td>Country</td><td>'+info.country+'</td></tr>'
                htmls += '<tr><td>Nationality</td><td>'+info.nationality+'</td></tr>'
                htmls += '<tr><td>Hobbies</td><td>'+info.hobbies+'</td></tr>'
                htmls += '<tr><td>Special Ailment</td><td>'+info.ailment+'</td></tr>'
                htmls += '<tr><td>Disability</td><td>'+info.disability+'</td></tr>'
                $('#biodatabody').html(htmls)

				var ghtmls = ''
                ghtmls += '<tr><td>Name</td><td>'+info.guardian_name+'</td></tr>'
                ghtmls += '<tr><td>Phone</td><td>'+info.guardian_phone+'</td></tr>'
                ghtmls += '<tr><td>Email</td><td>'+info.guardian_email+'</td></tr>'
                ghtmls += '<tr><td>Occupation</td><td>'+info.guardian_occupation+'</td></tr>'
                ghtmls += '<tr><td>Relationship</td><td>'+info.guardian_relationship+'</td></tr>'
                ghtmls += '<tr><td>Address</td><td>'+info.guardian_address+'</td></tr>'
                $('#guardianbody').html(ghtmls)

				var thtml = ''
            //     var report = info.reportcard
            //     thtml += '<tr><td>'+report.class_arm+'</td><td>'+report.session+'</td><td>'+report.term+'</td>\
            //     <td><a href="#" id="download_result'+report.ref_id+'" class="btn btn-success btn-sm download_result" data-id="'+report.ref_id+'" data-term="'+report.term+'">Download Result</a>\
            //     <div class="d-none" id="loading'+report.ref_id+'"><div class="d-flex bg-gray-200 ht-40 pos-relative align-items-center " >\
            //     <div class="sk-wave">\
            //       <div class="sk-rect sk-rect1 bg-gray-800"></div>\
            //       <div class="sk-rect sk-rect2 bg-gray-800"></div>\
            //       <div class="sk-rect sk-rect3 bg-gray-800"></div>\
            //       <div class="sk-rect sk-rect4 bg-gray-800"></div>\
            //       <div class="sk-rect sk-rect5 bg-gray-800"></div>\
            //     </div>\
            //   </div></div></td></tr>'
            //     $('#reportcardbody').html(thtml)

            var report = info.reportcard
                for(let j = 0; j < report.length; j++){
                    thtml += '<tr><td>'+report[j].class_arm+'</td><td>'+report[j].session+'</td><td>'+report[j].term+'</td>\
                <td><div><a href="#" id="download_result'+report[j].ref_id+'" class="btn btn-success btn-sm download_result" data-id="'+report[j].ref_id+'" data-term="'+report[j].term+'">Download Result</a>\
                <div class="d-none" id="loading'+report[j].ref_id+'">\
                <div class="d-flex bg-gray-200 ht-40 pos-relative align-items-center " >\
                <div class="sk-wave">\
                  <div class="sk-rect sk-rect1 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect2 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect3 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect4 bg-gray-800"></div>\
                  <div class="sk-rect sk-rect5 bg-gray-800"></div>\
                </div>\
              </div></div></div></td></tr>'
                }
                
                $('#reportcardbody').html(thtml)


			}
			else{
				alert(datas.msg)
			
			}
		});
		

		var href = 'https://alxproject.virilesoftware.com/api/studentnotice/'+ref_id;
        $.ajax({
            type: 'GET',
            data: null,
            url: href,
            dataType:'JSON',
            beforeSend : function(req) {
                req.setRequestHeader('Authorization', 'Bearer '+token);
            }
        }).done(function(datas){
            //console.log(datas)
            if(datas.status == 'ok'){
                var data = datas.data
                if(data.length > 0){
                var htmlss = '<div class="timeline-item timeline-day">\
                <div class="timeline-time">&nbsp;</div>\
                <div class="timeline-body">\
                  <p class="timeline-date">Today</p>\
                </div><!-- timeline-body -->\
              </div><!-- timeline-item -->'
                for(var i = 0; i < data.length; i++){
                    htmlss += '<div class="timeline-item">\
                    <div class="timeline-time">'+data[i].publish_date+'</div>\
                    <div class="timeline-body">\
                      <p class="timeline-title"><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/newsfeed/'+data[i].ref_id+'">'+data[i].subject+'</a></p>\
                      <p class="timeline-author"><a href="#">'+data[i].author+'</a> '+data[i].destination+'</p>\
                      <p class="timeline-text"><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/newsfeed/'+data[i].ref_id+'" style="color:black;">'+data[i].summary+'</a></p>\
                      </div><!-- timeline-body -->\
                  </div><!-- timeline-item -->'
                }
                $('#newsfeed_panel').html(htmlss)
            }
            }
        })
		
        
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
	$(document).on('click', '.editstudentclass', function (event) {
		event.preventDefault()
		sess_id = $(this).attr('data-id')
		$('#updatestudent_modal').modal('show'); 
        
    })
	
	$(document).on('click', '.editstudentsession', function (event) {
		event.preventDefault()
		$('#updatesession_modal').modal('show'); 
        
    })
	
    $(document).on('click', '#bill_search_home', function (event) {
		event.preventDefault()
        $('#bill_info').html("")
        var href = 'https://alxproject.virilesoftware.com/api/studentbill/'+ref_id;
        $.ajax({
            type: 'GET',
                    data: {session:$('#academic_session_home').val(), term:$('#session_term_home').val()},
                    url: href,
                    dataType:'JSON',
                    beforeSend : function(req) {
                        req.setRequestHeader('Authorization', 'Bearer '+token);
                    }
                }).done(function(datas){
                    console.log(datas)
                    if(datas.status == 'ok'){
                        var info = datas.data
                        var fees = info.fees_info
                        var html_fees = ''
                        for(var i = 0; i < fees.length; i++){
                            html_fees += '<tr>\
                            <th scope="row">'+fees[i].fees+'</th>\
                            <td>'+new Number(fees[i].amount).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].weaver).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].fine).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].payment).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].balance).toLocaleString('en')+'</td>\
                            </tr>'
                        }
                        html_fees += '<tr>\
                            <th scope="row">Total</th>\
                            <th scope="row">'+new Number(info.amount).toLocaleString('en')+'</th>\
                            <th scope="row">'+new Number(info.weaver).toLocaleString('en')+'</th>\
                            <th scope="row">'+new Number(info.fine).toLocaleString('en')+'</th>\
                            <th scope="row">'+new Number(info.payment).toLocaleString('en')+'</th>\
                            <th scope="row">'+new Number(info.balance).toLocaleString('en')+'</th>\
                            </tr>'
                        $('#bill_info').html(html_fees)
                    }
                })
                var href = 'https://alxproject.virilesoftware.com/api/studentbillpayment/'+ref_id;
                $.ajax({
                    type: 'GET',
                    data: {session:$('#academic_session_home').val(), term:$('#session_term_home').val()},
                    url: href,
                    dataType:'JSON',
                    beforeSend : function(req) {
                        req.setRequestHeader('Authorization', 'Bearer '+token);
                    }
                }).done(function(fees){
                    var payload = jwt_decode(token);
                    var html_fees = ''
                    for(var i = 0; i < fees.length; i++){
                        var sn = i + 1
                            html_fees += '<tr id="'+fees[i].ref_id+'">\
                            <td>'+sn+'</td>\
                            <td>'+moment(fees[i].trans_date).format('DD/MM/YYYY')+'</td>\
                            <td>'+fees[i].receipt+'</td>\
                        <td>'+fees[i].payment_method+'</td>\
                            <td>'+new Number(fees[i].amount).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].prev_payment).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].due).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].paid).toLocaleString('en')+'</td>\
                            <td>'+new Number(fees[i].balance).toLocaleString('en')+'</td>\
                        <td><div class="user-btn-wrapper">\
                            <a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+fees[i].ref_id+'" class="btn btn-oblong btn-sm btn-outline-primary btn-icon"\
                        data-toggle="tooltip-success" data-placement="top" title="View Bill">View Invoice</a>\
                        </div></td>\
                            </tr>'
                    }
                    $('#billpayment_info').html(html_fees)
                    
                })

        
                
	})
	
	
	$(document).on('click', '#load-submit_class', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#updatestudentclassform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('#load-submit_class').addClass('d-none');
				$('#processing-btn_class').removeClass('d-none');
                var sch_class = $('#student_class').select2('data')[0].id
                var passd = {
                    sch_class:sch_class
                }
				var ref_id = $('head').attr('id')
                var href = 'https://alxproject.virilesoftware.com/api/studentclass/'+sess_id;
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
						 window.location.reload()
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#load-submit_class').removeClass('d-none');
                        $('#processing-btn_class').addClass('d-none');
                    }

                });
            }
        })

    });
	
	
	$(document).on('click', '#load-submit_session', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#updatesessionform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('#load-submit_session').addClass('d-none');
				$('#processing-btn_session').removeClass('d-none');
                var sch_class = $('#academic_session').select2('data')[0].id
                var passd = {
                    sch_class:sch_class
                }
				var ref_id = $('head').attr('id')
                var href = 'https://alxproject.virilesoftware.com/api/studentsession/'+ref_id;
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
						 window.location.reload()
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#load-submit_session').removeClass('d-none');
                        $('#processing-btn_session').addClass('d-none');
                    }

                });
            }
        })

    });
	
});