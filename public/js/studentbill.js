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
	var table_index = 0
	
        
	if(auth.isLoggedIn())
	{
		
        
		var ref = $('head').attr('id')
		var href = 'https://alxproject.virilesoftware.com/api/studentfees/'+ref;
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			//console.log(data)
			var payload = jwt_decode(token);
			if(data.status == 'ok'){
				var info = data.data
				var htmls = '<div class="card-contact">\
                  <div class="tx-center">\
                    <a href="#"><img src="'+info.passport+'" class="card-img" alt=""></a>\
                    <h5 class="mg-t-10 mg-b-5"><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+info.student_id+'" class="contact-name">'+info.name+'</a></h5>\
                    <p>'+info.admission_no+'</p>\
             </div><!-- tx-center -->\
				<p class="contact-item">\
				<span>Class:</span>\
                    <span>'+info.student_class+'</span>\
                  </p><!-- contact-item -->\
                  <p class="contact-item">\
                    <span>Guardian:</span>\
                    <span>'+info.guardian_name+'</span>\
                  </p><!-- contact-item -->\
                  <p class="contact-item">\
                    <span>Guardian Phone:</span>\
                    <span>'+info.guardian_phone+'</span>\
                  </p><!-- contact-item -->\
				</div><!-- card -->'
				$('#student_info').html(htmls)
				
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
			else{
				alert(data.msg)
				window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/fees_management'
			}
			
		});
		
		var ref = $('head').attr('id')
		var href = 'https://alxproject.virilesoftware.com/api/studentfeespayment/'+ref;
		$.ajax({
			type: 'GET',
			data: null,
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
		
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
	
	
	
});