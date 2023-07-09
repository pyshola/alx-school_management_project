$(document).ready(function(){
	
	$(document).on('click', '.user-logout', function (event) {
		auth.deleteToken();
		window.location.reload()
	})
	
	

});