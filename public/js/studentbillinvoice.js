$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var table = null
	var token = auth.getToken();
	var constraints = {
         sch_class: {
             presence: true,
          },
	};
	var table_index = 0
	const { jsPDF } = window.jspdf;
	var pdf = new jsPDF('p', 'pt', 'letter');
	if(auth.isLoggedIn())
	{
		
		var ref_id = $('head').attr('id')
		
		var href = 'https://alxproject.virilesoftware.com/api/studentfeesinvoice/'+ref_id;
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
				$('#billed-from').html('<h6><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+data.student_id+'">'+data.name+'.</a></h6><p>'+data.student_class+'<br> '+data.academic+'<br></p>')
				$('#billed-to').html('<h6 class="tx-gray-800">'+data.user+'.</h6><hr><p class="invoice-info-row">\
                  <span>Fee Balance:</span><span><h5 class="tx-danger tx-bold tx-lato">'+new Number(data.balance).toLocaleString('en')+'</h5><span></p>')
				var info = JSON.parse(data.bill_info)
				var ht = ''
				for(var i = 0; i < info.length; i++){
					ht += '<tr><td>'+info[i].fees+'</td><td class="tx-12"></td>\
                    <td class="tx-center">'+new Number(info[i].due).toLocaleString('en')+'</td><td class="tx-right">'+new Number(info[i].balance).toLocaleString('en')+'</td>\
					<td class="tx-right">'+new Number(info[i].payment).toLocaleString('en')+'</td></tr>'
				}

				
				if(data.payment_method == 'Cash')
				{
					$('#receipt_info').html('<label class="section-label-sm tx-gray-500">Receipt Information</label>\
					<p class="invoice-info-row"><span>Receipt No</span><span>'+data.receipt+'</span></p>\
					<p class="invoice-info-row"><span>Payment Method</span><span>'+data.payment_method+'</span></p>\
					<p class="invoice-info-row"><span>Transaction Date:</span><span>'+moment(data.trans_date).format('MMM DD, YYYY')+'</span></p>\
					')
					ht += '<tr>\
                    <td colspan="2" rowspan="4" class="valign-middle">\
                      <div class="invoice-notes">\
                        <label class="section-label-sm tx-gray-500">Notes</label>\
                        <p>'+data.description+'</p>\
                      </div><!-- invoice-notes -->\
                    </td>\
                    <td class="tx-right tx-uppercase tx-bold tx-inverse">Total Paid</td>\
                    <td colspan="2" class="tx-right"><h4 class="tx-primary tx-bold tx-lato">'+new Number(data.paid).toLocaleString('en')+'</h4></td>\
                  </tr>'
				}
				if(data.payment_method == 'Bank Teller')
				{
					$('#receipt_info').html('<label class="section-label-sm tx-gray-500">Receipt Information</label>\
					<p class="invoice-info-row"><span>Receipt No</span><span>'+data.receipt+'</span></p>\
					<p class="invoice-info-row"><span>Payment Method</span><span>'+data.payment_method+'</span></p>\
					<p class="invoice-info-row"><span>Transaction Date:</span><span>'+moment(data.trans_date).format('MMM DD, YYYY')+'</span></p>\
					<p class="invoice-info-row"><span>Bank:</span><span>'+data.bank_account+'</span></p>')
					ht += '<tr>\
                    <td colspan="2" rowspan="4" class="valign-middle">\
                      <div class="invoice-notes">\
                        <label class="section-label-sm tx-gray-500">Notes</label>\
					<p class="invoice-info-row"><span>Teller No</span><span>'+data.teller_no+'</span></p>\
					<p class="invoice-info-row"><span>Teller Date</span><span>'+data.teller_date+'</span></p>\
                        <p>'+data.description+'</p>\
                      </div><!-- invoice-notes -->\
                    </td>\
                    <td class="tx-right tx-uppercase tx-bold tx-inverse">Total Paid</td>\
                    <td colspan="2" class="tx-right"><h4 class="tx-primary tx-bold tx-lato">'+new Number(data.paid).toLocaleString('en')+'</h4></td>\
                  </tr>'
				}
				if(data.payment_method == 'Bank Transfer')
				{
					$('#receipt_info').html('<label class="section-label-sm tx-gray-500">Receipt Information</label>\
					<p class="invoice-info-row"><span>Receipt No</span><span>'+data.receipt+'</span></p>\
					<p class="invoice-info-row"><span>Payment Method</span><span>'+data.payment_method+'</span></p>\
					<p class="invoice-info-row"><span>Transaction Date:</span><span>'+moment(data.trans_date).format('MMM DD, YYYY')+'</span></p>\
					<p class="invoice-info-row"><span>Bank:</span><span>'+data.bank_account+'</span></p>')
					ht += '<tr>\
                    <td colspan="2" rowspan="4" class="valign-middle">\
                      <div class="invoice-notes">\
                        <label class="section-label-sm tx-gray-500">Notes</label>\
                        <p class="invoice-info-row"><span>Reference No</span><span>'+data.reference+'</span></p>\
					<p class="invoice-info-row"><span>Transaction Date</span><span>'+data.trans_date+'</span></p>\
                        <p>'+data.description+'</p>\
                      </div><!-- invoice-notes -->\
                    </td>\
                    <td class="tx-right tx-uppercase tx-bold tx-inverse">Total Paid</td>\
                    <td colspan="2" class="tx-right"><h4 class="tx-primary tx-bold tx-lato">'+new Number(data.paid).toLocaleString('en')+'</h4></td>\
                  </tr>'
				}
				if(data.payment_method == 'Bank Cheque')
				{
					$('#receipt_info').html('<label class="section-label-sm tx-gray-500">Receipt Information</label>\
					<p class="invoice-info-row"><span>Receipt No</span><span>'+data.receipt+'</span></p>\
					<p class="invoice-info-row"><span>Payment Method</span><span>'+data.payment_method+'</span></p>\
					<p class="invoice-info-row"><span>Transaction Date:</span><span>'+moment(data.trans_date).format('MMM DD, YYYY')+'</span></p>\
					<p class="invoice-info-row d-none"><span>Bank:</span><span>'+data.bank_account+'</span></p>')
					ht += '<tr>\
                    <td colspan="2" rowspan="4" class="valign-middle">\
                      <div class="invoice-notes">\
                        <label class="section-label-sm tx-gray-500">Notes</label>\
                        <p class="invoice-info-row"><span>Check No</span><span>'+data.check_no+'</span></p>\
					<p class="invoice-info-row"><span>Account Name</span><span>'+data.check_account+'</span></p>\
					<p class="invoice-info-row"><span>Issuer Bank</span><span>'+data.issuer_bank+'</span></p>\
					<p class="invoice-info-row"><span>Issuer Date</span><span>'+data.issuer_date+'</span></p>\
                        <p>'+data.description+'</p>\
                      </div><!-- invoice-notes -->\
                    </td>\
                    <td class="tx-right tx-uppercase tx-bold tx-inverse">Total Paid</td>\
                    <td colspan="2" class="tx-right"><h4 class="tx-primary tx-bold tx-lato">'+new Number(data.paid).toLocaleString('en')+'</h4></td>\
                  </tr>'
				}
				if(data.payment_method == 'POS')
				{
					$('#receipt_info').html('<label class="section-label-sm tx-gray-500">Receipt Information</label>\
					<p class="invoice-info-row"><span>Receipt No</span><span>'+data.receipt+'</span></p>\
					<p class="invoice-info-row"><span>Payment Method</span><span>'+data.payment_method+'</span></p>\
					<p class="invoice-info-row"><span>Transaction Date:</span><span>'+moment(data.trans_date).format('MMM DD, YYYY')+'</span></p>\
					<p class="invoice-info-row"><span>Bank:</span><span>'+data.bank_account+'</span></p>')
					ht += '<tr>\
                    <td colspan="2" rowspan="4" class="valign-middle">\
                      <div class="invoice-notes">\
                        <label class="section-label-sm tx-gray-500">Notes</label>\
                        <p class="invoice-info-row"><span>Card Name</span><span>'+data.card_no+'</span></p>\
					<p class="invoice-info-row"><span>Card No</span><span>'+data.card_name+'</span></p>\
					<p class="invoice-info-row"><span>Reference:</span><span>'+data.reference+'</span></p>\
					<p class="invoice-info-row"><span>Transaction Date:</span><span>'+data.transaction_date+'</span></p>\
                      <p>'+data.description+'</p>\</div><!-- invoice-notes -->\
                    </td>\
                    <td class="tx-right tx-uppercase tx-bold tx-inverse">Total Paid</td>\
                    <td colspan="2" class="tx-right"><h4 class="tx-primary tx-bold tx-lato">'+new Number(data.paid).toLocaleString('en')+'</h4></td>\
                  </tr>'
				}
				
				
				
				
				
				
				
				$('#item_data').html(ht)
			}
			
		});
		
        var payload = jwt_decode(token);
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('click', '#generatepdf', function (event) {
		document.getElementById("card-invoice").style.width = "595px";
		pdf.html(document.getElementById('card-invoice'), {
			callback: function (pdf) {
				//var iframe = document.createElement('iframe');
				//iframe.setAttribute('style', 'position:absolute;right:0; top:80px; bottom:0; height:100%; width:700px');
				//document.body.appendChild(iframe);
				//iframe.src = pdf.output('datauristring');
				pdf.output('datauristring');
				pdf.save('invoice.pdf');
				document.getElementById("card-invoice").style.width = "100%";
			}
		});
		//
	})
	
	
});