$(document).ready(function(){
    var token = auth.getToken();
    if(auth.isLoggedIn())
	{
	    var href = 'https://alxproject.virilesoftware.com/api/feeshomeanalysis';
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
			var home = '<div class="card card-dash-one mg-t-20">\
            <div class="row no-gutters">\
                <div class="col-lg-3 col-sm-6">\
                <div class="dash-content">\
                    <label class="tx-primary">Bill</label>\
                    <h2>'+new Number(datas.amount).toLocaleString('en')+'</h2>\
                </div><!-- dash-content -->\
                </div><!-- col-3 -->\
                <div class="col-lg-3 col-sm-6">\
                <div class="dash-content">\
                    <label class="tx-success">Payment</label>\
                    <h2>'+new Number(datas.payment).toLocaleString('en')+'</h2>\
                </div><!-- dash-content -->\
                </div><!-- col-3 -->\
                <div class="col-lg-3 col-sm-6">\
                <div class="dash-content">\
                    <label class="tx-danger">Pending</label>\
                    <h2>'+new Number(datas.balance).toLocaleString('en')+'</h2>\
                </div><!-- dash-content -->\
                </div><!-- col-3 -->\
                <div class="col-lg-3 col-sm-6">\
                <div class="dash-content">\
                    <label class="tx-purple">This Week Collection</label>\
                    <h2>'+new Number(datas.week_payment).toLocaleString('en')+'</h2>\
                </div><!-- dash-content -->\
                </div><!-- col-3 -->\
            </div><!-- row -->\
            </div><!-- card -->'
		
		$('#billpage').html(home)
            }
        })

        var href = 'https://alxproject.virilesoftware.com/api/studentsummary';
		$.ajax({
			type: 'GET',
			data: null,
			url: href,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(datas){
            var students = '<div class="card card-dash-one mg-t-20">\
            <div class="row no-gutters">\
                <div class="col-lg-3 col-sm-6">\
                <div class="dash-content">\
                    <label class="tx-primary">Total Student</label>\
                    <h2>'+new Number(datas.total).toLocaleString('en')+'</h2>\
                </div><!-- dash-content -->\
                </div><!-- col-3 -->\
                <div class="col-lg-3 col-sm-6">\
                <div class="dash-content">\
                    <label class="tx-success">Male</label>\
                    <h2>'+new Number(datas.male).toLocaleString('en')+'</h2>\
                </div><!-- dash-content -->\
                </div><!-- col-3 -->\
                <div class="col-lg-3 col-sm-6">\
                <div class="dash-content">\
                    <label class="tx-purple">Female</label>\
                    <h2>'+new Number(datas.female).toLocaleString('en')+'</h2>\
                </div><!-- dash-content -->\
                </div><!-- col-3 -->\
                <div class="col-lg-3 col-sm-6">\
                <div class="dash-content">\
                    <label class="tx-danger">Withdraw</label>\
                    <h2>'+new Number(datas.withdraw).toLocaleString('en')+'</h2>\
                </div><!-- dash-content -->\
                </div><!-- col-3 -->\
            </div><!-- row -->\
            </div><!-- card -->'
            $('#studentpage').html(students)
            var info = JSON.parse(datas.student)
            console.log(info)
            var htmls = ''
            for(let i = 0; i < info.length; i++)
            {
                var data = info[i]
                htmls += '<tr style="font-size:18px; font-weight:600">\
                    <th scope="row">'+data.sch_class+'</th>\
                    <td>'+new Number(data.total).toLocaleString('en')+'</td>\
                    <td>'+new Number(data.male).toLocaleString('en')+'</td>\
                    <td>'+new Number(data.female).toLocaleString('en')+'</td>\
                    <td>'+new Number(data.withdraw).toLocaleString('en')+'</td>\
                </tr>'
            }
            $('#class_summarypage').html(htmls)
        })

        
    }
	
})