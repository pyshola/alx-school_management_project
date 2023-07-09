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
	var term = ''
	var student_id = 0	
	var table = null
	var class_category = ''
	var pre_nusery = false
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

		var href = 'https://alxproject.virilesoftware.com/api/classteacher/'+ref_id;
		$.ajax({
			type: 'GET',
			data: {session:session, cls:cls},
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

		var href = 'https://alxproject.virilesoftware.com/api/student';
		$.ajax({
			type: 'GET',
			data: {academic_session:session, student_class:ref_id, student_type:0},
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
				htmls  +='<tr>\
					<td>'+s+'</td>\
					<td><a href="https://alxproject.virilesoftware.com/eportal/'+payload.username+'/studentdetail/'+data[i].student_id+'" class="">'+ data[i].name+'</a></td>\
					<td>'+ data[i].admission_no+'</td>\
					<td>'+ data[i].student_class+'</td>\
					<td>'+ data[i].gender+'</td>\
					<td>'+ data[i].admission_date+'</td>\
					</tr>'
				$('#student_list_form').append('<option value="'+data[i].student_academic+'">'+data[i].name+'</option>')
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
		
		
		
		
        
		
	}
	else
	{
		//window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	
    
    $(document).on('click', '.remove_class_teacher', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
        event.preventDefault()
        var sn = $(this).attr('data-id')
		var name =$(this).attr('data-name')
		var href = 'https://alxproject.virilesoftware.com/api/classteacher/'+ref_id;
		
        var con = confirm('You are about to delete class teacher: ' + name)
        if (con == true) {
            $.ajax({
                type: 'DELETE',
                data: {session:session, cls:cls, teacher:sn},
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
        var passd = {'name': name, session:session, cls:cls}
				
		var ref_id = $('head').attr('id')		
                $.ajax({
                    type: 'POST',
                    data: passd,
                    url: 'https://alxproject.virilesoftware.com/api/classteacher/'+ref_id,
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
	
	
	
	$(document).on('click', '#filter_search_home', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		event.preventDefault()
		var token = auth.getToken();
		term = $('#session_term_home').val()
		student_id=$('#student_list_form').select2('data')[0].id
		var passd = {session:session, class_arm_id:ref_id, term:term, student_id:student_id}
		//console.log(passd)
		$('#studentdata').html('')
		$('#resultdata').html('')
		$('#personal_behaviorial').addClass('d-none')
		$('#sport_behaviorial').addClass('d-none')
		$('#secondary_comment').addClass('d-none')
		$('#affective_behaviorial').addClass('d-none')
		$('#psychomotor_behaviorial').addClass('d-none')
		$('#primary_comment').addClass('d-none')
		$('#attendance_section').addClass('d-none')
		$('#save_section').addClass('d-none')

		var href = 'https://alxproject.virilesoftware.com/api/studentresult';
		$.ajax({
			type: 'GET',
			data: passd,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			//console.log(data)
			if(data.status == 'ok'){
				var shtml = ''
				var biodata = data.data[0].biodata
				
				shtml += '<tr><td><strong>Name: <span class="tx-info">'+biodata.name+'</span></strong></td>\
				<td><strong>Admission No: <span class="tx-info">'+biodata.admission_no+'</span></strong></td>\
				<td><strong>DOB: <span class="tx-info">'+biodata.dob+'</span></strong></td>\
				<td><strong>Class: <span class="tx-info">'+biodata.student_class+'</span></strong></td>\
				<td><strong>Term: <span class="tx-info">'+term+'</span></strong></td></tr>'


				shtml += '<tr><td><strong>No in Class: <span class="tx-primary">'+biodata.no_in_class+'</span></strong></td>\
				<td><strong>Position: <span class="tx-primary">'+biodata.position+'</span></strong></td>\
				<td><strong>Total Score Obtainable: <span class="tx-primary">'+biodata.score_obtainable+'</span></strong></td>\
				<td><strong>Total Score Obtained: <span class="tx-primary">'+biodata.score_obtain+'</span></strong></td>\
				<td><strong>Average Percentage: <span class="tx-primary">'+biodata.percentage+'</span></strong></td></tr>'

				$('#studentdata').html(shtml)
				var behavior = data.data[0].behavior
				var ca = data.data[0].abbr
				var htmls = '<thead class="thead-colored bg-primary"><tr><th>Subject</th>'
				if(data.school_info.cls == 'secondary'){
					if(data.b_f == 'Yes'){
						if(term == 'Third Term'){
							htmls += '<th>1st Term</th><th>2nd Term</th>'
						}
						if(term == 'Second Term'){
							htmls += '<th>1st Term</th>'
						}
					}
					for(var i = 0; i < ca.length; i++){
						htmls += '<th>'+ca[i].abbr+'</th>'
					}
					htmls += '<th>Total Score for the term</th><th>Total Score</th><th>Percentage</th><th>Position in subject</th><th>Grade</th><th>Remark</th>'
				
				}
				else{
					if(data.b_f == 'Yes'){
						if(term == 'Third Term'){
							htmls += '<th>1st Term</th><th>2nd Term</th>'
						}
						if(term == 'Second Term'){
							htmls += '<th>1st Term</th>'
						}
					}
					for(var i = 0; i < ca.length; i++){
						htmls += '<th>'+ca[i].abbr+'</th>'
					}
					htmls += '<th>Total Score for the term</th><th>Total Score</th><th>Percentage</th><th>Position in subject</th><th>Remark</th>'
				
					
					
				}
				htmls += '</tr></thead>'

				//console.log(htmls)
				class_category = data.school_info.category
				var result = data.data[0].result
				//console.log(result)
				for(var i = 0; i < result.length; i++){
					htmls += "<tr><td>"+result[i].abbr+"</td>"
					if(data.b_f == 'Yes'){
						if(term == 'Third Term'){
							htmls += '<td>'+result[i].first+'</td><td>'+result[i].second+'</td>'
						}
						if(term == 'Second Term'){
							htmls += '<td>'+result[i].first+'</td>'
						}
					}
					//console.log(result[i].abbr)
					//console.log(result[i].mark)
					var mark = []
					try{
						mark = JSON.parse(result[i].mark)
					}
					catch(err){
						//sconsole.log(err)
						mark = []
					}
					
					//console.log(mark)
					for(var s = 0; s < ca.length; s++){
						var score = ''
						try{
							for(var w = 0; w < mark.length; w++)
							{
								if(mark[w].abbr == ca[s].abbr){
									score = mark[w].value
									break
								}
							}
						}
						catch(err){}

						htmls += '<td>'+score+'</td>'
					}
					if(data.school_info.cls == 'secondary'){
						htmls += '<td>'+result[i].total_score_term+'</td><td>'+result[i].total_score+'</td><td>'+result[i].percentage+'</td>\
					<td>'+result[i].position+'</td><td>'+result[i].grade+'</td><td>'+result[i].rating+'</td>'
					}
					else{
						htmls += '<td>'+result[i].total_score_term+'</td><td>'+result[i].total_score+'</td><td>'+result[i].percentage+'</td>\
					<td>'+result[i].position+'</td><td>'+result[i].rating+'</td>'
					}	
					
								
					htmls += "</tr>"
				}
				$('#resultdata').html(htmls)
				$('#no_present').val(data.data[0].biodata.student_present)
				$('#attendance_section').removeClass('d-none')
				$('#save_section').removeClass('d-none')
				var comment = data.comment
				var teacher_comment = JSON.parse(comment.teacher)
				var hm_comment = JSON.parse(comment.hm)
				$('#secondary_teacher_comment').html('')
				$('#primary_teacher_comment').html('')
				$('#principal_comment').html('')
				$('#hm_comment').html('')
				for(var s = 0; s < teacher_comment.length; s++){
					$('#secondary_teacher_comment').append('<option value="'+teacher_comment[s].ref_id+'">'+teacher_comment[s].text+'</option>')
					$('#primary_teacher_comment').append('<option value="'+teacher_comment[s].ref_id+'">'+teacher_comment[s].text+'</option>')
				}
				for(var s = 0; s < hm_comment.length; s++){
					$('#principal_comment').append('<option value="'+hm_comment[s].ref_id+'">'+hm_comment[s].text+'</option>')
					$('#hm_comment').append('<option value="'+hm_comment[s].ref_id+'">'+hm_comment[s].text+'</option>')
				}
				var comment = data.data[0].comment
				var behavior = data.data[0].behavior
				//console.log(behavior)
				if(data.school_info.category == 'secondary'){
					$('#personal_behaviorial').removeClass('d-none')
					$('#sport_behaviorial').removeClass('d-none')
					$('#secondary_comment').removeClass('d-none')

					$('#secondary_teacher_comment').val(comment.teacher_comment)
					$('#principal_comment').val(comment.hm_comment)
					$('#secondary_teacher_comment').trigger('change')
					$('#pricipal_comment').trigger('change')

					$('#obedience').val(behavior.obedience)
					$('#honesty').val(behavior.honesty)
					$('#self_control').val(behavior.self_control)
					$('#self_reliance').val(behavior.self_reliance)
					$('#initiative').val(behavior.initiative)
					$('#punctuality').val(behavior.punctuality)
					$('#neatness').val(behavior.neatness)
					$('#perseverance').val(behavior.perseverance)
					$('#attendance').val(behavior.attendance)
					$('#attentiveness').val(behavior.attentiveness)
					$('#politeness').val(behavior.politeness)
					$('#consideration').val(behavior.consideration)
					$('#sociability').val(behavior.sociability)
					$('#promptness').val(behavior.promptness)
					$('#sense_of_value').val(behavior.sense_value)
					$('#handwriting').val(behavior.handwriting)
					$('#communication').val(behavior.communication)
					$('#sport_games').val(behavior.sports)
					$('#manual_skill').val(behavior.manual_skill)
					$('#dexterity').val(behavior.dexterity)

					$('#indoor_games').val(behavior.indoor_games)
					$('#ball_games').val(behavior.ball_games)
					$('#combative_games').val(behavior.combative_games)
					$('#tracks').val(behavior.tracks)
					$('#jumps').val(behavior.jumps)
					$('#throws').val(behavior.throws)
					$('#swimming').val(behavior.swimming)
					$('#weight_lifting').val(behavior.weight_lifting)


					$('#obedience').trigger('change')
					$('#honesty').trigger('change')
					$('#self_control').trigger('change')
					$('#self_reliance').trigger('change')
					$('#initiative').trigger('change')
					$('#punctuality').trigger('change')
					$('#neatness').trigger('change')
					$('#perseverance').trigger('change')
					$('#attendance').trigger('change')
					$('#attentiveness').trigger('change')
					$('#politeness').trigger('change')
					$('#consideration').trigger('change')
					$('#sociability').trigger('change')
					$('#promptness').trigger('change')
					$('#sense_of_value').trigger('change')
					$('#handwriting').trigger('change')
					$('#communication').trigger('change')
					$('#sport_games').trigger('change')
					$('#manual_skill').trigger('change')
					$('#dexterity').trigger('change')
					$('#indoor_games').trigger('change')
					$('#ball_games').trigger('change')
					$('#combative_games').trigger('change')
					$('#tracks').trigger('change')
					$('#jumps').trigger('change')
					$('#throws').trigger('change')
					$('#swimming').trigger('change')
					$('#weight_lifting').trigger('change')
					$('#principal_promotion').html('')
					$('#principal_promotion_panel').addClass('d-none')
					$('#hm_promotion_panel').addClass('d-none')
					if(term  == 'Third Term'){
						$('#principal_promotion_panel').removeClass('d-none')
						var promo = data.promotion.data
						for(let s = 0; s < promo.length; s++){
							$('#principal_promotion').append('<option value="'+promo[s]+'">'+promo[s]+'</option>')
						}
						$('#principal_promotion').val(data.promotion.comment)
						$('#principal_promotion').trigger('change')
					}
					
				}
				else{
					//console.log(data.school_info.school_class)
					if(data.school_info.school_class == 'PRE-NURSERY'){
						pre_nusery = true
						$('#primary_teacher_comment').val(comment.teacher_comment)
						$('#hm_comment').val(comment.hm_comment)
						$('#primary_teacher_comment').trigger('change')
						$('#hm_comment').trigger('change')
						console.log(behavior)
						
						$('#behaviorial_skill_assessment').removeClass('d-none')

						$('#pre_obedience').val(behavior.obedience)
						$('#pre_obedience').trigger('change')

						$('#pre_honesty').val(behavior.honesty)
						$('#pre_honesty').trigger('change')
						$('#pre_self_control').val(behavior.self_control)
						$('#pre_self_control').trigger('change')
						$('#pre_self_reliance').val(behavior.self_reliance)
						$('#pre_self_reliance').trigger('change')
						$('#pre_initiative').val(behavior.initiative)
						$('#pre_initiative').trigger('change')
						$('#pre_punctuality').val(behavior.punctuality)
						$('#pre_punctuality').trigger('change')
						$('#pre_politeness').val(behavior.politeness)
						$('#pre_politeness').trigger('change')
						$('#pre_perseverance').val(behavior.perseverance)
						$('#pre_perseverance').trigger('change')
						$('#pre_attendance').val(behavior.attendance)
						$('#pre_attendance').trigger('change')
						$('#pre_attentiveness').val(behavior.attentiveness)
						$('#pre_attentiveness').trigger('change')
						$('#pre_consideration').val(behavior.consideration)
						$('#pre_consideration').trigger('change')
						$('#pre_sociability').val(behavior.sociability)
						$('#pre_sociability').trigger('change')
						$('#pre_promptness').val(behavior.promptness)
						$('#pre_promptness').trigger('change')
						$('#pre_sense_of_value').val(behavior.sense_of_value)
						$('#pre_sense_of_value').trigger('change')
						$('#pre_handwriting').val(behavior.handwriting)
						$('#pre_handwriting').trigger('change')
						$('#pre_communication').val(behavior.communication)
						$('#pre_communication').trigger('change')
						$('#pre_sport_and_games').val(behavior.sport_and_games)
						$('#pre_sport_and_games').trigger('change')
						$('#pre_manual_skill').val(behavior.manual_skill)
						$('#pre_manual_skill').trigger('change')
						$('#pre_dexterity').val(behavior.dexterity)
						$('#pre_dexterity').trigger('change')

						$('#hm_promotion').html('')
						$('#principal_promotion_panel').addClass('d-none')
						$('#hm_promotion_panel').addClass('d-none')

					}
					else{

						$('#affective_behaviorial').removeClass('d-none')
						$('#psychomotor_behaviorial').removeClass('d-none')
						$('#primary_comment').removeClass('d-none')
	
						$('#primary_teacher_comment').val(comment.teacher_comment)
						$('#hm_comment').val(comment.hm_comment)
						$('#primary_teacher_comment').trigger('change')
						$('#hm_comment').trigger('change')

						$('#pri_attentiveness').val(behavior.attentiveness)
						$('#school_work').val(behavior.school_work)
						$('#cooperating').val(behavior.cooperating)
						$('#emotion').val(behavior.emotion)
						$('#health').val(behavior.health)
						$('#helping').val(behavior.helping)
						$('#pri_honesty').val(behavior.honesty)
						$('#leadership').val(behavior.leadership)
						$('#pri_attendance').val(behavior.attendance)
						$('#pri_neatness').val(behavior.neatness)
						$('#pri_perseverance').val(behavior.perseverance)
						$('#pri_politeness').val(behavior.politeness)
						$('#pri_punctuality').val(behavior.punctuality)
						$('#speaking_writing').val(behavior.speaking_writing)
						$('#drawing_painting').val(behavior.drawing_painting)
						$('#handling_tools').val(behavior.handling_tools)
						$('#pri_games').val(behavior.games)
						$('#pri_handwriting').val(behavior.handwriting)
						$('#music').val(behavior.music)
						$('#pri_sport').val(behavior.sport)
						$('#verbal_fluency').val(behavior.verbal_fluency)
	
	
						$('#pri_attentiveness').trigger('change')
						$('#school_work').trigger('change')
						$('#cooperating').trigger('change')
						$('#emotion').trigger('change')
						$('#health').trigger('change')
						$('#helping').trigger('change')
						$('#pri_honesty').trigger('change')
						$('#leadership').trigger('change')
						$('#pri_attendance').trigger('change')
						$('#pri_neatness').trigger('change')
						$('#pri_perseverance').trigger('change')
						$('#pri_politeness').trigger('change')
						$('#pri_punctuality').trigger('change')
						$('#speaking_writing').trigger('change')
						$('#drawing_painting').trigger('change')
						$('#handling_tools').trigger('change')
						$('#pri_games').trigger('change')
						$('#pri_handwriting').trigger('change')
						$('#music').trigger('change')
						$('#pri_sport').trigger('change')
						$('#verbal_fluency').trigger('change')
						$('#hm_promotion').html('')
						$('#principal_promotion_panel').addClass('d-none')
						$('#hm_promotion_panel').addClass('d-none')
					}
					if(term  == 'Third Term'){
						$('#hm_promotion_panel').removeClass('d-none')
						var promo = data.promotion.data
						for(let s = 0; s < promo.length; s++){
							$('#hm_promotion').append('<option value="'+promo[s]+'">'+promo[s]+'</option>')
						}
						$('#hm_promotion').val(data.promotion.comment)
						$('#hm_promotion').trigger('change')
					}
					
				}
				

			}

		})
	})
	

	$(document).on('click', '.load-submit_detail', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		$('.load-submit_detail').addClass('d-none');
		$('#processing-btn').removeClass('d-none');
		console.log(class_category)
		if(class_category == 'secondary'){
			var student_behavior = {obedience:$('#obedience').val(),honesty:$('#honesty').val(), self_control:$('#self_control').val(),
			self_reliance:$('#self_reliance').val(), initiative:$('#initiative').val(), punctuality:$('#punctuality').val(),
			neatness:$('#neatness').val(), perseverance:$('#perseverance').val(), attendance:$('#attendance').val(),
			attentiveness:$('#attentiveness').val(), politeness:$('#politeness').val(),	consideration:$('#consideration').val(),
			sociability:$('#sociability').val(),promptness:$('#promptness').val(), sense_value:$('#sense_of_value').val(),
			handwriting:$('#handwriting').val(), communication:$('#communication').val(), sports:$('#sport_games').val(),
			manual_skill:$('#manual_skill').val(), dexterity:$('#dexterity').val(),indoor_games:$('#indoor_games').val(),
			ball_games:$('#ball_games').val(), combative_games:$('#combative_games').val(),tracks:$('#tracks').val(),
			jumps:$('#jumps').val(),throws:$('#throws').val(),swimming:$('#swimming').val(),weight_lifting:$('#weight_lifting').val()}
            var student_attendance = $('#no_present').val()
            var student_comment = {teacher_comment:$('#secondary_teacher_comment').val(), hm_comment:$('#principal_comment').val()}
			var promotion = $('#principal_promotion').val()
		}
		else{
			if(pre_nusery){
				var student_behavior = {obedience:$('#pre_obedience').val(), honesty:$('#pre_honesty').val(), self_control:$('#pre_self_control').val(),
				self_reliance:$('#pre_self_reliance').val(), initiative:$('#pre_initiative').val(),
                punctuality:$('#pre_punctuality').val(), politeness:$('#pre_politeness').val(), perseverance :$('#pre_perseverance').val(),
				attendance:$('#pre_attendance').val(), attentiveness:$('#pre_attentiveness').val(),
				consideration:$('#pre_consideration').val(),  sociability:$('#pre_sociability').val(), promptness:$('#pre_promptness').val(),
				sense_of_value:$('#pre_sense_of_value').val(), handwriting:$('#pre_handwriting').val(), communication:$('#pre_communication').val(),
				sport_and_games:$('#pre_sport_and_games').val(), manual_skill:$('#pre_manual_skill').val(), dexterity:$('#pre_dexterity').val()
                         }
			}
			else{

				var student_behavior = {attentiveness:$('#pri_attentiveness').val(), school_work:$('#school_work').val(),
				cooperating:$('#cooperating').val(), emotion:$('#emotion').val(), health:$('#health').val(),
				helping:$('#helping').val(), honesty:$('#pri_honesty').val(), leadership:$('#leadership').val(),
				attendance:$('#pri_attendance').val(), neatness:$('#pri_neatness').val(), perseverance:$('#pri_perseverance').val(),
				politeness:$('#pri_politeness').val(), punctuality:$('#pri_punctuality').val(), speaking_writing:$('#speaking_writing').val(), drawing_painting:$('#drawing_painting').val(),
				handling_tools:$('#handling_tools').val(), games:$('#pri_games').val(), handwriting:$('#pri_handwriting').val(),
				music:$('#music').val(), sport:$('#pri_sport').val(), verbal_fluency:$('#verbal_fluency').val()}
			}
            var student_attendance = $('#no_present').val()
            var student_comment = {teacher_comment:$('#primary_teacher_comment').val(), hm_comment:$('#hm_comment').val()}
			var promotion = $('#hm_promotion').val()
		}
		if(isNaN(parseInt(student_attendance)) && student_attendance.length > 0){
			alert('Please enter valid number of time student present')
		}
		else{
			var passd = {session:session, class_arm_id:ref_id, term:term, student_id:student_id, behavior:JSON.stringify(student_behavior),
			attendance:student_attendance, comment:JSON.stringify(student_comment), promotion:promotion}
			console.log(passd)


			var href = 'https://alxproject.virilesoftware.com/api/studentassessment';
			$.ajax({
				type: 'POST',
				data: passd,
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(data){
				console.log(data)
				if(data.status == 'ok'){
					alert(data.msg)
					$('#studentdata').html('')
					$('#resultdata').html('')
					$('#personal_behaviorial').addClass('d-none')
					$('#sport_behaviorial').addClass('d-none')
					$('#secondary_comment').addClass('d-none')
					$('#affective_behaviorial').addClass('d-none')
					$('#psychomotor_behaviorial').addClass('d-none')
					$('#primary_comment').addClass('d-none')
					$('#attendance_section').addClass('d-none')
					$('#save_section').addClass('d-none')
					$('.load-submit_detail').removeClass('d-none');
					$('#processing-btn').addClass('d-none');
				}
				else{
					alert(data.message)
					$('.load-submit_detail').removeClass('d-none');
					$('#processing-btn').addClass('d-none');
				}
			})
		}
	})

	
});