/* Prepare our canvas area */
var RefSigContext = document.getElementById('RefSigCanvas').getContext("2d");
var TestSigContext = document.getElementById('TestSigCanvas').getContext("2d");
var context = null;
var RefSigCollection = new Array(); 
var validateArray = new Array();
var NormalizeBase = {};
var TestSigVector = {};

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
	var RefTemplateDistance;
	var RefTemplateIndex;
	//RefSigCanvas.width=RefSigCanvas.style.width;
	//TestSigCanvas.width=TestSigCanvas.style.width;
	//console.log(RefSigCanvas.style.width.toString());

	$("#Nextone").click(function(){
		if(RefSigContext.Sig){
		RefSigCollection.push(RefSigContext.Sig);
		clearpanel(context);
		RefSigContext.Sig=new signature();
		}

	});

	$("#RefSubmit").click(function(){
		RefSigCollection.push(RefSigContext.Sig);
		var username=$("#username").val();
		console.log(username);
		$.ajax({
			url: 'http://localhost:3000/api/user/'+username,
			type: 'POST',
			data: {username: username, data:RefSigCollection},
			success: function(data){
				console.log(data);
			}
		});
		var n= RefSigCollection.length;
		var distanceMin = new Array(n);
		var distanceMax = new Array(n);
		var distanceMinAverage = new Array(n);
		

		var i,j;
		for (i=0; i<n; i++){ 
			distanceMin[i]=0;
			distanceMax[i]=0;
		}
		for (i=0; i<n-1; i++){
			for(j=i+1 ; j<=n-1;j++){
				var distance = DTW(RefSigCollection[i],RefSigCollection[j]);
				console.log(distance);

				if(distance<distanceMin[i]||distanceMin[i]==0)
					distanceMin[i]=distance;
				if(distance<distanceMin[j]||distanceMin[j]==0)
					distanceMin[j]=distance;
				
				if(distance>distanceMax[i]||distanceMax[i]==0)
					distanceMax[i]=distance;
				if(distance>distanceMax[j]||distanceMax[j]==0)
					distanceMax[j]=distance;

				distanceMinAverage[i]+=distance;
				distanceMinAverage[j]+=distance;
				
			}
			
		}
				var distanceSumMin=0; distanceSumMax=0;
				for (i=0;i<n;i++){
					
					console.log(distanceMin[i],distanceMax[i]);
					distanceSumMin+=distanceMin[i];
					distanceSumMax+=distanceMax[i];

				}
				//console.log(distanceSumMin,distanceSumMax);
				NormalizeBase.distanceAverageMin= distanceSumMin / n;
				NormalizeBase.distanceAverageMax= distanceSumMax / n;



				RefTemplatePoint=distanceMinAverage[0];
				RefTemplateIndex=0;
				for (i=1; i<n;i++){
					if(distanceMinAverage[i]<RefTemplatePoint){
						RefTemplatePoint=distanceMinAverage;
						RefTemplateIndex=i;	
					}
				}
				var distanceSumMinAverage=0;
				for (i=0;i<n;i++){
					
					distanceSumMinAverage+=DTW(RefSigCollection[i],RefSigCollection[RefTemplateIndex]);

				}
				NormalizeBase.distanceAverage_AverageMin= distanceSumMinAverage / (n-1);

				console.log(NormalizeBase);

		//for (i=0; i<n; i++) console.log(distanceMin[i]);
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
	$('#validate').click(function() {
		//var distanceCount = DTW(RefSigContext.Sig, TestSigContext.Sig);
		//var TestdistanceMin,TestdistanceMax,TestdistanceTemplate;
		var i,n;
		n=RefSigCollection.length;
		TestSigVector.distanceTemplate= DTW(RefSigCollection[RefTemplateIndex],TestSigContext.Sig);
		TestSigVector.distanceMin=0;
		TestSigVector.distanceMax=0;
		for (i=0; i<n; i++){
			var temp = DTW(RefSigCollection[i],TestSigContext.Sig);
			if (temp<TestSigVector.distanceMin || TestSigVector.distanceMin==0) 
				TestSigVector.distanceMin=temp;
			if (temp>TestSigVector.distanceMax || TestSigVector.distanceMin==0)
				TestSigVector.distanceMax=temp;
		}
		console.log(TestSigVector);
		console.log("similarity rate is:");
		console.log(TestSigVector.distanceMin/NormalizeBase.distanceAverageMin,TestSigVector.distanceMax/NormalizeBase.distanceAverageMax,TestSigVector.distanceTemplate/NormalizeBase.distanceAverage_AverageMin);




		/*var l= validateArray.length;
		var distanceCount=0;
		for (i=0; i<l; i++){
			distanceCount+=validateArray[i];
		}*/
		$('#similarity').html('similarity vector: ' + '[ Min:'+((TestSigVector.distanceMin/NormalizeBase.distanceAverageMin).toFixed(2)).toString()
			+' , '+'Max:'+((TestSigVector.distanceMax/NormalizeBase.distanceAverageMax).toFixed(2)).toString()+' , '
			+'Template:'+((TestSigVector.distanceTemplate/NormalizeBase.distanceAverage_AverageMin).toFixed(2)).toString()+']');

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
		//addClick(Math.floor(e.pageX - this.offsetLeft), Math.floor(e.pageY - this.offsetTop), false, context);
		//console.log(Math.floor(e.pageX - offset.left), Math.floor(e.pageY - offset.top));
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
			//addClick(Math.floor(e.pageX - this.offsetLeft), Math.floor(e.pageY - this.offsetTop), true, context);
			//console.log(Math.floor(e.pageX - offset.left), Math.floor(e.pageY - offset.top));
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


});
//DTW algorithm, return dissimilarity.
function DTW(refSig, testSig) {
	var m = refSig.TrackDeltaX.length;
	var n = testSig.TrackDeltaX.length;
	//console.log(m, n);
	var i, j, testloop;
	var distance, Mindistance;
	
		var DistanceMatrix = new Array();
		for (i = 0; i < m; i++) {
			DistanceMatrix[i] = new Array();
			for (j = 0; j < n; j++) {
				distance = (testSig.TrackDeltaX[j] - refSig.TrackDeltaX[i]) * (testSig.TrackDeltaX[j] - refSig.TrackDeltaX[i]) + (testSig.TrackDeltaY[j] - refSig.TrackDeltaY[i]) * (testSig.TrackDeltaY[j] - refSig.TrackDeltaY[i]);
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
	
	//console.log(DtwMatrix[m - 1][n - 1]);
	return DtwMatrix[m - 1][n - 1];

}


function clearpanel(context) {
	if(context){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	}
}


/* Record the click position */
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

/* Clear canvas and redraw signature path on the canvas */
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