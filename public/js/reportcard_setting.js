$(document).ready(function(){
	
	var token = auth.getToken();
	var cls = ''
	var table_index = 0
	var table = null
	if(auth.isLoggedIn())
	{
		
		var href = 'https://alxproject.virilesoftware.com/api/schoolclass';
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
				$('#student_class_form').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
				cls = datas[0].ref_id
			}
		});
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('click', '#filter_search_home', function (event) {
		event.preventDefault()
		var href = 'https://alxproject.virilesoftware.com/api/reportcardsetup';
		$.ajax({
			type: 'GET',
			data: {student_class:$('#student_class_form').val()},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
			console.log(datas)
			if(datas.status == 'ok'){
				if(datas.position)
				{
					$("#position").prop("checked", true);
				}
				else{
					$("#position").prop("checked", false);
				}
				if(datas.second_term)
				{
					$("#second_term").prop("checked", true);
				}
				else{
					$("#second_term").prop("checked", false);
				}
				if(datas.third_term)
				{
					$("#third_term").prop("checked", true);
				}
				else{
					$("#third_term").prop("checked", false);
				}
				if(datas.rating == 1){
					$('#rating_one').removeClass('d-none')
					$('#rating_two').addClass('d-none')

				}
				if(datas.rating == 2){
					$('#rating_two').removeClass('d-none')
					$('#rating_one').addClass('d-none')
				}
				$('#rating').val(datas.rating)
				$('#rating').trigger('change')
				$('#sessionform').removeClass('d-none')
			}
			
			
		});

	})

	$(document).on('change', '#student_class_form', function (event) {
		cls = $(this).val()
	})
    
	$(document).on('change', '#rating', function (event) {
		var ref= $(this).val()
		if(ref == 1){
			$('#rating_one').removeClass('d-none')
			$('#rating_two').addClass('d-none')
		}
		if(ref == 2){
			$('#rating_two').removeClass('d-none')
			$('#rating_one').addClass('d-none')
		}
	})
	
	
    $(document).on('click', '#load-submit', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('#sessionform').validate({

            submitHandler: function () {
                event.preventDefault()
				var token = auth.getToken();
                $('#load-submit').addClass('d-none');
				$('#processing-btn').removeClass('d-none');
                
				var branch = $('#student_class_form').select2('data')
				var b = []
				for(var i = 0; i < branch.length; i++){
					b.push(branch[i].id)
				}
                var passd = {
                    second_term: $('#second_term').prop("checked"),
					position: $('#position').prop("checked"),
					third_term: $('#third_term').prop("checked"),
					rating:$('#rating').val(),
					student_class:cls
					
                }
                var href = 'https://alxproject.virilesoftware.com/api/reportcardsetup';
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
						window.location.reload()
                    } else {
                        toastr.warning(data.msg,{"closeButton": true, timeOut: 9500 })
                        $('#load-submit').removeClass('d-none');
                        $('#processing-btn').addClass('d-none');
                    }

                });
            }
        })

    });
	
	
});