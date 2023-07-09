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
		var href = 'https://alxproject.virilesoftware.com/api/expensestype';
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
			if(datas.status == 'ok'){
				var data = datas.data
				if(datas.add_access == true){
					$('.expenses_add').removeClass('d-none');
				}
				var htmls = ''
				var amount  = 0
				for(var i = 0; i < data.length; i++)
				{
					if(datas.edit_access == true){
						var edit = '<div class="user-btn-wrapper" id="t_b'+data[i].ref_id+'"">\
						<a href="#" class="btn btn-outline-warning btn-icon  editschoolclass" id="' +data[i].ref_id + '" data-name ="' + data[i].name + '" >\
						  <div class="tx-20"><i class="fa fa-edit"></i></div>\
						</a></div>'
					}
					else{
						var edit = ''
					}
					htmls +=
						  '<tr id="row'+data[i].ref_id+'">\
						  <td style="padding-top:20px" colspan="4"><span  id="t_d'+data[i].ref_id+'">'+ data[i].name + '</span></td>\
						  <td>'+edit+'</td>\
					   </tr>';
					 
						
				}
			
				
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
        var sn = $(this).attr('data-name')
		
        var con = confirm('You are about to delete fees type: ' + sn)
        if (con == true) {
            $.ajax({
                type: 'DELETE',
                data: null,
                url: 'https://alxproject.virilesoftware.com/api/expensestype/' + ref_id,
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
		$('#edit_feestype').val($(this).attr('data-name'))
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
                var name = $('input[name=feestype]').val();
                var passd = {
                    'name': name,
                }
                var href = 'https://alxproject.virilesoftware.com/api/expensestype';
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
						//alert(data.msg)
                        var table = document.getElementById("tabledata");
						var tbl = $('table#tabledata  tr:last').index() + 1
						var thtmls =
					  '<tr id="row'+data.ref_id+'">\
					  <td style="padding-top:20px" colspan="4"><span  id="t_d'+data.ref_id+'">'+ data.name + '</span></td>\
					  <td><div class="user-btn-wrapper" id="t_b'+data.ref_id+'"">\
                    <a href="#" class="btn btn-outline-warning btn-icon  editschoolclass" id="' +data.ref_id + '" data-name ="' + data.name + '" >\
                      <div class="tx-20"><i class="fa fa-edit"></i></div>\
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
                    'name': name,
                }
				var ref_id = $('#updateclassarm_modal').attr('data-ref') 
                var href = 'https://alxproject.virilesoftware.com/api/expensestype/'+ref_id;
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
						alert('Expenses type update successful')
						$('#row'+ref_id).html('<td style="padding-top:20px" colspan="4">'+ name + '</td>\
							  <td><div class="user-btn-wrapper">\
							<a href="#" class="btn btn-outline-warning btn-icon  editsubject" id="' +ref_id + '" data-name ="' + name + '" >\
							  <div class="tx-20"><i class="fa fa-edit"></i></div>\
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