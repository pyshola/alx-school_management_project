function replacecomma(text){
	text = ''+text
	var dt = text.replace(/,/g, '');
	return dt
}
	
var editCheck = function(cell){
    //cell - the cell component for the editable cell
	//console.log(cell.getRow().getData())
	var id = cell.getRow().getData().id
	if(id == 0){
		return false
	}
	else{
		return true
	}
    //get row data
	//var len = cell.getRow().getTable()
	//console.log(len)
    //var data = cell.getRow().getData();

    //return true; // only allow the name cell to be edited if the age is over 18
}

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
		var href = 'https://alxproject.virilesoftware.com/api/schoolaccount';
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
			
			var htmls = ''
			var amount  = 0
			for(var i = 0; i < data.length; i++)
			{
				$('.bank_acct').append('<option value="'+data[i].ref_id+'">'+data[i].bank+' - '+data[i].account_no+'</option>')
			}
		})
        
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
				var fors  = []
				for(var i = 0; i < fees.length; i++){
					var sn = i + 1
					var files = {}
					files.id = fees[i].ref_id
					files.fees = fees[i].fees
					files.amount = new Number(fees[i].amount).toLocaleString('en')
					files.weaver = new Number(fees[i].weaver).toLocaleString('en')
					files.fine = new Number(fees[i].fine).toLocaleString('en')
					files.paid = new Number(fees[i].payment).toLocaleString('en')
					files.balance = new Number(fees[i].balance).toLocaleString('en')
					files.payment = 0
					var total = math.chain(fees[i].amount).add(fees[i].fine).subtract(fees[i].weaver).done()
					files.total = new Number(total).toLocaleString('en')
					fors.push(files)
					
					
				}
				var files = {}
				files.id = 0
				files.fees = 'Total'
				files.amount = new Number(info.amount).toLocaleString('en')
				files.weaver = new Number(info.weaver).toLocaleString('en')
				files.fine = new Number(info.fine).toLocaleString('en')
				files.paid = new Number(info.payment).toLocaleString('en')
				files.balance = new Number(info.balance).toLocaleString('en')
				files.payment = 0
				var total = math.chain(info.amount).add(info.fine).subtract(info.weaver).done()
				files.total = new Number(total).toLocaleString('en')
				fors.push(files)
				table = new Tabulator("#example-table", {
					//height:320, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
					data:fors, //assign data to table
					layout:"fitColumns", //fit columns to width of table (optional)
					columns:[ //Define Table Columns
						{title:"Fees Type", field:"fees"},
						//{title:"Amount", field:"amount"},
						//{title:"Weaver", field:"weaver"},
						//{title:"Fine", field:"fine"},
						{title:"Amount", field:"total"},
						//{title:"Paid", field:"paid"},
						{title:"Due", field:"balance"},
						{title:"Payment", field:"payment",  align:"center",editor:"input", validator:["required", "numeric"], editable:editCheck},
						
						
					],
					rowClick:function(e, row){ //trigger an alert message when the row is clicked
						//alert("Row " + row.getData().id + " Clicked!!!!");
					},
					cellEditing:function(cell){
						//console.log(cell)
						
					},
					cellEdited:function(cell){
						var len = fors.length - 1
						var amt = replacecomma(fors[len].payment)
						var old = cell.getOldValue()
						var new_d = cell.getRow().getData().payment
						var bal = math.chain(new_d).subtract(old).done()
						var d = math.chain(amt).add(bal).done()
						fors[len].payment = new Number(d).toLocaleString('en')
						var t = cell.getTable()
						var t_len = cell.getTable().getRows().length - 1
						var row = t.getRow(t_len)
						t.updateRow(row, {payment:new Number(d).toLocaleString('en')})
					},
					validationFailed:function(cell, value, validators){
						
					//cell - cell component for the edited cell
					//value - the value that failed validation
					//validatiors - an array of validator objects that failed
					},
			   });
				
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
	
	
	$(document).on('change', '#category', function (event) {
		var cat = $(this).val()
		if(cat == 1){
			$('#teller_payment_info').addClass('d-none')
			$('#transfer_payment_info').addClass('d-none')
			$('#pos_payment_info').addClass('d-none')
			$('#check_payment_info').addClass('d-none')
			$('#cash_payment_info').removeClass('d-none')
		}
		if(cat == 2){
			$('#cash_payment_info').addClass('d-none')
			$('#transfer_payment_info').addClass('d-none')
			$('#pos_payment_info').addClass('d-none')
			$('#check_payment_info').addClass('d-none')
			$('#teller_payment_info').removeClass('d-none')
		}
		if(cat == 3){
			$('#cash_payment_info').addClass('d-none')
			$('#teller_payment_info').addClass('d-none')
			$('#pos_payment_info').addClass('d-none')
			$('#check_payment_info').addClass('d-none')
			$('#transfer_payment_info').removeClass('d-none')
		}
		if(cat == 4){
			$('#cash_payment_info').addClass('d-none')
			$('#teller_payment_info').addClass('d-none')
			$('#transfer_payment_info').addClass('d-none')
			$('#pos_payment_info').addClass('d-none')
			$('#check_payment_info').removeClass('d-none')
		}
		if(cat == 5){
			$('#cash_payment_info').addClass('d-none')
			$('#teller_payment_info').addClass('d-none')
			$('#transfer_payment_info').addClass('d-none')
			$('#check_payment_info').addClass('d-none')
			$('#pos_payment_info').removeClass('d-none')
			
		}
		
	})
	$(document).on('click', '#applybill', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		//console.log(table.getData())
		var amount = 0
		var due = 0
		var payment = 0
		var total = 0
		var data = table.getData()
		for(var i = 0; i < data.length; i++)
		{
			if(i == data.length - 1){}
			else{
			console.log(replacecomma(data[i].total))
			console.log(replacecomma(data[i].balance))
			console.log(replacecomma(data[i].payment))
			amount = math.chain(amount).add(replacecomma(data[i].total)).done()
			due = math.chain(due).add(replacecomma(data[i].balance)).done()
			payment = math.chain(payment).add(replacecomma(data[i].payment)).done()
			}
			
		}
		
		var balance = math.chain(due).subtract(payment).done()
		var htmls = '<h3>Summary</h3><table cellpadding="1" cellspacing="1" class="table table-bordered table-striped">\
                    <tbody>'
                    htmls += '<tr><td>Total Fees</td><td>' + new Number(amount).toLocaleString('en')+'</td></tr>'
                    htmls += '<tr><td>Total Due Amount</td><td>'+new Number(due).toLocaleString('en')+'</td></tr>'
                    htmls += '<tr><td><h5 class="text-success">Total Payment</h5></td><td><h5 class="text-success">'+new Number(payment).toLocaleString('en')+'</h5></td></tr>'
					htmls += '<tr><td><h4 class="text-danger">Total Balance</h4></td><td><h4 class="text-danger">' + new Number(balance).toLocaleString('en')+'</h4></td></tr>'
                    htmls += '</tbody></table>'
	$('#billsummary').html(htmls)	
	//$('#saveproduct').removeClass('d-none')
	$('#processtransaction').removeClass('d-none')
	})
	
	
	$(document).on('click', '#cash_processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#cash_processorderform').validate({
            submitHandler: function () {
				event.preventDefault()
				var token = auth.getToken();
                $('#cash_processtransaction').addClass('d-none');
				$('#cash_processing-btn').removeClass('d-none');
				var data = table.getData()
				var href = 'https://alxproject.virilesoftware.com/api/studentfees/'+ref;
				$.ajax({
					type: 'POST',
					data: {info:JSON.stringify(table.getData()), category:1, description:$('textarea[name=cash_description]').val()},
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
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+data.ref_id
					}
					else
					{
						alert(data.message)
						$('#cash_processtransaction').removeClass('d-none');
						$('#cash_processing-btn').addClass('d-none');
					}
							
				});
			}
		})
	});
	
	$(document).on('click', '#teller_processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#teller_processorderform').validate({
            submitHandler: function () {
				event.preventDefault()
				var token = auth.getToken();
                $('#teller_processtransaction').addClass('d-none');
				$('#teller_processing-btn').removeClass('d-none');
				var data = table.getData()
				var href = 'https://alxproject.virilesoftware.com/api/studentfees/'+ref;
				$.ajax({
					type: 'POST',
					data: {info:JSON.stringify(table.getData()), category:2, bank_account:$('#teller_bank_account').val(),
						teller_no:$('input[name=teller_no]').val(),teller_date:$('input[name=teller_date]').val(),description:$('textarea[name=teller_description]').val()},
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
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+data.ref_id
					}
					else
					{
						alert(data.message)
						$('#teller_processtransaction').removeClass('d-none');
						$('#teller_processing-btn').addClass('d-none');
					}
							
				});
			}
		})
	});
	
	$(document).on('click', '#transfer_processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#transfer_processorderform').validate({
            submitHandler: function () {
				event.preventDefault()
				var token = auth.getToken();
                $('#transfer_processtransaction').addClass('d-none');
				$('#transfer_processing-btn').removeClass('d-none');
				var data = table.getData()
				var href = 'https://alxproject.virilesoftware.com/api/studentfees/'+ref;
				$.ajax({
					type: 'POST',
					data: {info:JSON.stringify(table.getData()), category:3, bank_account:$('#transfer_bank_account').val(),
						transfer_reference:$('input[name=transfer_reference]').val(),transfer_date:$('input[name=transfer_date]').val(),description:$('textarea[name=transfer_description]').val()},
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
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+data.ref_id
					}
					else
					{
						alert(data.message)
						$('#transfer_processtransaction').removeClass('d-none');
						$('#transfer_processing-btn').addClass('d-none');
					}
							
				});
			}
		})
	});
	
	$(document).on('click', '#pos_processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#pos_processorderform').validate({
            submitHandler: function () {
				event.preventDefault()
				var token = auth.getToken();
                $('#pos_processtransaction').addClass('d-none');
				$('#pos_processing-btn').removeClass('d-none');
				var data = table.getData()
				var href = 'https://alxproject.virilesoftware.com/api/studentfees/'+ref;
				$.ajax({
					type: 'POST',
					data: {info:JSON.stringify(table.getData()), category:5, bank_account:$('#pos_bank_account').val(),
						card_name:$('input[name=pos_card_name]').val(),card_no:$('input[name=pos_card_no]').val(),description:$('textarea[name=pos_description]').val(),
						reference:$('input[name=pos_reference]').val(),transaction_date:$('input[name=pos_transaction_date]').val(),},
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
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+data.ref_id
					}
					else
					{
						alert(data.message)
						$('#transfer_processtransaction').removeClass('d-none');
						$('#transfer_processing-btn').addClass('d-none');
					}
							
				});
			}
		})
	});
	
	$(document).on('click', '#check_processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#check_processorderform').validate({
            submitHandler: function () {
				event.preventDefault()
				var token = auth.getToken();
                $('#check_processtransaction').addClass('d-none');
				$('#check_processing-btn').removeClass('d-none');
				var data = table.getData()
				var href = 'https://alxproject.virilesoftware.com/api/studentfees/'+ref;
				$.ajax({
					type: 'POST',
					data: {info:JSON.stringify(table.getData()), category:4, check_account:$('input[name=check_account]').val(),
						check_no:$('input[name=check_no]').val(), description:$('textarea[name=check_description]').val(),
						issuer_date:$('input[name=issuer_date]').val(),issuer_bank:$('input[name=issuer_bank]').val()},
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
						window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+data.ref_id
					}
					else
					{
						alert(data.message)
						$('#check_processtransaction').removeClass('d-none');
						$('#check_processing-btn').addClass('d-none');
					}
							
				});
			}
		})
	});
	
	
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
			type: 'POST',
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
				window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentbillinvoice/'+data.ref_id
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