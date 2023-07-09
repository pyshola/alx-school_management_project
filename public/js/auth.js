var auth = (function() {
ns=$.initNamespaceStorage('access-synatx-admin');
    var ls = ns.localStorage;
    this.saveToken = function (token){
      //var ls = $.localStorage;
     ls.set('access-syntax-token', token);
	},
    this.getToken = function (){
    
    var token = ls.get('access-syntax-token');
    return token;
	},
    this.deleteToken = function (){
    //var ls = $.localStorage;
    ls.remove('access-syntax-token');
    return false;
	},
    this.isLoggedIn  = function(){
      var token = this.getToken();
		
      if(token){
		  var payload= jwt_decode(token);
        //var payload = jwt_decode(token);

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    }
	
	
           
            
    
  
    return this;

})();