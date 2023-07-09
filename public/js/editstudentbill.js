$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var table = null
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
			console.log(data)
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
				var fors  = []
				for(var i = 0; i < fees.length; i++){
					var sn = i + 1
					var files = {}
					files.id = fees[i].ref_id
					files.fees = fees[i].fees
					files.amount = fees[i].amount
					files.weaver = fees[i].weaver
					files.fine = fees[i].fine
					files.payment = fees[i].payment
					files.balance = fees[i].balance
					fors.push(files)
					
					
				}
				table = new Tabulator("#example-table", {
					//height:320, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
					data:fors, //assign data to table
					layout:"fitColumns", //fit columns to width of table (optional)
					columns:[ //Define Table Columns
						{title:"Fees Type", field:"fees"},
						{title:"Amount", field:"amount", align:"center",editor:"input", validator:["required", "numeric"]},
						{title:"Weaver", field:"weaver",  align:"center",editor:"input", validator:["required", "numeric"]},
						{title:"Fine", field:"fine",  align:"center",editor:"input", validator:["required", "numeric"]},
						
						
					],
					rowClick:function(e, row){ //trigger an alert message when the row is clicked
						//alert("Row " + row.getData().id + " Clicked!!!!");
					},
					validationFailed:function(cell, value, validators){
						
					//cell - cell component for the edited cell
					//value - the value that failed validation
					//validatiors - an array of validator objects that failed
					},
			   });
				html_fees += '<tr>\
					  <th scope="row">Total</th>\
					  <th scope="row">'+new Number(info.amount).toLocaleString('en')+'</th>\
					  <th scope="row">'+new Number(info.payment).toLocaleString('en')+'</th>\
					  <th scope="row">'+new Number(info.weaver).toLocaleString('en')+'</th>\
					  <th scope="row">'+new Number(info.fine).toLocaleString('en')+'</th>\
					  <th scope="row">'+new Number(info.balance).toLocaleString('en')+'</th>\
					</tr>'
				//$('#bill_info').html(html_fees)
			}
			else{
				alert(data.msg)
				window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/fees_management'
			}
			
		});
		
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('click', '#applybill', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		//console.log(table.getData())
		var amount = 0
		var weaver = 0
		var fine = 0
		var total = 0
		var data = table.getData()
		for(var i = 0; i < data.length; i++)
		{
			amount = math.chain(amount).add(data[i].amount).done()
			weaver = math.chain(weaver).add(data[i].weaver).done()
			fine = math.chain(fine).add(data[i].fine).done()
			
		}
		
		total = math.chain(amount).add(fine).subtract(weaver).done()
		var htmls = '<h3>Summary</h3><table cellpadding="1" cellspacing="1" class="table table-bordered table-striped">\
                    <tbody>'
                    htmls += '<tr><td>Total Fees</td><td>' + new Number(amount).toLocaleString('en')+'</td></tr>'
                    htmls += '<tr><td>Total Weaver</td><td>'+new Number(weaver).toLocaleString('en')+'</td></tr>'
                    htmls += '<tr><td>Total fine</td><td>'+new Number(fine).toLocaleString('en')+'</td></tr>'
					htmls += '<tr><td><h4 class="text-danger">Total Amount</h4></td><td><h4>' + new Number(total).toLocaleString('en')+'</h4></td></tr>'
                    htmls += '</tbody></table>'
	$('#billsummary').html(htmls)	
	//$('#saveproduct').removeClass('d-none')
	$('#processtransaction').removeClass('d-none')
	})
	
	$(document).on('click', '#processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        event.preventDefault()
		var token = auth.getToken();
		var data = table.getData()
		console.log(data)
		//$('#processtransaction').addClass('d-none');
		//$('#processing-btn').removeClass('d-none');
		var href = 'https://alxproject.virilesoftware.com/api/studentfees/'+ref;
		$.ajax({
			type: 'PUT',
			data: {info:JSON.stringify(table.getData())},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			var payload = jwt_decode(token);
			if(data.status == 'ok')
			{
				alert(data.msg)
				window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbill/'+ref
			}
			else
			{
				alert(data.message)
				$('#processtransaction').removeClass('d-none');
				$('#processing-btn').addClass('d-none');
			}
					
		});
		
	})
	
});