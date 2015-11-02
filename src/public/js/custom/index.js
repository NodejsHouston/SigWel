/* Prepare our canvas area */
var RefCanvas = $("#RefSigCanvas"),
	TestCanvas = $("#TestSigCanvas"),
	//GET this two canvas DOM object for canvas touch operation
	refcanvas = document.getElementById("RefSigCanvas"),
	testcanvas = document.getElementById("TestSigCanvas"),
	RefSigContext = $(RefCanvas).get(0).getContext("2d"),
	TestSigContext = $(TestCanvas).get(0).getContext("2d"),
	RefContainer = $(RefCanvas).parent(),
	TestContainer = $(TestCanvas).parent(),
	BigsigOutline = new Image(),
	SmallsigOutline = new Image(),
	context = null,
	RefSigCollection = new Array(),
	validateArray = new Array();

//var RefsigOutline = new Image();
//var TestsigOutline = new Image();

function signature() {
	this.TrackX = new Array();
	this.TrackY = new Array();
	this.TrackDrag = new Array();
	//this.TrackDeltaX = new Array();
	//this.TrackDeltaY = new Array();
	//this.OldX = -1;
	//this.OldY = -1;
	//this.xLength = 0;
	//this.yLength = 0;
}


BigsigOutline.onload = function() {
	if (RefSigContext.canvas.width > 520)
		RefSigContext.drawImage(BigsigOutline, RefSigContext.canvas.width * 0.1, RefSigContext.canvas.height * 0.4);
};

SmallsigOutline.onload = function() {
	if (RefSigContext.canvas.width <= 520)
		RefSigContext.drawImage(SmallsigOutline, RefSigContext.canvas.width * 0.1, RefSigContext.canvas.height * 0.55);

};
BigsigOutline.src = '/images/signature-big.jpg';
SmallsigOutline.src = '/images/signature-small.jpg';
$(document).ready(function() {
	
	var urlLink = "http://localhost:3000/api/users";
	$.ajax({
	  url: urlLink,
	  cache: false
	})
  .done(function( html ) {
  	console.log("hi")
    $( "#panel2-1" ).append( html );
  });



	$(window).resize(responsive);
	responsive();
	//redraw(RefSigContext);

	RefSigContext.Sig = new signature();
	TestSigContext.Sig = new signature();
	RefSigContext.paint = false;
	TestSigContext.paint = false;
	var RefTemplateDistance;
	var RefTemplateIndex;

	$("#Nextone").click(function() {
		if (RefSigContext.Sig) {
			RefSigCollection.push(RefSigContext.Sig);
			clearpanel(RefSigContext);
			RefSigContext.Sig = new signature();
		}

	});

	$("#RefSubmit").click(function() {
		RefSigCollection.push(RefSigContext.Sig);
		var username = $("#refuser").val();
		var email = $("#refemail").val();
		var host = $(location).attr('host');
		var protocol = $(location).attr('protocol');
		//submit user information and reference signature using post method
		//TODO, ip address should be setted in configration file
		$.ajax({
			url: protocol+'//'+host+'/api/user/ref/'+username,
			type: 'POST',
			data: {
				username: username,
				email: email,
				data: RefSigCollection
			},
			success: function(data) {
				var isSuccessful
				if (data.type)
					isSuccessful = 'success';
				else
					isSuccessful = 'alert';
				showMessage('#foundation-alerts1', data.message, isSuccessful);
				RefSigCollection = new Array();
				RefSigContext.Sig = new Array();
				clearpanel(RefSigContext);
			}
		});

	});

	$("#panel2-1").on("toggled", function() {
		console.log("tab1");
		responsive();
	});

	$("#panel2-2").on("toggled", function() {
		responsive();
		console.log("tab2");
	});

	$("#clearRef").click(function() {
		RefSigContext.Sig = null;
		RefSigContext.Sig = new signature();
		clearpanel(RefSigContext);
	});
	$("#clearTest").click(function() {
		TestSigContext.Sig = null;
		TestSigContext.Sig = new signature();
		clearpanel(TestSigContext);
	});

	/* Validate signature
	 * pass validation if the sum of the vectors are with in range of 1.5 to 6 
	 * or else fail. */
	$('#validate').click(function() {

		var username = $("#testuser").val();
		var email = $("#testemail").val();
		var host = $(location).attr('host');
		var protocol = $(location).attr('protocol');
		//Submit test signature of user to compare with reference signature stored in database
		//TODO, ip address should be setted in configration file
		$.ajax({
			url: protocol+'//'+host+'/api/user/test/'+ username,
			type: 'POST',
			data: {
				username: username,
				email: email,
				data: TestSigContext.Sig
			},
			success: function(data) {
				var isSuccessful;
				if (data.Similarity) {
					if (data.type) {
						isSuccessful = 'success';
						data.message = 'similarity vector: ' + '[ Min:' + data.Similarity.Min.toFixed(2) + ' , ' + 'Max:' + data.Similarity.Max.toFixed(2) + ' , ' + 'Template:' + data.Similarity.Template.toFixed(2) + ']' + '  You are accepted! Congratulations!';
					} else {
						isSuccessful = 'alert';
						data.message = 'similarity vector: ' + '[ Min:' + data.Similarity.Min.toFixed(2) + ' , ' + 'Max:' + data.Similarity.Max.toFixed(2) + ' , ' + 'Template:' + data.Similarity.Template.toFixed(2) + ']' + '  You are rejected! Please try again!';
					}
				} else if (data.type)
					isSuccessful = 'success';
				else
					isSuccessful = 'alert';
				showMessage('#foundation-alerts2', data.message, isSuccessful);

			}
		});



	});

	/* MOUSEDOWN: When the user clicks on canvas we record the position in an array via 
	 *  the addClick function. We set the boolean paint to true. 
	 *  Finally we update the canvas with the function redraw.*/
	$('canvas').mousedown(function(e) {
		var offset = $(this).offset();
		var context = null;
		//var mouseX = e.pageX - offset.left;
		//var mouseY = e.pageY - offset.top;
		if ($(e.target).attr("id") == 'RefSigCanvas') {
			context = RefSigContext;
		} else {
			context = TestSigContext;
		}

		context.paint = true;
		addClick(Math.floor(e.pageX - offset.left), Math.floor(e.pageY - offset.top), false, context);

		redraw(context);
	});

	/* MOUSEMOVE: Draw on the canvas when our user is pressing down.
	 *  If paint is true, then we record the value. Then redraw.*/
	$('canvas').mousemove(function(e) {
		var offset = $(this).offset();
		if ($(e.target).attr("id") == 'RefSigCanvas') {
			context = RefSigContext;
		} else {
			context = TestSigContext;
		}

		if (context.paint) {
			addClick(Math.floor(e.pageX - offset.left), Math.floor(e.pageY - offset.top), true, context);

			redraw(context);
		}
	});

	/* MOUSEUP: When the user lets go of the mouse button, set paint boolean to false.*/
	$('canvas').mouseup(function(e) {
		context.paint = false;
	});

	/* MOUSELEAVE: If the pointer goes off the canvas area, set paint boolean to false.*/
	$('canvas').mouseleave(function(e) {
		context.paint = false;
	});

	//Almost same operation transplanted from mouse operation to touch operation
	//For reference signature canvas
	refcanvas.addEventListener("touchstart", function(e) {
		e.preventDefault();
		var offset = $(this).offset();
		RefSigContext.paint = true;
		addClick(Math.floor(e.touches[0].pageX - offset.left), Math.floor(e.touches[0].pageY - offset.top), false, RefSigContext);
		redraw(RefSigContext);
	}, false);

	refcanvas.addEventListener("touchmove", function(e) {
		e.preventDefault();
		var offset = $(this).offset();
		if (RefSigContext.paint) {
			addClick(Math.floor(e.touches[0].pageX - offset.left), Math.floor(e.touches[0].pageY - offset.top), true, RefSigContext);
			redraw(RefSigContext);
		}
	}, false);

	refcanvas.addEventListener("touchend", function(e) {
		RefSigContext.paint = false;
	}, false);

	refcanvas.addEventListener("touchleave", function(e) {
		RefSigContext.paint = false;
	}, false);

	//For test signature canvas
	testcanvas.addEventListener("touchstart", function(e) {
		e.preventDefault();
		var offset = $(this).offset();
		TestSigContext.paint = true;
		addClick(Math.floor(e.touches[0].pageX - offset.left), Math.floor(e.touches[0].pageY - offset.top), false, TestSigContext);
		redraw(TestSigContext);
	}, false);

	testcanvas.addEventListener("touchmove", function(e) {
		e.preventDefault();
		var offset = $(this).offset();
		if (TestSigContext.paint) {
			addClick(Math.floor(e.touches[0].pageX - offset.left), Math.floor(e.touches[0].pageY - offset.top), true, TestSigContext);
			redraw(TestSigContext);
		}
	}, false);

	testcanvas.addEventListener("touchend", function(e) {
		TestSigContext.paint = false;
	}, false);

	testcanvas.addEventListener("touchleave", function(e) {
		TestSigContext.paint = false;
	}, false);

});



