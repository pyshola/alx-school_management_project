$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var token = auth.getToken();
	var constraints = {
         feestype: {
             presence: true,
          },
	};
	
	var table_index = 0
	if(auth.isLoggedIn())
	{
		var href = 'https://alxproject.virilesoftware.com/api/schoolaccountadmin';
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
				$('#add_account').removeClass('d-none')
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
				htmls +=
					  '<tr id="row'+data[i].ref_id+'">\
					  <td style="padding-top:20px" colspan="2"><span  id="t_d'+data[i].ref_id+'">'+ data[i].bank + '</span></td>\
					<td style="padding-top:20px" colspan="2"><span  id="t_d'+data[i].ref_id+'">'+ data[i].account_no + '</span></td>\
					  <td><div class="user-btn-wrapper" id="t_b'+data[i].ref_id+'"">\
                    <a href="#" class="btn btn-outline-warning btn-icon  editschoolclass '+edit+'" id="' +data[i].ref_id + '" data-bank ="' + data[i].bank + '" data-account ="' + data[i].account_no + '" >\
                      <div class="tx-20"><i class="fa fa-edit"></i></div>\
                    </a>\
                  <a href="#" class="btn btn-outline-danger btn-icon removeschoolclass '+del+'" id="' +data[i].ref_id + '"  data-bank ="' + data[i].bank + '" data-account ="' + data[i].account_no + '" >\
                  <div class="tx-20"><i class="fa fa-trash"></i></div>\
                    </a>\
                    </div></td>\
				   </tr>';
				 
					
			}
			$('#tablebody').html(htmls)
			
		});
        
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
    
    $(document).on('click', '.removeschoolclass', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        event.preventDefault()
        var ref_id = this.id
        var sn = $(this).attr('data-bank')
		var acct = $(this).attr('data-account')
		
        var con = confirm('You are about to delete fees type: ' + sn +' - '+acct)
        if (con == true) {
            $.ajax({
                type: 'DELETE',
                data: null,
                url: 'https://alxproject.virilesoftware.com/api/schoolaccount/' + ref_id,
                dataType: 'JSON',
                beforeSend: function (req) {
                    req.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }).done(function (data) {
                if (data.status == 'ok') {
                    alert(data.msg)
                    document.getElementById("row"+ref_id+"").outerHTML=""
                } else {
                    alert(data.msg)
                }

            });
        } else {
            return false;
        }
    })
	
	
	$(document).on('click', '.editschoolclass', function (event) {
		event.preventDefault()
		var ref_id = this.id
		table_index = this.parentNode.parentNode.rowIndex;
		$('#edit_bank').val($(this).attr('data-bank'))
		$('#edit_account_no').val($(this).attr('data-account'))
		$('#updateclassarm_modal').attr('data-ref', ref_id) 
		$('#updateclassarm_modal').modal('show'); 
        
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
                var name = $('input[name=account_no]').val();
                var passd = {
                    'account_no': name,
					'bank':$('input[name=bank]').val()
                }
                var href = 'https://alxproject.virilesoftware.com/api/schoolaccount';
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
                        var table = document.getElementById("tabledata");
						var tbl = $('table#tabledata  tr:last').index() + 1
						var thtmls =
					  '<tr id="row'+data.ref_id+'">\
					  <td style="padding-top:20px" colspan="2"><span  id="t_d'+data.ref_id+'">'+ data.bank + '</span></td>\
					<td style="padding-top:20px" colspan="2"><span  id="t_d'+data.ref_id+'">'+ data.account_no + '</span></td>\
					  <td><div class="user-btn-wrapper" id="t_b'+data.ref_id+'"">\
                    <a href="#" class="btn btn-outline-warning btn-icon  editschoolclass" id="' +data.ref_id + '" data-bank ="' + data.bank + '" data-account ="' + data.account_no + '" >\
                      <div class="tx-20"><i class="fa fa-edit"></i></div>\
                    </a>\
                  <a href="#" class="btn btn-outline-danger btn-icon removeschoolclass" id="' +data.ref_id + '"  data-bank ="' + data.bank + '" data-account ="' + data.account_no + '" >\
                  <div class="tx-20"><i class="fa fa-trash"></i></div>\
                    </a>\
                    </div></td>\
				   </tr>';
						var row = table.insertRow(tbl).outerHTML = thtmls;
						$('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
						$('#addclassarm_modal').modal('hide');
						$('input[name=feestype]').val('');
						
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
		$('#updateschoolclassform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('#edit_load-submit').addClass('d-none');
				$('#edit_processing-btn').removeClass('d-none');
                var name = $('input[name=edit_feestype]').val();
                var passd = {
                    'account_no': $('input[name=edit_account_no]').val(),
					'bank':$('input[name=edit_bank]').val()
                }
				var ref_id = $('#updateclassarm_modal').attr('data-ref') 
                var href = 'https://alxproject.virilesoftware.com/api/schoolaccount/'+ref_id;
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
						$('#row'+data.ref_id).html('<td style="padding-top:20px" colspan="2"><span  id="t_d'+data.ref_id+'">'+ data.bank + '</span></td>\
					<td style="padding-top:20px" colspan="2"><span  id="t_d'+data.ref_id+'">'+ data.account_no + '</span></td>\
					  <td><div class="user-btn-wrapper" id="t_b'+data.ref_id+'"">\
                    <a href="#" class="btn btn-outline-warning btn-icon  editschoolclass" id="' +data.ref_id + '" data-bank ="' + data.bank + '" data-account ="' + data.account_no + '" >\
                      <div class="tx-20"><i class="fa fa-edit"></i></div>\
                    </a>\
                  <a href="#" class="btn btn-outline-danger btn-icon removeschoolclass" id="' +data.ref_id + '"  data-bank ="' + data.bank + '" data-account ="' + data.account_no + '" >\
                  <div class="tx-20"><i class="fa fa-trash"></i></div>\
                    </a>\
                    </div></td>\
                    ')
						$('#edit_load-submit').removeClass('d-none');
                        $('#edit_processing-btn').addClass('d-none');
						$('input[name=edit_feestype]').val('');
						$('#updateclassarm_modal').modal('hide');
						
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