var serializeObject = function(dom){
	var o = {};
	    var a = dom.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value || '');
	        } else {
	            o[this.name] = this.value || '';
	        }
	    });
	    return o;
};


$(document).ready(function(){
	var form = $("#userInfo");
	form.submit(function(e){
		e.preventDefault();
		var data = serializeObject(form);
		console.log(data);
		$.ajax({
			url: '/register',
			type: 'POST',
			data: data,
			success:function(data){
				window.location = data.redirect;
			}
			
			
		});
	});


});