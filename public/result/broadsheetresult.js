$(document).ready(function(){
	var rows = []
	var staff = []
	var z = 0
	var total_amount = 0
	var table = null
	var token = auth.getToken();
    var loading = ''
    var result_id = ''
    var ref_id = $('head').attr('id')
	
	
	$(document).on('click', '.download_result', function (event) {
		event.preventDefault()
		var ref_ids = $(this).attr('data-id')
        result_id = ref_ids
        var term = $(this).attr('data-term')
        var session = $(this).attr('data-session')
        loading += 'loading'+ref_ids
        //$('#'+loading).removeClass('d-none')
        //$(this).addClass('d-none')
        var href = 'https://alxproject.virilesoftware.com/api/broadsheet';
		$.ajax({
			type: 'GET',
			data: {class_arm_id:ref_ids, session:session,term:term},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            console.log(datas)
			createPdf(datas.school_info, datas.data, datas.average, datas.subject, term, datas.brought_forward);

        })
        
    })
	
	
	
});





async function createPdf(school_info, student_result, average, subject, term,brought_forward) {
    const student = [...student_result]
    const pdfDoc = await PDFLib.PDFDocument.create()
    
    while(student.length > 0){
        const new_arr = student.splice(0, 25)
        let page = pdfDoc.addPage(PDFLib.PageSizes.A3)
        var sch = await createSchoolInfo(pdfDoc, page, school_info)
        var s = await createBroadSheetPanel(pdfDoc, page, new_arr, average, subject, term, brought_forward)
        
    }
    
    
    
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    const link = document.createElement("a");
    link.href = pdfDataUri;
    link.download = 'broadsheet.pdf';
    link.click();
    //$('#loading'+result_ids).addClass('d-none')
    //$('#download_result'+result_ids).removeClass('d-none')


}