function clearpanel(context) {

	if (context) {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		if (context.canvas.width < 520)
			context.drawImage(SmallsigOutline, context.canvas.width * 0.10, context.canvas.height * 0.55);
		else
			context.drawImage(BigsigOutline, context.canvas.width * 0.10, context.canvas.height * 0.4);
	}

}


/* Record the click position */
function addClick(x, y, dragging, context) {
	var sig = context.Sig;
	sig.TrackX.push(x);
	sig.TrackY.push(y);

	sig.TrackDrag.push(dragging);

}

/* Clear canvas and redraw signature path on the canvas */
function redraw(context) {

	clearpanel(context); // Clears the canvas
	//context.drawImage(sigOutline, 0, 0);
	var sig = context.Sig;
	context.strokeStyle = "#000";
	context.lineJoin = "round";
	if (context.canvas.width > 520)
		context.lineWidth = 4;
	else
		context.lineWidth = 1;
	if (sig) {
		for (var i = 0; i < sig.TrackX.length; i++) {
			context.beginPath();
			if (sig.TrackDrag[i] && i) {
				context.moveTo(sig.TrackX[i - 1], sig.TrackY[i - 1]);
			} else {
				context.moveTo(sig.TrackX[i] - 1, sig.TrackY[i]);
			}
			context.lineTo(sig.TrackX[i], sig.TrackY[i]);
			context.closePath();
			context.stroke();
		}
	}

}

/* Display alert box with validation results */
function showMessage(element, message, type) {
	var alertMarkup = $('<div data-alert class="alert-box"><span></span><a href="#" class="close">&times;</a></div>');
	alertMarkup.addClass(type);
	alertMarkup.children("span").text(message);

	$(element).empty().prepend(alertMarkup).foundation(
		"alert",
		undefined
	);
}

//regulate canvas width when browser size change.
function responsive() {
	RefCanvas.attr('width', $(RefContainer).width());
	TestCanvas.attr('width', $(TestContainer).width());
	redraw(TestSigContext);
	redraw(RefSigContext);

}