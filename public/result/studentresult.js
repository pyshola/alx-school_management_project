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
        loading += 'loading'+ref_ids
        $('#'+loading).removeClass('d-none')
        $(this).addClass('d-none')
        var href = 'https://alxproject.virilesoftware.com/api/studentresult/'+ref_ids;
		$.ajax({
			type: 'GET',
			data: {term:term},
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            //console.log(datas)
			createPdf(datas.school_info, datas.data, datas.school_term, datas.b_f, result_id);

        })
        
    })
	
	
	
});





async function createPdf(school_info, student_result, school_term, b_f, result_ids) {
    const pdfDoc = await PDFLib.PDFDocument.create()
    
    for(var i = 0; i < student_result.length; i++){
        let page = pdfDoc.addPage(PDFLib.PageSizes.A4)
        //c.drawImage(passports, 14, 754, 64, 64)
        //c.drawImage(passtwo, 504, 754, 64, 64)
        //c.saveState()
        //c.setFont('Helvetica-Bold', 16)
        var biodata = student_result[i].biodata
        var abbr = student_result[i].abbr
        var rating = student_result[i].rating
        var affective = student_result[i].affective
        var psychomotor = student_result[i].psychomotor
        var comment = student_result[i].comment
        //console.log(comment)
        var sport = student_result[i].sport
        var behavior = student_result[i].behavior
        var assentment = student_result[i].result
        var key = ''
        

        var sch = await createSchoolInfo(pdfDoc, page, school_info)
        var sch = await createStudentBiodata(pdfDoc, page, biodata)
        

        if(school_info.category == 'secondary'){
            if(school_info.cls == 'senior'){
                var line = await createStudentSecondaryAssentment(pdfDoc, page, assentment, school_term, b_f, abbr)
            }
            else{
                var line = await createStudentAssentment(pdfDoc, page, assentment, school_term, b_f, abbr)
            }
            
            line = await createMarkAbbr(pdfDoc, page, abbr, line)
            line = await createRating(pdfDoc, page, rating, line)
            var line = await createBehaviouralSkill(pdfDoc, page, behavior, line)
            var line = await createSport(pdfDoc, page, sport, line)
            var line = await createKeyBehaviouralSkill(pdfDoc, page, key, line)
            var line = await createComment(pdfDoc, page, comment, line, 'secondary')       
        }
        else{
            var line = await createStudentAssentment(pdfDoc, page, assentment, school_term, b_f, abbr)
            line = await createMarkAbbr(pdfDoc, page, abbr, line)
            line = await createRating(pdfDoc, page, rating, line)
            var lines = await createAffectiveBehavioural(pdfDoc, page, affective, line)
            var skill_line = await createPsychomotorskill(pdfDoc, page, psychomotor, line)
            var line = await createComment(pdfDoc, page, comment, lines, 'primary')
        }

    }
    
    
    
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    
        
    //console.log(pdfDataUri)
    //var data_url = URL.createObjectURL(pdfDataUri);
    //document.getElementById('pdf').src = data_url;
    /*const links = document.createElement("iframe");
    links.setAttribute('src', pdfDataUri);

    links.style.width = "100%";
    links.style.height = "100%";    
    document.body.appendChild(links);*/

    const link = document.createElement("a");
    link.href = pdfDataUri;
    link.download = 'save.pdf';
    link.click();
    $('#loading'+result_ids).addClass('d-none')
    $('#download_result'+result_ids).removeClass('d-none')


}

async function createSchoolInfo(pdfDoc, page, school_info) {
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const oldenglish = await fetch('https://alxproject.virilesoftware.com/fonts/EnglishTowne.ttf').then((res) => res.arrayBuffer()).then((res) => new Uint8Array(res));

    pdfDoc.registerFontkit(fontkit);

    const oldEnglishFont = await pdfDoc.embedFont(oldenglish, { subset: true });
    
    //page.setFont(oldEnglishFont);
    page.drawRectangle({
        x: 10,
        y: 750,
        width: 570,
        height: 70,
        borderWidth: 1,
        borderColor: PDFLib.rgb(0.0, 0.0, 0.8),
        
    })
    const sch_logo = school_info.sch_logo
    const state_logo = school_info.state_logo
    
    try{
        const sch_logo_byte = await fetch(sch_logo).then((res) => res.arrayBuffer())
        const sch_logo_Image = await pdfDoc.embedJpg(sch_logo_byte)
        page.drawImage(sch_logo_Image, {
            x: 184,
            y: 406,
            width: 240,
            height: 240,
            opacity:0.3
        })
    }
    catch(error){}

    try{
        const sch_logo_byte = await fetch(sch_logo).then((res) => res.arrayBuffer())
        const sch_logo_Image = await pdfDoc.embedJpg(sch_logo_byte)
        page.drawImage(sch_logo_Image, {
            x: 14,
            y: 754,
            width: 64,
            height: 64,
        })
    }
    catch(error){}

    try{
        const state_logo_byte = await fetch(state_logo).then((res) => res.arrayBuffer())
        const state_logo_Image = await pdfDoc.embedJpg(state_logo_byte)
        page.drawImage(state_logo_Image, {
            x: 504,
            y: 754,
            width: 64,
            height: 64,
        })
    }
    catch(error){}
    var signature_logo_byte = ''
    try{
        signature_logo_byte = await fetch(school_info.signature).then((res) => res.arrayBuffer())
    }
    catch(err){}
    console.log(signature_logo_byte)
    try{
        const signature_logo_Image = await pdfDoc.embedJpg(signature_logo_byte)
        page.drawImage(signature_logo_Image, {
            x: 464,
            y: 10,
            width: 118,
            height: 98,
            opacity:0.7
        })
    }
    catch(error){
        console.log(error)
    }
    
    try{
        const signature_logo_Images = await pdfDoc.embedPng(signature_logo_byte)
        page.drawImage(signature_logo_Images, {
            x: 464,
            y: 10,
            width: 118,
            height: 98,
            opacity:0.7
        })
    }
    catch(error){
        console.log(error)
    }
    
    
    
    if(school_info.sub == ''){
        var len_name = getStartCharacter(80, 14, 424, school_info.name.length)
        var len = getStartCharacter(80, 6, 424, school_info.address.length)
        var sessionlen = getStartCharacter(80, 7, 424, school_info.session.length)
        page.drawText(school_info.name, {x:112, y:794,size:26, font:oldEnglishFont})
        page.drawText(school_info.address, {x:len, y:776,size:10, font:helveticaBoldFont})
        page.drawText(school_info.session, {x:sessionlen, y:762,size:12, font:helveticaBoldFont})
    }
    else{
        var len_name = getStartCharacter(80, 14, 424, school_info.name.length)
        var len = getStartCharacter(80, 6, 424, school_info.address.length)
        var sublen = getStartCharacter(80, 7, 424, school_info.sub.length)
        var sessionlen = getStartCharacter(80, 7, 424, school_info.session.length)
        page.drawText(school_info.name, {x:70, y:794,size:26, font:oldEnglishFont})
        page.drawText(school_info.sub, {x:sublen, y:782,size:9, font:helveticaBoldFont})
        page.drawText(school_info.address, {x:len, y:768,size:10, font:helveticaBoldFont})
        page.drawText(school_info.session, {x:sessionlen, y:754,size:12, font:helveticaBoldFont})
    }
    

}

