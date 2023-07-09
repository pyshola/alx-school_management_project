function getData(code, key, data){
	return data.filter(
		function(data){
			return data[key] === code
		}
	);
}

var info = [
				{'id': '1', 'parent': '#', 'data_attr':'root', 'text': 'Settings', state : { opened : true}},
				{'id': '11', 'parent': '1',  'data_attr':'root', 'text': 'Class Arms', state : { opened : true}},
				{'id': '111', 'parent': '11', 'data_attr':'children', 'text': 'Add Class Arms'},
				{'id': '112', 'parent': '11', 'data_attr':'children', 'text': 'Edit Class Arms'},
				{'id': '113', 'parent': '11', 'data_attr':'children', 'text': 'View Class Arms'},
				{'id': '114', 'parent': '11', 'data_attr':'children', 'text': 'Remove Class Arms'},
				
				{'id': '12', 'parent': '1',  'data_attr':'root', 'text': 'School Account', state : { opened : true}},
				{'id': '121', 'parent': '12', 'data_attr':'children', 'text': 'Add School Account'},
				{'id': '122', 'parent': '12', 'data_attr':'children', 'text': 'Edit School Account'},
				{'id': '123', 'parent': '12', 'data_attr':'children', 'text': 'View School Account'},
				{'id': '124', 'parent': '12', 'data_attr':'children', 'text': 'Remove School Account'},
				
				{'id': '13', 'parent': '1',  'data_attr':'root', 'text': 'Expenses Type', state : { opened : true}},
				{'id': '131', 'parent': '13', 'data_attr':'children', 'text': 'Add Expenses Type'},
				{'id': '132', 'parent': '13', 'data_attr':'children', 'text': 'Edit Expenses Type'},
				{'id': '133', 'parent': '13', 'data_attr':'children', 'text': 'View Expenses Type'},
				{'id': '134', 'parent': '13', 'data_attr':'children', 'text': 'Remove Expenses Type'},
				
				{'id': '14', 'parent': '1',  'data_attr':'root', 'text': 'Academic Session', state : { opened : true}},
				{'id': '141', 'parent': '14', 'data_attr':'children', 'text': 'Add Academic Session'},
				{'id': '142', 'parent': '14', 'data_attr':'children', 'text': 'Edit Academic Session'},
				{'id': '143', 'parent': '14', 'data_attr':'children', 'text': 'View Academic Session'},
				{'id': '144', 'parent': '14', 'data_attr':'children', 'text': 'Remove Academic Session'},
				
				{'id': '15', 'parent': '1',  'data_attr':'root', 'text': 'Subject', state : { opened : true}},
				{'id': '151', 'parent': '15', 'data_attr':'children', 'text': 'Add Subject'},
				{'id': '152', 'parent': '15', 'data_attr':'children', 'text': 'Edit Subject'},
				{'id': '153', 'parent': '15', 'data_attr':'children', 'text': 'View Subject'},
				{'id': '154', 'parent': '15', 'data_attr':'children', 'text': 'Remove Subject'},
				
				{'id': '16', 'parent': '1',  'data_attr':'children', 'text': 'Report Card and Grade', state : { opened : true}},
				{'id': '161', 'parent': '16', 'data_attr':'children', 'text': 'Add Report Card Setting'},
				{'id': '162', 'parent': '16', 'data_attr':'children', 'text': 'Update Report Card Setting'},
				//{'id': '163', 'parent': '16', 'data_attr':'children', 'text': 'View School Class'},
				{'id': '164', 'parent': '16', 'data_attr':'children', 'text': 'Delete Report Card Setting'},
				
				{'id': '17', 'parent': '1',  'data_attr':'root', 'text': 'School Class', state : { opened : true}},
				{'id': '171', 'parent': '17', 'data_attr':'children', 'text': 'Add School Class'},
				{'id': '172', 'parent': '17', 'data_attr':'children', 'text': 'Edit School Class'},
				{'id': '173', 'parent': '17', 'data_attr':'children', 'text': 'View School Class'},
				{'id': '174', 'parent': '17', 'data_attr':'children', 'text': 'Delete School Class'},
				
				{'id': '18', 'parent': '1',  'data_attr':'root', 'text': 'Fees Type', state : { opened : true}},
				{'id': '181', 'parent': '18', 'data_attr':'children', 'text': 'Add Fees Type'},
				{'id': '182', 'parent': '18', 'data_attr':'children', 'text': 'Edit Fees Type'},
				{'id': '183', 'parent': '18', 'data_attr':'children', 'text': 'View Fees Type'},
				{'id': '184', 'parent': '18', 'data_attr':'children', 'text': 'Delete Fees Type'},
				
				
				
				{'id': '2', 'parent': '#',  'data_attr':'root', 'text': 'Finance', state : { opened : true}},
				
				
				{'id': '21', 'parent': '2',  'data_attr':'root', 'text': 'Fees Management', state : { opened : true}},
				{'id': '211', 'parent': '21', 'data_attr':'children', 'text': 'View Fees Management'},
				{'id': '212', 'parent': '21', 'data_attr':'children', 'text': 'Add Bill to Student'},
				{'id': '213', 'parent': '21', 'data_attr':'children', 'text': 'Add Special Offer'},
				{'id': '214', 'parent': '21', 'data_attr':'children', 'text': 'View Bill'},
				{'id': '215', 'parent': '21', 'data_attr':'children', 'text': 'Edit Bill'},
				{'id': '216', 'parent': '21', 'data_attr':'children', 'text': 'Enter Student Payment'},
				{'id': '217', 'parent': '21', 'data_attr':'children', 'text': 'Payment History'},
				{'id': '218', 'parent': '21', 'data_attr':'children', 'text': 'Fees Reports'},
				{'id': '219', 'parent': '21', 'data_attr':'children', 'text': 'View Finance Report'},
				
				
				{'id': '22', 'parent': '2',  'data_attr':'root', 'text': 'Fee Registrar', state : { opened : true}},
				{'id': '221', 'parent': '22', 'data_attr':'children', 'text': 'Add Fees'},
				{'id': '222', 'parent': '22', 'data_attr':'children', 'text': 'Edit Fees'},
				{'id': '223', 'parent': '22', 'data_attr':'children', 'text': 'View Fees'},
				{'id': '224', 'parent': '22', 'data_attr':'children', 'text': 'Remove Fees'},
				
				{'id': '23', 'parent': '2',  'data_attr':'root', 'text': 'Payment History', state : { opened : true}},
				
				
				{'id': '24', 'parent': '2',  'data_attr':'root', 'text': 'Expenses', state : { opened : true}},
				{'id': '241', 'parent': '24', 'data_attr':'children', 'text': 'Add Expenses'},
				//{'id': '242', 'parent': '24', 'data_attr':'children', 'text': 'Edit Expenses'},
				{'id': '243', 'parent': '24', 'data_attr':'children', 'text': 'View Expenses'},
				{'id': '244', 'parent': '24', 'data_attr':'children', 'text': 'Delete Expenses'},

				{'id': '25', 'parent': '2',  'data_attr':'root', 'text': 'Other Income', state : { opened : true}},
				{'id': '251', 'parent': '25', 'data_attr':'children', 'text': 'Add Other Income'},
				//{'id': '242', 'parent': '25', 'data_attr':'children', 'text': 'Edit Other Income'},
				{'id': '253', 'parent': '25', 'data_attr':'children', 'text': 'View Other Income'},
				{'id': '254', 'parent': '25', 'data_attr':'children', 'text': 'Delete Other Income'},
				
				
				{'id': '3', 'parent': '#', 'data_attr':'root', 'text': 'Student', state : { opened : true}},
				{'id': '31', 'parent': '3', 'data_attr':'children', 'text': 'Add Student'},
				{'id': '32', 'parent': '3', 'data_attr':'children', 'text': 'Edit Student'},
				{'id': '34', 'parent': '3', 'data_attr':'children', 'text': 'Remove Student'},
				{'id': '35', 'parent': '3', 'data_attr':'children', 'text': 'Edit Student Class'},
				{'id': '36', 'parent': '3', 'data_attr':'children', 'text': 'Edit Student Session'},
				{'id': '37', 'parent': '3', 'data_attr':'children', 'text': 'Allocate Subject to Student'},
				{'id': '38', 'parent': '3', 'data_attr':'children', 'text': 'Edit Student Subject'},
				
				
				{'id': '4', 'parent': '#', 'data_attr':'root', 'text': 'Teachers', state : { opened : true}},
				{'id': '5', 'parent': '#', 'data_attr':'root', 'text': 'Parents', state : { opened : true}},
				{'id': '6', 'parent': '#', 'data_attr':'root', 'text': 'Events', state : { opened : true}},
				{'id': '7', 'parent': '#', 'data_attr':'root', 'text': 'Academic', state : { opened : true}},
				{'id': '71', 'parent': '7', 'data_attr':'children', 'text': 'Promote Student'},
				{'id': '72', 'parent': '7', 'data_attr':'children', 'text': 'Enter Student Score'},
				{'id': '73', 'parent': '7', 'data_attr':'children', 'text': 'Edit Student Score'},
				{'id': '74', 'parent': '7', 'data_attr':'children', 'text': 'Remove Student'},

]

