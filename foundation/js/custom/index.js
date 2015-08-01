var RefSigContext = document.getElementById('RefSigCanvas').getContext("2d");
var TestSigContext = document.getElementById('TestSigCanvas').getContext("2d");
var context = null;
//var RefSigCollection = new Array(); 
//var validateArray = new Array();

function signature() {
	this.TrackX = new Array();
	this.TrackY = new Array();
	this.TrackDrag = new Array();
	this.TrackDeltaX = new Array();
	this.TrackDeltaY = new Array();
	this.OldX = -1;
	this.OldY = -1;
	this.xLength = 0;
	this.yLength = 0;
}



$(document).ready(function() {

	RefSigContext.Sig = new signature();
	TestSigContext.Sig = new signature();
	RefSigContext.paint = false;
	TestSigContext.paint = false;

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
	$('#validate').click(function() {
		var distanceCount = DTW(RefSigContext, TestSigContext);
		/*var l= validateArray.length;
		var distanceCount=0;
		for (i=0; i<l; i++){
			distanceCount+=validateArray[i];
		}*/
		$('#dissimilarity').html('dissimilarity: ' + distanceCount.toString());
	});

	$('canvas').mousedown(function(e) {
		var offset = $(this).offset();
		var context = null;
		var mouseX = e.pageX - offset.left;
		var mouseY = e.pageY - offset.top;
		if ($(e.target).attr("id") == 'RefSigCanvas') {
			context = RefSigContext;
		} else {
			context = TestSigContext;
		}

		context.paint = true;
		addClick(Math.floor(e.pageX - offset.left), Math.floor(e.pageY - offset.top), false, context);
		//console.log(Math.floor(e.pageX - offset.left), Math.floor(e.pageY - offset.top));
		redraw(context);
	});

	$('canvas').mousemove(function(e) {
		var offset = $(this).offset();
		if ($(e.target).attr("id") == 'RefSigCanvas') {
			context = RefSigContext;
		} else {
			context = TestSigContext;
		}

		if (context.paint) {
			addClick(Math.floor(e.pageX - offset.left), Math.floor(e.pageY - offset.top), true, context);
			//console.log(Math.floor(e.pageX - offset.left), Math.floor(e.pageY - offset.top));
			redraw(context);
		}
	});

	$('canvas').mouseup(function(e) {
		context.paint = false;
		


	});


	$('canvas').mouseleave(function(e) {
		context.paint = false;
	});


});
//DTW algorithm, return dissimilarity.
function DTW(ref, test) {
	var m = ref.Sig.TrackDeltaX.length;
	var n = test.Sig.TrackDeltaX.length;
	console.log(m, n);
	var i, j, testloop;
	var distance, Mindistance;
	
		var DistanceMatrix = new Array();
		for (i = 0; i < m; i++) {
			DistanceMatrix[i] = new Array();
			for (j = 0; j < n; j++) {
				distance = (test.Sig.TrackDeltaX[j] - ref.Sig.TrackDeltaX[i]) * (test.Sig.TrackDeltaX[j] - ref.Sig.TrackDeltaX[i]) + (test.Sig.TrackDeltaY[j] - ref.Sig.TrackDeltaY[i]) * (test.Sig.TrackDeltaY[j] - ref.Sig.TrackDeltaY[i]);
				//console.log(distance);
				DistanceMatrix[i].push(distance);
			}
		}
		var DtwMatrix = new Array();
		for (i = 0; i < m; i++) {
			DtwMatrix[i] = new Array();
			for (j = 0; j < n; j++) {
				if (i == 0 && j == 0)
					Mindistance = DistanceMatrix[0][0];
				else if (i == 0)
					Mindistance = DtwMatrix[i][j - 1] + DistanceMatrix[i][j];
				else if (j == 0)
					Mindistance = DtwMatrix[i - 1][j] + DistanceMatrix[i][j];
				else
					Mindistance = Math.min(DtwMatrix[i][j - 1], DtwMatrix[i - 1][j], DtwMatrix[i - 1][j - 1]) + DistanceMatrix[i][j];
				DtwMatrix[i].push(Mindistance);

			}
		}
	
	console.log(DtwMatrix[m - 1][n - 1]);
	return DtwMatrix[m - 1][n - 1];

}


function clearpanel(context) {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function addClick(x, y, dragging, context) {
	var sig = context.Sig;
	if (sig.OldX != -1) {
		if ((x - sig.OldX) != 0 || (y - sig.OldY) != 0) {
			sig.TrackDeltaX.push(x - sig.OldX);

			sig.TrackDeltaY.push(y - sig.OldY);
		}
		//console.log(x-sig.OldX, y - sig. OldY);
	}
	sig.TrackX.push(x);
	sig.TrackY.push(y);
	sig.OldX = x;
	sig.OldY = y;
	sig.TrackDrag.push(dragging);

}

function redraw(context) {

	clearpanel(context); // Clears the canvas
	var sig = context.Sig;
	context.strokeStyle = "#000";
	context.lineJoin = "round";
	context.lineWidth = 4;

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