async function createStudentBiodata(pdfDoc, page, biodata) {
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    //passport
    try{
        const passport_byte = await fetch(biodata.passport).then((res) => res.arrayBuffer())
        const passport_Image = await pdfDoc.embedJpg(passport_byte)
        page.drawImage(passport_Image, {
            x: 242,
            y: 640,
            width: 86,
            height: 98,
        })
    }
    catch(error){}
    page.drawRectangle({
        x: 10,
        y: 636,
        width: 230,
        height: 107,
        borderColor: PDFLib.rgb(0.0, 0.0, 0.8),
        opacity:1,
    })
    //Biodata
    page.drawText("STUDENT'S PERSONAL DATA", {x:40, y:728,size:12, font:helveticaBoldFont})
    page.drawText("Name:", {x:12, y:708,size:7, font:helveticaBoldFont})
    page.drawText("Date of Birth", {x:12, y:694,size:7, font:helveticaBoldFont})
    page.drawText("Sex:", {x:12, y:680,size:7, font:helveticaBoldFont})
    page.drawText("Class:", {x:12, y:666,size:7, font:helveticaBoldFont})
    page.drawText("Admission No", {x:12, y:652,size:7, font:helveticaBoldFont})
    page.drawText("School Code:", {x:12, y:638,size:7, font:helveticaBoldFont})
    
    page.drawLine({start: { x: 68, y: 724 }, end: { x: 68, y: 636 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 10, y: 724 }, end: { x: 240, y: 724 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 10, y: 706 }, end: { x: 240, y: 706 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 10, y: 692 }, end: { x: 240, y: 692 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 10, y: 678 }, end: { x: 240, y: 678 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 10, y: 664 }, end: { x: 240, y: 664 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 10, y: 650 }, end: { x: 240, y: 650 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText(biodata.name, {x:70, y:708,size:10, font:helveticaFont})
    page.drawText(biodata.dob, {x:70, y:694,size:10, font:helveticaFont})
    page.drawText(biodata.gender, {x:70, y:680,size:10, font:helveticaFont})
    page.drawText(biodata.student_class, {x:70, y:666,size:10, font:helveticaFont})
    page.drawText(biodata.admission_no, {x:70, y:652,size:10, font:helveticaFont})
    page.drawText(biodata.school_code, {x:70, y:640,size:10, font:helveticaFont})

    //Attendance
    page.drawRectangle({x: 330,y: 706,width: 150,height: 36,borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    page.drawRectangle({x: 330,y: 666,width: 150,height: 38,borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    page.drawRectangle({x: 330,y: 636,width: 150,height: 28,borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    page.drawRectangle({x: 482,y: 672,width: 98,height: 70,borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    page.drawRectangle({x: 482,y: 636,width: 98,height: 33,borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})

    page.drawText('ATTENDANCE', {x:365, y:735,size:7, font:helveticaBoldFont})
    page.drawLine({start: { x: 330, y: 732 }, end: { x: 480, y: 732 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 330, y: 718 }, end: { x: 480, y: 718 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 384, y: 732 }, end: { x: 384, y: 706 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 431, y: 732 }, end: { x: 431, y: 706 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('No of Times', {x:332, y:726,size:6, font:helveticaBoldFont})
    page.drawText('School Opened', {x:332, y:720,size:6, font:helveticaBoldFont})
    page.drawText('No of Times', {x:388, y:726,size:6, font:helveticaBoldFont})
    page.drawText('Present', {x:388, y:720,size:6, font:helveticaBoldFont})
    page.drawText('No of Times', {x:435, y:726,size:6, font:helveticaBoldFont})
    page.drawText('Absent', {x:435, y:720,size:6, font:helveticaBoldFont})

    page.drawText(''+biodata.school_opened, {x:346, y:710,size:8, font:helveticaBoldFont})
    page.drawText(''+biodata.student_present, {x:398, y:710,size:8, font:helveticaBoldFont})
    page.drawText(''+biodata.student_absent, {x:448, y:710,size:8, font:helveticaBoldFont})

    
    page.drawText(`TERMINAL DURATION(${biodata.terminal} WEEKS)`, {x:335, y:694,size:7, font:helveticaBoldFont})
    page.drawLine({start: { x: 330, y: 691 }, end: { x: 480, y: 691 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 330, y: 677 }, end: { x: 480, y: 677 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 380, y: 691 }, end: { x: 380, y: 666 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 428, y: 691 }, end: { x: 428, y: 666 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('Term Begins', {x:332, y:680,size:6, font:helveticaBoldFont})
    page.drawText('Term Ends', {x:383, y:680,size:6, font:helveticaBoldFont})
    page.drawText('Next Term Begins', {x:429, y:680,size:6, font:helveticaBoldFont})
    page.drawText('No in Class', {x:348, y:653,size:7, font:helveticaBoldFont})
    page.drawText('Position', {x:422, y:653,size:7, font:helveticaBoldFont})


    page.drawText(biodata.school_begin, {x:332, y:668,size:8, font:helveticaBoldFont})
    page.drawText(biodata.school_end, {x:383, y:668,size:8, font:helveticaBoldFont})
    page.drawText(biodata.school_next_term, {x:430, y:668,size:8, font:helveticaBoldFont})

    page.drawText(''+biodata.no_in_class, {x:358, y:640,size:10, font:helveticaFont})
    page.drawText(''+biodata.position, {x:434, y:640,size:10, font:helveticaFont})
    

    
    
    page.drawLine({start: { x: 330, y: 650 }, end: { x: 480, y: 650 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 405, y: 664 }, end: { x: 405, y: 636 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    
    

    page.drawText('TOTAL SCORE', {x:484, y:731,size:7, font:helveticaBoldFont})
    page.drawText('OBTAINABLE', {x:484, y:723,size:7, font:helveticaBoldFont})
    page.drawLine({start: { x: 482, y: 718 }, end: { x: 580, y: 718 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('TOTAL SCORE', {x:484, y:708,size:7, font:helveticaBoldFont})
    page.drawText('OBTAINED', {x:484, y:700,size:7, font:helveticaBoldFont})
    page.drawLine({start: { x: 482, y: 694 }, end: { x: 580, y: 694 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('AVERAGE', {x:484, y:684,size:7, font:helveticaBoldFont})
    page.drawText('PERCENTAGE', {x:484, y:676,size:7, font:helveticaBoldFont})
    page.drawLine({start: { x: 482, y: 694 }, end: { x: 580, y: 694 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 538, y: 742 }, end: { x: 538, y: 672 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText(''+biodata.score_obtainable, {x:540, y:725,size:10, font:helveticaFont})
    page.drawText(''+biodata.score_obtain, {x:540, y:700,size:10, font:helveticaFont})
    page.drawText(''+biodata.percentage, {x:540, y:680,size:11, font:helveticaFont})
    //var l = getStartCharacter(486, 14, 100, biodata.promoted.length)
    if(parseFloat(biodata.percentage) < 49.5){
        page.drawText('BELOW', {x:504, y:654,size:14, font:helveticaBoldFont})
        page.drawText('AVERAGE', {x:496, y:640,size:14, font:helveticaBoldFont})
    }
    if(parseFloat(biodata.percentage) >= 49.5 && parseFloat(biodata.percentage) < 59.5){
        page.drawText('PASSED', {x:498, y:648,size:14, font:helveticaBoldFont})
    }
    if(parseFloat(biodata.percentage) >= 59.5 && parseFloat(biodata.percentage) < 69.5){
        page.drawText('GOOD', {x:498, y:648,size:14, font:helveticaBoldFont})
    }
    if(parseFloat(biodata.percentage) >= 69.5){
        page.drawText('EXCELLENT', {x:490, y:648,size:14, font:helveticaBoldFont})
    }
    

    
    
}

async function createStudentAssentment(pdfDoc, page, info, school_term, b_f, abbr) {
    //console.log(info)
    //console.log(abbr)
    //page.drawLine({start: { x: 10, y: 640}, end: { x: 570, y: 640 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    var line = 625
    var t = 65
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaObliqueFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    const helveticaObliqueBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBoldOblique)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
    if(info.length > 10){
        var per_score = 13
        var fonts = 7
        var plus = 5
    }
    else{
        var per_score = 18
        var fonts = 8
        var plus = 7
    }
    //subject and b /f drawing
    page.drawRectangle({x: 10,y: 560,width: 570,height: 65,borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    if(b_f == 'Yes'){
        if(school_term == 'Third Term'){
            page.drawText('1ST', {x:119, y:line - 45,size:7, font:helveticaFont})
            page.drawText('TERM', {x:117, y:line - 55,size:7, font:helveticaFont})
            page.drawLine({start: { x: 115, y: 625}, end: { x: 115, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //third term 
            page.drawText('2ND', {x:146, y:line - 45,size:7, font:helveticaFont})
            page.drawText('TERM', {x:144, y:line - 55,size:7, font:helveticaFont})
            page.drawLine({start: { x: 142, y: 625}, end: { x: 142, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // second term only
       }
       if(school_term == 'Second Term'){
            page.drawText('1ST', {x:146, y:line - 40,size:7, font:helveticaFont})
            page.drawText('TERM', {x:144, y:line - 55,size:7, font:helveticaFont})
            page.drawLine({start: { x: 142, y: 625}, end: { x: 142, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // second term only
        }
    }
    page.drawLine({start: { x: 167, y: 625}, end: { x: 167, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawText('SUBJECTS', {x:35, y:line - 40,size:10, font:helveticaFont})
    
    

    var result_width = 163
    var score_block = result_width / (abbr.length)
    var close_score = []
    var s_dist = {}
    for(var r = 0; r < abbr.length; r++){
        var total_character = abbr[r].abbr.length
        
        var point_char = abbr[r].point.length            
        var p = (r * score_block) + 167
        close_score.push(p)
        var l = getStartCharacter(p, 3, score_block, total_character) - 2
        var point_l = getStartCharacter(p, 3, score_block, point_char) - 2
        s_dist[abbr[r].abbr] = point_l
        page.drawLine({start: { x: p, y: 625 }, end: { x: p, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawText(abbr[r].abbr, {x:l, y:line - 40,size:8, font:helveticaFont})
        page.drawText(abbr[r].point, {x:point_l, y:line - 55,size:8, font:helveticaFont})
        
    }


    var x = 75 + plus
    for(var s = 0; s < info.length; s++){
        x = (s * per_score) + 75 + plus
        try{
            var mark = JSON.parse(info[s].mark)
            for(var v = 0; v < mark.length; v++){
                var ab = mark[v].abbr
                var poi = s_dist[ab]
                page.drawText(''+mark[v].value, {x:poi, y:line - x + plus, size:fonts, font:helveticaObliqueBoldFont})
                //
            }
        }
        catch(err){
            //console.log(err)
        }
        
    }


    page.drawLine({start: { x: 330, y: 625}, end: { x: 330, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // total score
    page.drawText('TOTAL', {x:340, y:line - 30,size:10, font:helveticaFont})
    page.drawText('SCORE', {x:338, y:line - 40,size:10, font:helveticaFont})
    page.drawText('FOR THE', {x:334, y:line - 50,size:10, font:helveticaFont})
    page.drawText('TERM', {x:340, y:line - 60,size:10, font:helveticaFont})


    page.drawLine({start: { x: 380, y: 625}, end: { x: 380, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // total score
    page.drawText('TOTAL', {x:392, y:line - 50,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})
    page.drawText('SCORE', {x:405, y:line - 52,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})

    page.drawLine({start: { x: 415, y: 625}, end: { x: 415, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //percentage
    page.drawText('Percentage', {x:434, y:line - 57,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})

    page.drawLine({start: { x: 450, y: 625}, end: { x: 450, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //position in subject
    page.drawText('Position', {x:460, y:line - 54,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})
    page.drawText('in', {x:470, y:line - 45,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})
    page.drawText('Subject', {x:480, y:line - 54,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})

    page.drawLine({start: { x: 485, y: 625}, end: { x: 485, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // grade
    //page.drawText('GRADE', {x:490, y:line - 50,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})

    //page.drawLine({start: { x: 510, y: 625}, end: { x: 510, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // remark
    page.drawText('REMARK', {x:505, y:line - 40,size:10, font:helveticaFont})
    
    var x = 75 + plus
    for(var s = 0; s < info.length; s++){
        x = (s * per_score) + 75 + plus
        var data = info[s]
        page.drawText(''+data.abbr, {x:12, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        if(b_f == 'Yes'){
            if(school_term == 'Third Term'){
                page.drawText(checkData(data.first), {x:119, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont}) // first term only
                page.drawText(checkData(data.second), {x:146, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont}) // second term only
           }
            else{
                page.drawText(checkData(data.first), {x:146, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
                
            }
        }


        page.drawText(checkData(data.total_score_term), {x:350, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(checkData(data.total_score), {x:390, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(checkData(data.percentage), {x:422, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(data.position, {x:460, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        //page.drawText(data.grade, {x:482, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(''+data.rating, {x:500, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawLine({start: { x: 10, y: line - x}, end: { x: 580, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    }

    page.drawLine({start: { x: 10, y: 560}, end: { x:10, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    

    if(b_f == 'Yes'){
        if(school_term == 'Third Term'){
            page.drawLine({start: { x: 115, y: 560}, end: { x: 115, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //third term 
            page.drawLine({start: { x: 142, y: 560}, end: { x: 142, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // second term only
        }
        if(school_term == 'Second Term'){
            page.drawLine({start: { x: 142, y: 560}, end: { x: 142, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // second term only
        }
    }

    page.drawLine({start: { x: 330, y: 560}, end: { x: 330, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // total score
    page.drawLine({start: { x: 167, y: 560}, end: { x: 167, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 380, y: 560}, end: { x: 380, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // total score
    page.drawLine({start: { x: 415, y: 560}, end: { x: 415, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //percentage
    page.drawLine({start: { x: 450, y: 560}, end: { x: 450, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //position in subject
    page.drawLine({start: { x: 485, y: 560}, end: { x: 485, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // grade
    //page.drawLine({start: { x: 510, y: 560}, end: { x: 510, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // remark
    page.drawLine({start: { x: 580, y: 560}, end: { x: 580, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // END LINE
        
    for(var to = 0; to < close_score.length; to++){
        page.drawLine({start: { x: close_score[to], y: 560}, end: { x: close_score[to], y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    }
    
    
    
    return line - (x + 40)
}

async function createStudentSecondaryAssentment(pdfDoc, page, info, school_term, b_f, abbr) {
    //console.log(info)
    //console.log(abbr)
    //page.drawLine({start: { x: 10, y: 640}, end: { x: 570, y: 640 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    var line = 625
    var t = 65
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaObliqueFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    const helveticaObliqueBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBoldOblique)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)
    if(info.length > 10){
        var per_score = 13
        var fonts = 7
        var plus = 5
    }
    else{
        var per_score = 18
        var fonts = 8
        var plus = 7
    }
    //subject and b /f drawing
    page.drawRectangle({x: 10,y: 560,width: 570,height: 65,borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    if(b_f == 'Yes'){
        if(school_term == 'Third Term'){
            page.drawText('1ST', {x:109, y:line - 45,size:7, font:helveticaFont})
            page.drawText('TERM', {x:107, y:line - 55,size:7, font:helveticaFont})
            page.drawLine({start: { x: 105, y: 625}, end: { x: 105, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //third term 
            page.drawText('2ND', {x:136, y:line - 45,size:7, font:helveticaFont})
            page.drawText('TERM', {x:134, y:line - 55,size:7, font:helveticaFont})
            page.drawLine({start: { x: 132, y: 625}, end: { x: 132, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // second term only
       }
       if(school_term == 'Second Term'){
            page.drawText('1ST', {x:136, y:line - 40,size:7, font:helveticaFont})
            page.drawText('TERM', {x:134, y:line - 55,size:7, font:helveticaFont})
            page.drawLine({start: { x: 132, y: 625}, end: { x: 132, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // second term only
        }
    }
    page.drawLine({start: { x: 157, y: 625}, end: { x: 157, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawText('SUBJECTS', {x:35, y:line - 40,size:10, font:helveticaFont})
    
    

    var result_width = 163
    var score_block = result_width / (abbr.length)
    var close_score = []
    var s_dist = {}
    for(var r = 0; r < abbr.length; r++){
        var total_character = abbr[r].abbr.length
        
        var point_char = abbr[r].point.length            
        var p = (r * score_block) + 157
        close_score.push(p)
        var l = getStartCharacter(p, 3, score_block, total_character) - 2
        var point_l = getStartCharacter(p, 3, score_block, point_char) - 2
        s_dist[abbr[r].abbr] = point_l
        page.drawLine({start: { x: p, y: 625 }, end: { x: p, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
        page.drawText(abbr[r].abbr, {x:l, y:line - 40,size:8, font:helveticaFont})
        page.drawText(abbr[r].point, {x:point_l, y:line - 55,size:8, font:helveticaFont})
        
    }


    var x = 75 + plus
    for(var s = 0; s < info.length; s++){
        x = (s * per_score) + 75 + plus
        try{
            var mark = JSON.parse(info[s].mark)
            for(var v = 0; v < mark.length; v++){
                var ab = mark[v].abbr
                var poi = s_dist[ab]
                page.drawText(''+mark[v].value, {x:poi, y:line - x + plus, size:fonts, font:helveticaObliqueBoldFont})
                //
            }
        }
        catch(err){
            //console.log(err)
        }
        
    }


    page.drawLine({start: { x: 320, y: 625}, end: { x: 320, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // total score
    page.drawText('TOTAL', {x:330, y:line - 30,size:10, font:helveticaFont})
    page.drawText('SCORE', {x:328, y:line - 40,size:10, font:helveticaFont})
    page.drawText('FOR THE', {x:324, y:line - 50,size:10, font:helveticaFont})
    page.drawText('TERM', {x:330, y:line - 60,size:10, font:helveticaFont})


    page.drawLine({start: { x: 370, y: 625}, end: { x: 370, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // total score
    page.drawText('TOTAL', {x:382, y:line - 50,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})
    page.drawText('SCORE', {x:395, y:line - 52,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})

    page.drawLine({start: { x: 405, y: 625}, end: { x: 405, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //percentage
    page.drawText('Percentage', {x:424, y:line - 57,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})

    page.drawLine({start: { x: 440, y: 625}, end: { x: 440, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //position in subject
    page.drawText('Position', {x:450, y:line - 54,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})
    page.drawText('in', {x:460, y:line - 45,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})
    page.drawText('Subject', {x:470, y:line - 54,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})

    page.drawLine({start: { x: 475, y: 625}, end: { x: 475, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // grade
    page.drawText('GRADE', {x:490, y:line - 50,size:10, font:helveticaFont, rotate: PDFLib.degrees(90),})

    page.drawLine({start: { x: 510, y: 625}, end: { x: 510, y: 560 },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // remark
    page.drawText('REMARK', {x:515, y:line - 40,size:10, font:helveticaFont})
    
    var x = 75 + plus
    for(var s = 0; s < info.length; s++){
        x = (s * per_score) + 75 + plus
        var data = info[s]
        page.drawText(''+data.abbr, {x:12, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        if(b_f == 'Yes'){
            if(school_term == 'Third Term'){
                page.drawText(checkData(data.first), {x:109, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont}) // first term only
                page.drawText(checkData(data.second), {x:136, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont}) // second term only
            }
           if(school_term == 'Second Term'){
                page.drawText(checkData(data.first), {x:136, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
                
            }
        }

        page.drawText(checkData(data.total_score_term), {x:350, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(checkData(data.total_score), {x:380, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(checkData(data.percentage), {x:412, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(data.position, {x:450, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(data.grade, {x:482, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawText(''+data.rating, {x:512, y:line - x + plus,size:fonts, font:helveticaObliqueBoldFont})
        page.drawLine({start: { x: 10, y: line - x}, end: { x: 580, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    }

    page.drawLine({start: { x: 10, y: 560}, end: { x:10, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    

    if(b_f == 'Yes'){
        if(school_term == 'Third Term'){
            page.drawLine({start: { x: 105, y: 560}, end: { x: 105, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //third term 
            page.drawLine({start: { x: 132, y: 560}, end: { x: 132, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // second term only
       }
        else{
            page.drawLine({start: { x: 132, y: 560}, end: { x: 132, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // second term only
        }
    }

    page.drawLine({start: { x: 320, y: 560}, end: { x: 320, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // total score
    page.drawLine({start: { x: 157, y: 560}, end: { x: 157, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 370, y: 560}, end: { x: 370, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // total score
    page.drawLine({start: { x: 405, y: 560}, end: { x: 405, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //percentage
    page.drawLine({start: { x: 440, y: 560}, end: { x: 440, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) //position in subject
    page.drawLine({start: { x: 475, y: 560}, end: { x: 475, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // grade
    page.drawLine({start: { x: 510, y: 560}, end: { x: 510, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // remark
    page.drawLine({start: { x: 580, y: 560}, end: { x: 580, y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)}) // END LINE
        
    for(var to = 0; to < close_score.length; to++){
        page.drawLine({start: { x: close_score[to], y: 560}, end: { x: close_score[to], y: line - x },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    }
    
    
    
    return line - (x + 40)
}

async function createMarkAbbr(pdfDoc,page, info, line) {
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    page.drawRectangle({x: 10,y: line,width: 570,height: 24, borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    page.drawLine({start: { x: 10, y: line + 12 }, end: { x: 580, y: line + 12 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawText('MARK DISTRIBUTION ABBREVIATION', {x:222, y:line + 14,size:9, font:helveticaBoldFont})
    var arr_len = info.length
    var total_character = 0
    for(var i = 0; i < arr_len; i++){
        total_character += info[i].name.length + info[i].abbr.length + 2
    }

    
    //page.drawText(total_character_text, {x:14, y:line + 2, size:9, font:helveticaBoldFont})
    
    var space = getSpace(570, 3, total_character, arr_len)
    var sp = 10
    for(var i = 0; i < arr_len; i++){
        
        if(i == 0){
            var text_width = ((info[i].name.length + info[i].abbr.length + 2) * 3) + space
            var end_text = text_width
            var char = info[i].name.length + info[i].abbr.length
            var l = getStartCharacter(sp, 3, text_width, char) - 16
            page.drawText(info[i].abbr+' : '+info[i].name, {x:l, y:line + 3, size:6, font:helveticaBoldFont})
            page.drawLine({start: { x: end_text, y: line + 12 }, end: { x: end_text, y: line },color: PDFLib.rgb(0.0, 0.0, 0.8)})
        }
        else{

            sp += ((info[i - 1].name.length + info[i - 1].abbr.length + 2) * 3) + space
            var text_width = ((info[i].name.length + info[i].abbr.length + 2) * 3) + space
            var end_text = sp + text_width
            var char = info[i].name.length + info[i].abbr.length
            var l = getStartCharacter(sp, 3, text_width, char) - 14
            page.drawText(info[i].abbr+' : '+info[i].name, {x:l, y:line + 3, size:6, font:helveticaBoldFont})
            if(i != arr_len - 1){
            page.drawLine({start: { x: end_text, y: line + 12 }, end: { x: end_text, y: line },color: PDFLib.rgb(0.0, 0.0, 0.8)})
            }
        }
    }
    //console.log(space)
    return line - 28
}

async function createRating(pdfDoc,page, info, line) {
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    page.drawRectangle({x: 10,y: line,width: 570,height: 24, borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    page.drawLine({start: { x: 10, y: line + 12 }, end: { x: 580, y: line + 12 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawText('KEY TO RATING', {x:252, y:line + 14,size:9, font:helveticaBoldFont})
    var arr_len = info.length
    var total_character = 0
    for(var i = 0; i < arr_len; i++){
        total_character += info[i].length + 2
    }
    //console.log(total_character)
    
    var space = getSpace(570, 3, total_character, arr_len)
    
    var sp = 10
    for(var i = 0; i < arr_len; i++){
        if(i == 0){
            var chars = info[i]
            var text_width = ((chars.length + 2) * 3) + space
            var end_text = text_width
            var char = chars.length
            var l = getStartCharacter(sp, 3, text_width, char) - 10
            page.drawText(info[i], {x:l, y:line + 3, size:7, font:helveticaBoldFont})
            page.drawLine({start: { x: end_text, y: line + 12 }, end: { x: end_text, y: line },color: PDFLib.rgb(0.0, 0.0, 0.8)})
        }
        else{

            sp += ((info[i - 1].length + 2) * 3) + space
            var text_width = ((info[i].length + 2) * 3) + space
            var end_text = sp + text_width
            var char = info[i].length
            var l = getStartCharacter(sp, 3, text_width, char) - 10
            page.drawText(info[i], {x:l, y:line + 3, size:7, font:helveticaBoldFont})
            if(i != arr_len - 1){
                page.drawLine({start: { x: end_text, y: line + 12 }, end: { x: end_text, y: line },color: PDFLib.rgb(0.0, 0.0, 0.8)})
                }
        }
    }
    return line
}

async function createBehaviouralSkill(pdfDoc,page, info, line) {
    //c.rect(10, new_d - 84, 560, 84)
    //console.log(info)
    line = line - 4
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    const helveticaBoldObliqueFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBoldOblique)
    page.drawRectangle({x: 10,y: line - 84, width: 570,height: 84, borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1})

    for(var s = 0; s < 7; s++){
        page.drawLine({start: { x: 10, y: line - (12 * s)}, end: { x: 580, y: line - (12 * s) },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    }
    page.drawText('ASSESSMENT OF BEHAVIOURAL SKILLS', {x:200, y:line - 12,size:9, font:helveticaBoldFont})
    page.drawText('PERSONAL', {x:15, y:line - 22,size:12, font:helveticaBoldObliqueFont})
    page.drawText('OBEDIENCE', {x:15, y:line - 34,size:9, font:helveticaBoldFont})
    page.drawText('HONESTY', {x:15, y:line - 46,size:9, font:helveticaBoldFont})
    page.drawText('SELF CONTROL', {x:15, y:line - 58,size:9, font:helveticaBoldFont})
    page.drawText('SELF RELIANCE', {x:15, y:line - 70,size:9, font:helveticaBoldFont})
    page.drawText('INITIATIVE', {x:15, y:line - 83,size:9, font:helveticaBoldFont})

    page.drawText(info.obedience, {x:125, y:line - 34,size:12, font:helveticaBoldFont})
    page.drawText(info.honesty, {x:125, y:line - 46,size:12, font:helveticaBoldFont})
    page.drawText(info.self_control, {x:125, y:line - 58,size:12, font:helveticaBoldFont})
    page.drawText(info.self_reliance, {x:125, y:line - 70,size:12, font:helveticaBoldFont})
    page.drawText(info.initiative, {x:125, y:line - 83,size:12, font:helveticaBoldFont})
    page.drawLine({start: { x: 120, y: line - 12 }, end: { x: 120, y: line - 84 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 140, y: line - 12}, end: { x: 140, y: line - 84 },color: PDFLib.rgb(0.0, 0.0, 0.8)})


    page.drawText('RESPONSIBILITY', {x:145, y:line - 22,size:12, font:helveticaBoldObliqueFont})
    page.drawText('PUNCTUALITY', {x:145, y:line - 34,size:9, font:helveticaBoldFont})
    page.drawText('NEATNESS', {x:145, y:line - 46,size:9, font:helveticaBoldFont})
    page.drawText('PERSEVERANCE', {x:145, y:line - 58,size:9, font:helveticaBoldFont})
    page.drawText('ATTENDANCE', {x:145, y:line - 70,size:9, font:helveticaBoldFont})
    page.drawText('ATTENTIVENESS', {x:145, y:line - 83,size:9, font:helveticaBoldFont})

    page.drawText(info.punctuality, {x:255, y:line - 34,size:12, font:helveticaBoldFont})
    page.drawText(info.neatness, {x:255, y:line - 46,size:12, font:helveticaBoldFont})
    page.drawText(info.perseverance, {x:255, y:line - 58,size:12, font:helveticaBoldFont})
    page.drawText(info.attendance, {x:255, y:line - 70,size:12, font:helveticaBoldFont})
    page.drawText(info.attentiveness, {x:255, y:line - 83,size:12, font:helveticaBoldFont})

    page.drawLine({start: { x: 250, y: line - 12 }, end: { x: 250, y: line - 84 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 270, y: line - 12}, end: { x: 270, y: line - 84 },color: PDFLib.rgb(0.0, 0.0, 0.8)})


    page.drawText('SOCIAL DEVELOPMENT', {x:272, y:line - 22,size:12, font:helveticaBoldObliqueFont})
    page.drawText('POLITENESS', {x:275, y:line - 34,size:9, font:helveticaBoldFont})
    page.drawText('CONSIDERATION', {x:275, y:line - 46,size:9, font:helveticaBoldFont})
    page.drawText('SOCIABILITY', {x:275, y:line - 58,size:9, font:helveticaBoldFont})
    page.drawText('PROMPTNESS', {x:275, y:line - 70,size:9, font:helveticaBoldFont})
    page.drawText('SENSE OF VALUE', {x:275, y:line - 83,size:9, font:helveticaBoldFont})

    page.drawText(info.politeness, {x:425, y:line - 34,size:12, font:helveticaBoldFont})
    page.drawText(info.consideration, {x:425, y:line - 46,size:12, font:helveticaBoldFont})
    page.drawText(info.sociability, {x:425, y:line - 58,size:12, font:helveticaBoldFont})
    page.drawText(info.promptness, {x:425, y:line - 70,size:12, font:helveticaBoldFont})
    page.drawText(info.sense_value, {x:425, y:line - 83,size:12, font:helveticaBoldFont})

    page.drawLine({start: { x: 420, y: line - 12 }, end: { x: 420, y: line - 84 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 440, y: line - 12}, end: { x: 440, y: line - 84 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('PSYCHOMOTOR', {x:445, y:line - 22,size:12, font:helveticaBoldObliqueFont})
    page.drawText('HAND WRITING', {x:445, y:line - 34,size:9, font:helveticaBoldFont})
    page.drawText('COMMUNICATION', {x:445, y:line - 46,size:9, font:helveticaBoldFont})
    page.drawText('SPORTS & GAMES', {x:445, y:line - 58,size:9, font:helveticaBoldFont})
    page.drawText('MANUAL SKILLS', {x:445, y:line - 70,size:9, font:helveticaBoldFont})
    page.drawText('DEXTERITY', {x:445, y:line - 83,size:9, font:helveticaBoldFont})

    page.drawText(info.handwriting, {x:560, y:line - 34,size:12, font:helveticaBoldFont})
    page.drawText(info.communication, {x:560, y:line - 46,size:12, font:helveticaBoldFont})
    page.drawText(info.sports, {x:560, y:line - 58,size:12, font:helveticaBoldFont})
    page.drawText(info.skill, {x:560, y:line - 70,size:12, font:helveticaBoldFont})
    page.drawText(info.dexterity, {x:560, y:line - 83,size:12, font:helveticaBoldFont})

    page.drawLine({start: { x: 555, y: line - 12 }, end: { x: 555, y: line - 84 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    
    return line - 88
}

async function createKeyBehaviouralSkill(pdfDoc,page, info, line) {
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    const helveticaBoldObliqueFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBoldOblique)
    page.drawRectangle({x: 10,y: line - 24, width: 570,height: 24, borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1})
    page.drawLine({start: { x: 10, y: line - 12 }, end: { x: 580, y: line - 12},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawText('KEY TO ASSESSMENT OF BEHAVIOR SKILLS', {x:200, y:line - 10,size:9, font:helveticaBoldFont})

    page.drawText('EXCELLENT[A](5)', {x:15, y:line - 21,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 110, y: line - 12}, end: { x: 110, y: line - 24},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('HIGH LEVEL[B](4)', {x:120, y:line - 21,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 220, y: line - 12}, end: { x: 220, y: line - 24},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('ACCEPTANCE LEVEL[C](3)', {x:230, y:line - 21,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 360, y: line - 12}, end: { x: 360, y: line - 24},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('MINIMAL LEVEL [D](1)', {x:370, y:line - 21,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 470, y: line - 12}, end: { x: 470, y: line - 24},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('NO TRIAL [E](0)', {x:480, y:line - 21,size:9, font:helveticaBoldFont})
    
    return line - 28
}

async function createSport(pdfDoc,page, info, line) {
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    const helveticaBoldObliqueFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBoldOblique)
    page.drawRectangle({x: 10,y: line - 36, width: 570,height: 36, borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1})
    page.drawLine({start: { x: 10, y: line - 12 }, end: { x: 580, y: line - 12},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 10, y: line - 24}, end: { x: 580, y: line - 24},color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 95, y: line - 12}, end: { x: 95, y: line - 36},color: PDFLib.rgb(0.0, 0.0, 0.8)})


    
    page.drawText('SPORT', {x:270, y:line - 10,size:9, font:helveticaBoldFont})
    page.drawText('EVENT', {x:13, y:line - 22,size:9, font:helveticaBoldFont})
    page.drawText('LEVEL ATTAINED', {x:13, y:line - 33,size:9, font:helveticaBoldFont})

    page.drawText('INDOOR GAMES', {x:100, y:line - 22,size:7, font:helveticaBoldFont})
    page.drawText(info.indoor, {x:130, y:line - 33,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 165, y: line - 12}, end: { x: 165, y: line - 36},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('BALL GAMES', {x:170, y:line - 22,size:7, font:helveticaBoldFont})
    page.drawText(info.ball, {x:190, y:line - 33,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 225, y: line - 12}, end: { x: 225, y: line - 36},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('COMBATIVE GAMES', {x:230, y:line - 22,size:7, font:helveticaBoldFont})
    page.drawText(info.combative, {x:260, y:line - 33,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 305, y: line - 12}, end: { x: 305, y: line - 36},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('TRACKS', {x:310, y:line - 22,size:7, font:helveticaBoldFont})
    page.drawText(info.tracks, {x:330, y:line - 33,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 345, y: line - 12}, end: { x: 345, y: line - 36},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('JUMPS', {x:350, y:line - 22,size:7, font:helveticaBoldFont})
    page.drawText(info.jumps, {x:370, y:line - 33,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 395, y: line - 12}, end: { x: 395, y: line - 36},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('THROWS', {x:400, y:line - 22,size:7, font:helveticaBoldFont})
    page.drawText(info.throws, {x:415, y:line - 33,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 445, y: line - 12}, end: { x: 445, y: line - 36},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('SWIMMING', {x:450, y:line - 22,size:7, font:helveticaBoldFont})
    page.drawText(info.swimming, {x:465, y:line - 33,size:9, font:helveticaBoldFont})
    page.drawLine({start: { x: 495, y: line - 12}, end: { x: 495, y: line - 36},color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('WEIGHT LIFTING', {x:500, y:line - 22,size:7, font:helveticaBoldFont})
    page.drawText(info.weight, {x:525, y:line - 33,size:9, font:helveticaBoldFont})
    
    return line - 40
    
}


async function createComment(pdfDoc,page, info, line, category) {
    
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    page.drawText('Class Teacher\'s Comment:  ', {x:10, y:line - 20,size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
    //page.drawText(''+info.generate_date, {x:475, y:10,size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.0),})
    var teacher = info.teacher_comment
    var checker = false
    //console.log(teacher)
    teacher = teacher.replace(/([\w\s]{73,}?)\s?\b/g, "$1[]")
    var com = teacher.split("[]")
    var first = [com[0]]
    var rest = []
    for(var s = 1; s < com.length; s++){
        rest.push(com[s])
    }
    rest = rest.join(" ")
    rest = rest.replace(/([\w\s]{100,}?)\s?\b/g, "$1[]")
    var com = rest.split("[]")
    first = first.concat(com)
    //console.log(first)
    var begin = line - 20
    if(first[0].length == 0){
        page.drawText('.........................................................................................................................................................................................', {x:160, y:begin - 4,size:8,
            font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
    }
    for(var i = 0;  i < first.length; i++){
        if(first[i].length > 0){
            checker = true
            if(i == 0){
                page.drawText(first[i], {x:160, y:begin, size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.0),})
                page.drawText('.......................................................................................................................................................................................', {x:160, y:begin - 4,size:8,
            font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
            }
            else{
                page.drawText(first[i], {x:10, y:begin, size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.0),})
                page.drawText('...........................................................................................................................................................................................................................................................', {x:10, y:begin - 4,size:8,
            font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
            }
            begin -= 20
        }
    }
    

    //page.drawText(info.hm_comment, {x:240, y:line - 40,size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.0),})
    
    if(checker == false){
        begin = begin - 20
    }
    if(category == 'secondary'){
        page.drawText('Principal\'s Comment:  ', {x:10, y:begin,size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
    }
    else{
        var start = 240
        page.drawText('Headmaster\'s / Headmistress\'s Comment:  ', {x:10, y:begin,size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
    
    }
    var teacher = info.hm_comment
    //console.log(teacher)
    teacher = teacher.replace(/([\w\s]{53,}?)\s?\b/g, "$1[]")
    var com = teacher.split("[]")
    var first = [com[0]]
    var rest = []
    for(var s = 1; s < com.length; s++){
        rest.push(com[s])
    }
    rest = rest.join(" ")
    rest = rest.replace(/([\w\s]{100,}?)\s?\b/g, "$1[]")
    var com = rest.split("[]")
    first = first.concat(com)
    //console.log(first)
    if(first[0].length == 0){
        if(category == 'secondary'){
            page.drawText('...........................................................................................................................................................................................................', {x:130, y:begin - 4,size:8,
                font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
        }
        else{
            page.drawText('.....................................................................................................................................................', {x:240, y:begin - 4,size:8,
                font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})

        }
        
    }
    for(var i = 0;  i < first.length; i++){
        if(first[i].length > 0){
            if(i == 0){
                if(category == 'secondary'){
                    page.drawText(first[i], {x:130, y:begin, size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.0),})
                page.drawText('...........................................................................................................................................................................................................', {x:130, y:begin - 4,size:8,
            font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
                }
                else{
                    page.drawText(first[i], {x:240, y:begin, size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.0),})
                page.drawText('....................................................................................................................................................', {x:240, y:begin - 4,size:8,
            font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
                    
                }
                
            }
            else{
                page.drawText(first[i], {x:10, y:begin, size:12, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.0),})
                page.drawText('.........................................................................................................................................................................................................................................................', {x:10, y:begin - 4,size:8,
            font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
            }
            begin -= 20
        }
    }
    
    //page.drawText('................................................................................................................................................', {x:240, y:line - 44,size:8, font:helveticaFont, color: PDFLib.rgb(0.0, 0.0, 0.8),})
}



async function createAffectiveBehavioural(pdfDoc,page, info, line) {
    line = line - 4
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    console.log(info)
    //c.rect(10, new_d - 178, 270, 178)

    page.drawRectangle({x: 10,y: line - 180, width: 270,height: 180, borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    
    //page.drawLine({start: { x: 10, y: line + 12 }, end: { x: 580, y: line + 12 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('AFFECTIVE', {x:90, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('5', {x:184, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('4', {x:204, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('3', {x:224, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('2', {x:244, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('1', {x:264, y:line - 12,size:12, font:helveticaBoldFont})

    page.drawLine({start: { x: 180, y: line}, end: { x: 180, y: line - 180 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 200, y: line}, end: { x: 200, y: line - 180 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 220, y: line}, end: { x: 220, y: line - 180 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 240, y: line}, end: { x: 240, y: line - 180 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 260, y: line}, end: { x: 260, y: line - 180 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('Attentiveness', {x:15, y:line - 22,size:9, font:helveticaBoldFont})
    page.drawText('Attitude of School work', {x:15, y:line - 34,size:9, font:helveticaBoldFont})
    page.drawText('Cooperating with others', {x:15, y:line - 46,size:9, font:helveticaBoldFont})
    page.drawText('Emotion Stability', {x:15, y:line - 58,size:9, font:helveticaBoldFont})
    page.drawText('Health', {x:15, y:line - 70,size:9, font:helveticaBoldFont})
    page.drawText('Helping Others', {x:15, y:line - 82,size:9, font:helveticaBoldFont})
    page.drawText('Honesty', {x:15, y:line - 94,size:9, font:helveticaBoldFont})
    page.drawText('Leadership', {x:15, y:line - 106,size:9, font:helveticaBoldFont})
    page.drawText('Attendance', {x:15, y:line - 118,size:9, font:helveticaBoldFont})
    page.drawText('Neatness', {x:15, y:line - 130,size:9, font:helveticaBoldFont})
    page.drawText('Perseverance', {x:15, y:line - 142,size:9, font:helveticaBoldFont})
    page.drawText('Politeness', {x:15, y:line - 154,size:9, font:helveticaBoldFont})
    page.drawText('Punctuality', {x:15, y:line - 166,size:9, font:helveticaBoldFont})
    page.drawText('Speaking / Writing', {x:15, y:line - 178,size:9, font:helveticaBoldFont})



    page.drawText(behaviortext(info.attentiveness), {x:affectiveposition(info.attentiveness), y:line - 28,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.school_work), {x:affectiveposition(info.school_work), y:line - 38,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.cooperating), {x:affectiveposition(info.cooperating), y:line - 50,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.emotion), {x:affectiveposition(info.emotion), y:line - 62,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.health), {x:affectiveposition(info.health), y:line - 74,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.helping), {x:affectiveposition(info.helping), y:line - 86,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.honesty), {x:affectiveposition(info.honesty), y:line - 100,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.leadership), {x:affectiveposition(info.leadership), y:line - 110,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.attendance), {x:affectiveposition(info.attendance), y:line - 122,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.neatness), {x:affectiveposition(info.neatness), y:line - 134,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.perseverance), {x:affectiveposition(info.perseverance), y:line - 146,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.politeness), {x:affectiveposition(info.politeness), y:line - 158,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.punctuality), {x:affectiveposition(info.punctuality), y:line - 170,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.speaking_writing), {x:affectiveposition(info.speaking_writing), y:line - 182,size:16, font:helveticaFont})



    page.drawLine({start: { x: 10, y: line - 14}, end: { x: 280, y: line - 14 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    for(var s = 2; s < 15; s++){
        page.drawLine({start: { x: 10, y: line - (12 * s)}, end: { x: 280, y: line - (12 * s) },color: PDFLib.rgb(0.0, 0.0, 0.8)})
        
    }
    
    

    

    return line - 190
}

async function createPsychomotorskill(pdfDoc, page, info, line) {
    console.log(info)
    line = line - 4
    const helveticaBoldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold)
    const helveticaFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique)
    const helveticaNormalFont = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica)

    page.drawRectangle({x: 300,y: line - 96, width: 270,height: 96, borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    
    page.drawText('PSYCHOMOTOR SKILL', {x:330, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('5', {x:475, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('4', {x:495, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('3', {x:515, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('2', {x:535, y:line - 12,size:12, font:helveticaBoldFont})
    page.drawText('1', {x:555, y:line - 12,size:12, font:helveticaBoldFont})

    page.drawText('Drawing & Painting', {x:310, y:line - 22,size:9, font:helveticaBoldFont})
    page.drawText('Handling Tools', {x:310, y:line - 34,size:9, font:helveticaBoldFont})
    page.drawText('Games', {x:310, y:line - 46,size:9, font:helveticaBoldFont})
    page.drawText('Handwriting', {x:310, y:line - 58,size:9, font:helveticaBoldFont})
    page.drawText('Music', {x:310, y:line - 70,size:9, font:helveticaBoldFont})
    page.drawText('Sport', {x:310, y:line - 82,size:9, font:helveticaBoldFont})
    page.drawText('Verbal Fluency', {x:310, y:line - 94,size:9, font:helveticaBoldFont})

    page.drawText(behaviortext(info.drawing_painting), {x:psychomotorposition(info.drawing_painting), y:line - 28,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.handling_tools), {x:psychomotorposition(info.handling_tools), y:line - 38,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.games), {x:psychomotorposition(info.games), y:line - 50,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.handwriting), {x:psychomotorposition(info.handwriting), y:line - 62,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.music), {x:psychomotorposition(info.music), y:line - 74,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.sport), {x:psychomotorposition(info.sport), y:line - 86,size:16, font:helveticaFont})
    page.drawText(behaviortext(info.verbal_fluency), {x:psychomotorposition(info.verbal_fluency), y:line - 100,size:16, font:helveticaFont})
    
    page.drawLine({start: { x: 470, y: line}, end: { x: 470, y: line - 96 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 490, y: line}, end: { x: 490, y: line - 96 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 510, y: line}, end: { x: 510, y: line - 96 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 530, y: line}, end: { x: 530, y: line - 96 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    page.drawLine({start: { x: 550, y: line}, end: { x: 550, y: line - 96 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawLine({start: { x: 300, y: line - 14}, end: { x: 570, y: line - 14 },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    for(var s = 2; s < 8; s++){
        page.drawLine({start: { x: 300, y: line - (12 * s)}, end: { x: 570, y: line - (12 * s) },color: PDFLib.rgb(0.0, 0.0, 0.8)})
    }

    
    page.drawRectangle({x: 300,y: line - 178, width: 170,height: 74, borderColor: PDFLib.rgb(0.0, 0.0, 0.8),opacity:0.1,})
    page.drawText('Keys to Grade', {x:330, y:line - 115, size:10, font:helveticaBoldFont})
    page.drawLine({start: { x: 300, y: line - 118}, end: { x: 470, y: line - 118 },color: PDFLib.rgb(0.0, 0.0, 0.8)})

    page.drawText('5.  Excellent', {x:325, y:line - 128, size:8, font:helveticaNormalFont})
    page.drawText('4.  Good', {x:325, y:line - 140, size:8, font:helveticaNormalFont})
    page.drawText('3.  Fair', {x:325, y:line - 152, size:8, font:helveticaNormalFont})
    page.drawText('2.  Poor', {x:325, y:line - 164, size:8, font:helveticaNormalFont})
    page.drawText('1.  Very Poor', {x:325, y:line - 176, size:8, font:helveticaNormalFont})
    
   
    
}

async function createKeyGrade(pdfDoc,page, info, line) {
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


function behaviortext(score){
    try{
        if(isNaN(parseInt(score))){
            return ''
        }
        else{
            return '*'
        }
    }
    catch(err){
        return ''
    }

}
function affectiveposition(score){
    try{
        if(parseInt(score) == 5){
            return 184
        }
        else if(parseInt(score) == 4){
            return 204
        }
        else if(parseInt(score) == 3){
            return 224
        }
        else if(parseInt(score) == 2){
            return 244
        }
        else if(parseInt(score) == 1){
            return 264
        }
        else{
            return 0
        }
    }
    catch(err){
        return 0
    }
}


function psychomotorposition(score){
    try{
        if(parseInt(score) == 5){
            return 475
        }
        else if(parseInt(score) == 4){
            return 495
        }
        else if(parseInt(score) == 3){
            return 515
        }
        else if(parseInt(score) == 2){
            return 535
        }
        else if(parseInt(score) == 1){
            return 555
        }
        else{
            return 0
        }
    }
    catch(err){
        return 0
    }
}

function checkData(score){
    if(isNaN(parseFloat(score))){
        return ''
    }
    else{
        return ''+score
    }
}

