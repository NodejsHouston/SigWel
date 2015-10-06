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
				if(data.length){
					$('#showMessage').empty();
					data.forEach(function(error){
						showMessage('#showMessage',error.message,error.type? 'succes':'alert');
					});
				}
				if(typeof data.redirect=='string')
				window.location = data.redirect;
			}
			
			
		});
	});


});

function showMessage(element, message, type) {
	var alertMarkup = $('<div data-alert class="alert-box"><span></span><a href="#" class="close">&times;</a></div>');
	alertMarkup.addClass(type);
	alertMarkup.children("span").text(message);

	$(element).append(alertMarkup).foundation(
		"alert",
		undefined
	);
}