var util = {}
// Calculate Normalization paremeters, including average values of:
// distances of reference signatures to their nearest neighbor
// distances of reference signatures to their farthest neighbor
// distances of reference signatures to the template signature

util.GetNormalize = function(array, fn) {
	var NormalizeBase = {};
	var n = array.length;
	var distanceMin = new Array(n);
	var distanceMax = new Array(n);
	var distanceMinAverage = new Array(n);

	//Calculate first two average values.
	var i, j;
	for (i = 0; i < n; i++) {
		distanceMin[i] = 0;
		distanceMax[i] = 0;
	}
	for (i = 0; i < n - 1; i++) {
		for (j = i + 1; j <= n - 1; j++) {
			var distance = fn(array[i], array[j]);
			//console.log(distance);

			if (distance < distanceMin[i] || distanceMin[i] == 0)
				distanceMin[i] = distance;
			if (distance < distanceMin[j] || distanceMin[j] == 0)
				distanceMin[j] = distance;

			if (distance > distanceMax[i] || distanceMax[i] == 0)
				distanceMax[i] = distance;
			if (distance > distanceMax[j] || distanceMax[j] == 0)
				distanceMax[j] = distance;

			distanceMinAverage[i] += distance;
			distanceMinAverage[j] += distance;

		}

	}
	var distanceSumMin = 0;
	distanceSumMax = 0;
	for (i = 0; i < n; i++) {

		//console.log(distanceMin[i], distanceMax[i]);
		distanceSumMin += distanceMin[i];
		distanceSumMax += distanceMax[i];

	}
	
	NormalizeBase.distanceAverageMin = distanceSumMin / n;
	NormalizeBase.distanceAverageMax = distanceSumMax / n;


	//select a reference signature with minimum average distance to all other
	//supplied signatures and designate it as template signature. 
	RefTemplatePoint = distanceMinAverage[0];
	RefTemplateIndex = 0;
	for (i = 1; i < n; i++) {
		if (distanceMinAverage[i] < RefTemplatePoint) {
			RefTemplatePoint = distanceMinAverage[i];
			RefTemplateIndex = i;
		}
	}
	var distanceSumMinAverage = 0;
	for (i = 0; i < n; i++) {

		distanceSumMinAverage += fn(array[i], array[RefTemplateIndex]);

	}
	//calculate average value of third Normaliztion paremeter 
	//and store the index of the template signature for further calculation.
	NormalizeBase.distanceAverage_AverageMin = distanceSumMinAverage / (n - 1);
	NormalizeBase.RefTemplateIndex = RefTemplateIndex;
	return NormalizeBase;
}

//Here test signature is compared to the signtures in the reference set,
//calculate the nearest distance and farest distance from test signature to rference set,
//and calculate the distance from test signature to template signature
util.OneToCollection = function(test, array, NormalizeBase, fn) {
	var i, n;
	var TestSigVector = {};
	var Similarity = {};
	n = array.length;
	TestSigVector.distanceTemplate = fn(array[NormalizeBase.RefTemplateIndex], test);
	TestSigVector.distanceMin = 0;
	TestSigVector.distanceMax = 0;
	for (i = 0; i < n; i++) {
		var temp = fn(array[i], test);
		if (temp < TestSigVector.distanceMin || TestSigVector.distanceMin == 0)
			TestSigVector.distanceMin = temp;
		if (temp > TestSigVector.distanceMax || TestSigVector.distanceMin == 0)
			TestSigVector.distanceMax = temp;
	}
	
	Similarity.Min = (TestSigVector.distanceMin / NormalizeBase.distanceAverageMin);
	Similarity.Max = (TestSigVector.distanceMax / NormalizeBase.distanceAverageMax);
	Similarity.Template = (TestSigVector.distanceTemplate / NormalizeBase.distanceAverage_AverageMin);
	return Similarity;
}

module.exports = util;