async function createBroadSheetPanel(pdfDoc, page, score, average, subject, term, brought_forward) {
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaObliqueFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    const helveticaObliqueBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBoldOblique)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
    //console.log(subject)
    let len = subject.length
    let a = 30
    if(len >= 10 && len <= 20){
        a = 25
    }
    if(len >= 20 && len <= 28){
        a = 20
    }
    if(len > 28 && len <= 32){
        a = 18
    }
    if(len > 32){
        a = 16
       
    }
    let s = 0
    let start = 270
    
    page.drawLine({start: { x: 110, y: 262}, end: { x: 276, y: 262},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    for(let s = 0; s < len; s++){
        page.drawLine({start: { x: 110, y: start + 12}, end: { x: 276, y: start + 12},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: start - 6}, end: { x: 110, y: start + a - 6},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawText(subject[s].abbr, {x:114, y:start, size:9, font:helveticaFont})
        start += a
        
    }
    let n = start
    if(term == 'First Term'){
        page.drawText('TOTAL SCORE OBTAINDED', {x:114, y:n + 5, size:10, font:helveticaFont})
        page.drawText('AVERAGE PERSENTAGE (100%)', {x:114, y:n + 35, size:10, font:helveticaFont})
        page.drawText('RANK', {x:114, y:n + 65, size:10, font:helveticaFont})
        page.drawLine({start: { x: 110, y: n + 24}, end: { x: 276, y: n + 24},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 54}, end: { x: 276, y: n + 54},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 84}, end: { x: 276, y: n + 84},color: PDFLib.rgb(0.0, 0.0, 0.8)})

        page.drawLine({start: { x: 110, y: n - 8}, end: { x: 110, y: n + 84},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 276, y: n - 8}, end: { x: 276, y: n + 84},color: PDFLib.rgb(0.0, 0.0, 0.8)})

        
        
        
    }
    if(term == 'Second Term'){
        page.drawText('FIRST TERM TOTAL SCORE', {x:114, y:n + 5, size:10, font:helveticaFont})
        page.drawText('SECOND TERM TOTAL SCORE', {x:114, y:n + 35, size:10, font:helveticaFont})
        page.drawText('OVERALL SCORE OBTAINED', {x:114, y:n + 65, size:10, font:helveticaFont})
        page.drawText('AVERAGE PERSENTAGE (100%)', {x:114, y:n + 95, size:10, font:helveticaFont})
        page.drawText('RANK', {x:114, y:n + 125, size:10, font:helveticaFont})
        page.drawLine({start: { x: 110, y: n + 24}, end: { x: 276, y: n + 24},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 54}, end: { x: 276, y: n + 54},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 84}, end: { x: 276, y: n + 84},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 114}, end: { x: 276, y: n + 114},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 144}, end: { x: 276, y: n + 144},color: PDFLib.rgb(0.0, 0.0, 0.8)})

        page.drawLine({start: { x: 110, y: n - 8}, end: { x: 110, y: n + 144},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 276, y: n - 8}, end: { x: 276, y: n + 144},color: PDFLib.rgb(0.0, 0.0, 0.8)})

        
    }
    if(term == 'Third Term'){
        page.drawText('FIRST TERM TOTAL SCORE', {x:114, y:n + 5, size:10, font:helveticaFont})
        page.drawText('SECOND TERM TOTAL SCORE', {x:114, y:n + 35, size:10, font:helveticaFont})
        page.drawText('THIRD TERM TOTAL SCORE', {x:114, y:n + 65, size:10, font:helveticaFont})
        page.drawText('OVERALL SCORE OBTAINED', {x:114, y:n + 95, size:10, font:helveticaFont})
        page.drawText('AVERAGE PERSENTAGE (100%)', {x:114, y:n + 125, size:10, font:helveticaFont})
        page.drawText('RANK', {x:114, y:n + 155, size:10, font:helveticaFont})
        page.drawLine({start: { x: 110, y: n + 24}, end: { x: 276, y: n + 24},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 54}, end: { x: 276, y: n + 54},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 84}, end: { x: 276, y: n + 84},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 114}, end: { x: 276, y: n + 114},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 144}, end: { x: 276, y: n + 144},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n + 174}, end: { x: 276, y: n + 174},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 110, y: n - 8}, end: { x: 110, y: n + 174},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: 276, y: n - 8}, end: { x: 276, y: n + 174},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        


    }
    let name_x = 290
    
    page.drawLine({start: { x: 110, y: 40}, end: { x: 280, y: 40},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 110, y: 40}, end: { x: 110, y: 282},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 276, y: 40}, end: { x: 276, y: 262},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    for(let s = 0; s < score.length; s++){
        page.drawText(score[s].student_name, {x:name_x, y:44, size:12, font:helveticaFont,rotate: PDFLib.degrees(90)})
        page.drawLine({start: { x: name_x + 6, y: 40}, end: { x: name_x + 6, y: 262},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: name_x - 20, y: 40}, end: { x: name_x + 6, y: 40},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawLine({start: { x: name_x - 20, y: 262}, end: { x: name_x + 6, y: 262},color: PDFLib.rgb(0.0, 0.0, 0.8)})
        let starts = 282
        let x_line = name_x - 14
        for(let j = 0; j < len; j++){
            let sc = score[s][subject[j].name]
            let student_score = ''
            if(!sc){}
            else{
                student_score = sc
            }
            page.drawLine({start: { x: x_line, y: starts}, end: { x: x_line + 20, y: starts},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: starts}, end: { x: x_line, y: starts - a},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            
            page.drawText(student_score, {x:x_line + 12, y:starts - a + 2, size:9, font:helveticaFont,rotate: PDFLib.degrees(90)})
            starts += a
            
        }
        name_x += 20
        let p = starts - 20
        if(term == 'First Term'){
            page.drawText(''+score[s].total_score, {x:x_line + 12, y:p + 5, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawText(''+score[s].average_score_id, {x:x_line + 12, y:p + 35, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})

            var pos = average.indexOf(score[s].average_score_id) + 1
            var l = positionstatus(pos)
            page.drawText(pos+l, {x:x_line + 12, y:p + 65, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawLine({start: { x: x_line, y: p + 32}, end: { x: x_line + 20, y: p + 32},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 62}, end: { x: x_line + 20, y: p + 62},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 92}, end: { x: x_line + 20, y: p + 92},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: starts - 20}, end: { x: x_line, y: p + 92},color: PDFLib.rgb(0.0, 0.0, 0.8)})

        }
        if(term == 'Second Term'){
            page.drawText(''+score[s].first_term_score, {x:x_line + 12, y:p + 5, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawText(''+score[s].second_term_score, {x:x_line + 12, y:p + 35, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawText(''+score[s].total_score, {x:x_line + 12, y:p + 65, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawText(''+score[s].average_score_id, {x:x_line + 12, y:p + 95, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})

            var pos = average.indexOf(score[s].average_score_id) + 1
            var l = positionstatus(pos)
            page.drawText(pos+l, {x:x_line + 12, y:p + 125, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})


            page.drawLine({start: { x: x_line, y: p + 32}, end: { x: x_line + 20, y: p + 32},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 62}, end: { x: x_line + 20, y: p + 62},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 92}, end: { x: x_line + 20, y: p + 92},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 122}, end: { x: x_line + 20, y: p + 122},color: PDFLib.rgb(0.0, 0.0, 0.8)})

            page.drawLine({start: { x: x_line, y: p + 152}, end: { x: x_line + 20, y: p + 152},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: starts - 20}, end: { x: x_line, y: p + 152},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            
        }
        if(term == 'Third Term'){
            page.drawText(''+score[s].first_term_score, {x:x_line + 12, y:p + 5, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawText(''+score[s].second_term_score, {x:x_line + 12, y:p + 35, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawText(''+score[s].third_term_score, {x:x_line + 12, y:p + 65, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawText(''+score[s].total_score, {x:x_line + 12, y:p + 95, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})
            page.drawText(''+score[s].average_score_id, {x:x_line + 12, y:p + 125, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})

            var pos = average.indexOf(score[s].average_score_id) + 1
            var l = positionstatus(pos)
            page.drawText(pos+l, {x:x_line + 12, y:p + 155, size:10, font:helveticaFont,rotate: PDFLib.degrees(90)})

            page.drawLine({start: { x: x_line, y: p + 32}, end: { x: x_line + 20, y: p + 32},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 62}, end: { x: x_line + 20, y: p + 62},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 92}, end: { x: x_line + 20, y: p + 92},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 122}, end: { x: x_line + 20, y: p + 122},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 152}, end: { x: x_line + 20, y: p + 152},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: p + 182}, end: { x: x_line + 20, y: p + 182},color: PDFLib.rgb(0.0, 0.0, 0.8)})
            page.drawLine({start: { x: x_line, y: starts - 20}, end: { x: x_line, y: p + 182},color: PDFLib.rgb(0.0, 0.0, 0.8)})

            
        }
        
        
    }
    if(term == 'First Term'){
        page.drawLine({start: { x: name_x - 14, y: 262}, end: { x: name_x - 14, y: start  - 6 + 90},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    }
    if(term == 'Second Term'){
        page.drawLine({start: { x: name_x - 14, y: 262}, end: { x: name_x - 14, y: start  - 6 + 150},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    }
    if(term == 'Third Term'){
        page.drawLine({start: { x: name_x - 14, y: 262}, end: { x: name_x - 14, y: start  - 6 + 180},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    }
    
   
}



async function createSchoolInfo(pdfDoc, page, school_info) {
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const oldenglish = await fetch('https://alxproject.virilesoftware.com/fonts/EnglishTowne.ttf').then((res) => res.arrayBuffer()).then((res) => new Uint8Array(res));

    pdfDoc.registerFontkit(fontkit);

    const oldEnglishFont = await pdfDoc.embedFont(oldenglish, { subset: true });
    page.drawRectangle({
        x: 10,
        y: 200,
        width: 70,
        height: 800,
        borderWidth: 1,
        borderColor: PDFLib.rgb(0.0, 0.0, 0.8),
        
    })
    const sch_logo = school_info.sch_logo
    const state_logo = school_info.state_logo
    try{
        const sch_logo_byte = await fetch(sch_logo).then((res) => res.arrayBuffer())
        const sch_logo_Image = await pdfDoc.embedJpg(sch_logo_byte)
        page.drawImage(sch_logo_Image, {
            x: 76,
            y: 200,
            width: 64,
            height: 64,
            opacity:0.9,
            rotate: PDFLib.degrees(90)
        })
    }
    catch(error){}
    try{
        const state_logo_byte = await fetch(state_logo).then((res) => res.arrayBuffer())
        const state_logo_Image = await pdfDoc.embedJpg(state_logo_byte)
        page.drawImage(state_logo_Image, {
            x: 76,
            y: 930,
            width: 64,
            height: 64,
            opacity:0.9,
            rotate: PDFLib.degrees(90)
        })
    }
    catch(error){}
    if(school_info.sub == ''){
        page.drawText(school_info.name, {x:34, y:478,size:26, font:oldEnglishFont,rotate: PDFLib.degrees(90)})
        page.drawText(school_info.address, {x:54, y:436,size:10, font:helveticaBoldFont,rotate: PDFLib.degrees(90)})
        page.drawText(school_info.session, {x:74, y:482,size:12, font:helveticaBoldFont,rotate: PDFLib.degrees(90)})
    }
    else{
        page.drawText(school_info.name, {x:28, y:478,size:26, font:oldEnglishFont,rotate: PDFLib.degrees(90)})
        page.drawText(school_info.sub, {x:42, y:502,size:9, font:helveticaBoldFont,rotate: PDFLib.degrees(90)})
        page.drawText(school_info.address, {x:58, y:436,size:10, font:helveticaBoldFont,rotate: PDFLib.degrees(90)})
        page.drawText(school_info.session, {x:76, y:482,size:12, font:helveticaBoldFont,rotate: PDFLib.degrees(90)})
    }
}




function getStartCharacter(start, charsize, width, len){
    var wd = width / charsize
    var lens = (wd - len) / 2
    lens = lens * charsize
    lens = lens + start
    return lens
}

function getSpace(width, charsize, total_character, arr_len){
    var t = charsize * total_character
    var total_space_with = width - t
    var each_space = total_space_with / arr_len
    return each_space
}

function positionstatus(index){
    if(parseInt(index) == 1){
        return 'st'
    }
    else if(parseInt(index) == 2){
        return 'nd'
    }
    else if(parseInt(index) == 3)
    {
        return 'rd'
    }
    else{
        return 'th'
    }
}