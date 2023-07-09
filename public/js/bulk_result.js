function replacetext(str)
{
	str = str.replace(/[^a-zA-Z0-9]/g,'_');
	str = str.replace(/[^a-zA-Z0-9]/g,'_').replace(/__/g,'_');
	str = str.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g,'_').replace(/__/g,'_');
	return str
}


function GetTableFromExcel(data, query, token) {
        //Read the Excel File data in binary
        var workbook = XLSX.read(data, {
            type: 'binary'
        });
 
        //get the name of First Sheet.
        var Sheet = workbook.SheetNames[0];
 
        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[Sheet]);
		//console.log(query)
        //console.log(Sheet)
		var title = Object.keys(excelRows[0])[0]
		title = title.split('_')
		var score = []
		var mark = Object.values(excelRows[0])
		//console.log(mark)
		if(title[0] == query.session && title[1] == query.term && title[2] == query.cls && title[3] == query.subject){
		
			for (var i = 0; i < excelRows.length; i++) {
				if(i == 0){}
				else{
					var file = {}
					for(var z = 0; z < mark.length; z++){
						//console.log(mark[z])
						var ex = Object.values(excelRows[i])
						//console.log(ex[z])
						file[mark[z]] = ex[z]
					}
					score.push(file)
				}
			}
			var href = 'https://alxproject.virilesoftware.com/api/scorebyexcel';
			$.ajax({
				type: 'POST',
				data: {info:JSON.stringify(score), ...query},
				url: href,
				dataType:'JSON',
				beforeSend : function(req) {
					req.setRequestHeader('Authorization', 'Bearer '+token);
				}
			}).done(function(data){
				if(data.status == 200){
					alert(data.message)
					window.location.reload()
				}
				else
				{
					alert(data.message)
					//$('#processtransaction').removeClass('d-none');
					//$('#processing-btn').addClass('d-none');
				}
								
			});
			
		}
		else{
			alert('Cannot process the excel file, not a valid document')
		}
 
 
        
};
	
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
	var table = null
	var home_table = null
	var query = {}
	
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
			//console.log(datas)
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
				//console.log(data)
				$('#academic_session').val(data.session_id)
				$('#academic_session').trigger('change')
				$('#session_term').val(data.term)
				$('#session_term').trigger('change')
				
				$('#academic_session_home').val(data.session_id)
				$('#academic_session_home').trigger('change')
				$('#session_term_home').val(data.term)
				$('#session_term_home').trigger('change')
				
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
		
		
		
	}
	else
	{
		window.location = 'https://alxproject.virilesoftware.com/eportal/login'
	}
	
	$(document).on('change', '#student_class', function (event) {
		var ref = $('#student_class').select2('data')[0].text
		$('#student_subject').html('')
		$('#load_box').addClass('d-none')
		$.ajax({
			type: 'GET',
			data: {student_class:ref},
			url: 'https://alxproject.virilesoftware.com/api/subjectbyclass',
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            for(var i = 0; i < datas.length; i++)
			{
				$('#student_subject').append('<option value="'+datas[i].ref_id+'">'+datas[i].name+'</option>')
			}
			$('#subject_box').removeClass('d-none')
			$('#load_box').removeClass('d-none')
            
		})
	});
	
	
	$(document).on('click', '#filter_search', function (event) {
		var dt = {
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
			student_subject:$('#student_subject').select2('data')[0].id,
		}
		query = dt
        var payload = jwt_decode(token);
		var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
		$.ajax({
			type: 'GET',
			data: dt,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            //console.log(datas)
			var academic_session = $('#academic_session').select2('data')[0].text
				var session_term =$('#session_term').select2('data')[0].text
				var student_class = $('#student_class').select2('data')[0].text
				var student_subject = $('#student_subject').select2('data')[0].text
			if(datas.status == 200){
				var fors  = [[academic_session+'_'+session_term+'_'+student_class+'_'+student_subject],[],[]]
				var column = ["Admission No","Name"]
				var mark = datas.mark
				for(var i = 0; i < mark.length; i++)
				{
					column.push(mark[i].abbr)
				}
				console.log(column)
				fors.push(column)
				var data = datas.data
				for(var i = 0; i < data.length; i++){
					var sn = i + 1
					var files = [data[i].admission_no, data[i].student_name]
					var sc = JSON.parse(data[i].score)
					for(var s = 0; s < sc.length; s++){
						
						files.push(sc[s].value)
					}
					fors.push(files)
				}
				//console.log(fors)
				
				var filename = replacetext(student_subject);
				filename = filename+'.xlsx'
				var ws_name = student_subject;
				var ws_names = academic_session+'_'+session_term+'_'+student_class+'_'+student_subject;
				ws_names = ws_names.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'___');
				//console.log(filename)
				//console.log(ws_name)
				var wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(fors);
				wb.Props = {
						Title: ws_names,
						Subject: student_subject,
						Author: "Syntaxng",
						CreatedDate: new Date()
				};
				/* add worksheet to workbook */
				XLSX.utils.book_append_sheet(wb, ws, ws_name);
				XLSX.writeFile(wb, filename);
			   
				
			}
            
		})
		
	})
	
	var fileInput = document.getElementById('fileUpload');
	$(document).on('click', '#uploadexcel', function (event) {
		fileInput.value = "";
		$('#fileUpload').trigger('click'); 
	})
	
    fileInput.addEventListener('change', function (evnt) {
		//console.log(fileInput.files);
		var dt = {
			academic_session:$('#academic_session').select2('data')[0].id,
			session_term:$('#session_term').select2('data')[0].id,
			student_class:$('#student_class').select2('data')[0].id,
			student_subject:$('#student_subject').select2('data')[0].id,
			subject:$('#student_subject').select2('data')[0].text,
			session:$('#academic_session').select2('data')[0].text,
			term:$('#session_term').select2('data')[0].text,
			cls:$('#student_class').select2('data')[0].text,
		}
		query = dt
		var files_in = $("input[name=fileUpload]")[0].files[0]
		var val = fileInput.value.toLowerCase()
		val = val.split('.')
		console.log(val)
		var last = val.length - 1
		if(val[last] == 'xls' || val[last]  == 'xlsx'){
			console.log('valid')
		
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
 
                //For Browsers other than IE.
                if (reader.readAsBinaryString) {
                    reader.onload = function (e) {
                        GetTableFromExcel(e.target.result, query, token);
                    };
                    reader.readAsBinaryString(fileUpload.files[0]);
                } else {
                    //For IE Browser.
                    reader.onload = function (e) {
                        var data = "";
                        var bytes = new Uint8Array(e.target.result);
                        for (var i = 0; i < bytes.byteLength; i++) {
                            data += String.fromCharCode(bytes[i]);
                        }
                        GetTableFromExcel(data, query, token);
						console.log(data)
                    };
                    reader.readAsArrayBuffer(fileUpload.files[0]);
                }
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid Excel file.");
        }
    
  });
	
	$(document).on('click', '#processtransaction', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		var data = table.getData()
		//console.log(data)
		//console.log(query)
		//$('#processtransaction').addClass('d-none');
		//$('#processing-btn').removeClass('d-none');
		var href = 'https://alxproject.virilesoftware.com/api/scorebysubject';
		$.ajax({
			type: 'POST',
			data: {info:JSON.stringify(table.getData()), ...query},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 200){
				alert(data.message)
				window.location.reload()
			}
			else
			{
				
				$('#processtransaction').removeClass('d-none');
				$('#processing-btn').addClass('d-none');
			}
							
		});
		
		
	})
	
});