$(document).ready(function() {
	var token = auth.getToken()
	var roles = []
	var roles_check = []
	if(token == null)
	{
		window.location == 'https://alxproject.virilesoftware.com/'
	}
	else{
		
		//console.log(info.length)
		var tree_info = []
		var ref_id = $('head').attr('id')
		var token = auth.getToken();
		$.ajax({
			type: 'GET',
			data: null,
			url: 'https://alxproject.virilesoftware.com/api/staffrole/'+ref_id,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			//console.log()
			if(data.status == 'ok')
			{
				roles = JSON.parse(data.data)
				var length = info.length
				//console.log(roles)
				
				for(var i = 0; i < length; i++)
				{
					var tx = info[i].text
					const index = roles.indexOf(tx);
					if (index > -1) {
						var js = info[i]
						if(info[i].data_attr == 'root'){
							js.state = { opened : true, checked: false}
						}
						else{
							js.state = { opened : true, checked: true}
						}
						tree_info.push(js)
						roles_check.push(info[i].text)
					}
					else{
						var js = info[i]
						//console.log(js)
						if(info[i].data_attr == 'root'){
							js.state = { opened : true, checked: false}
						}
						else{
							js.state = { opened : true, checked: false}
						}
						tree_info.push(js)
					}
				}
				roles = roles_check
			}
			else
			{
				tree_info = info
			}
			$('#jstree').jstree({
				'plugins': [ 'checkbox', 'wholerow'],
				"checkbox": {
				  real_checkboxes: true,
				  real_checkboxes_names: function (n) {
					 var nid = 0;
					 $(n).each(function (data) {
						nid = $(this).attr("nodeid");
					 });
					 return (["check_" + nid, nid]);
				  },
				  two_state: true,
				  real_checkboxes: true,
					two_state: true,
					checked_parent_open: true,
					override_ui:true,
				  "keep_selected_style" : true,"tie_selection": false
			   },
			   "plugins": ["themes","json_data","ui","cookies","dnd","search","types","hotkeys","contextmenu","crrm", "checkbox"],
			//'checkbox': {"keep_selected_style" : false,"tie_selection": false},
			  'core': {
				'data': tree_info,
				'animation': true,
				//'expand_selected_onload': true,
				'themes': {
				  'icons': true,
				}
			  },
			 
			})
		})
			


	}
	
	$('#jstree').on('check_node.jstree', function (e, data) {
		//console.log(data)
		var select = data.node.children_d
		select.push(data.node.id)
		var dt = info
		//console.log(select)
		for(var s = 0; s < select.length; s++)
		{
			var filt = getData(select[s], 'id', dt)
			var tx = filt[0].text
			roles.push(tx)
		}
	})
	
	$('#jstree').on('uncheck_node.jstree', function (e, data) {
		//console.log('uncheck')
		//console.log(data)
		var new_roles = roles
		//console.log(new_roles.length)
		var select = data.node.children_d
		select.push(data.node.id)
		for(var s = 0; s < select.length; s++)
		{
			var dt = info
			var filt = getData(select[s], 'id', dt)
			//console.log(filt[0].text)
			var tx = filt[0].text
			var index = roles.indexOf(tx);
			if (index > -1) {
				new_roles.splice(index, 1);
			}
		}
		//console.log(new_roles.length)
		roles = new_roles
	})

	$(document).on('click', '#cancel_btn', function (event) {
		var token = auth.getToken();
		var payload = jwt_decode(token);
		window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/admin'	
	})
	$(document).on('click', '#submit_btn', function (event) {
		event.stopImmediatePropagation()
		event.stopPropagation()
		event.preventDefault()
		//console.log(roles)
		
		var ref_id = $('head').attr('id')
		var token = auth.getToken();
		$.ajax({
			type: 'PUT',
			data: {roles:JSON.stringify(roles)},
			url: 'https://alxproject.virilesoftware.com/api/staffrole/'+ref_id,
			dataType:'JSON',
			beforeSend : function(req) {
				req.setRequestHeader('Authorization', 'Bearer '+token);
			}
		}).done(function(data){
			if(data.status == 'ok')
			{
				alert('Staff roles and permission updated successful')
				var payload = jwt_decode(token);
				//window.location.reload()
				window.location = 'https://alxproject.virilesoftware.com/eportal/'+payload.username+'/admin'				
			}
			else
			{
				alert(data.message)
			}
			
		});
	})
	
})