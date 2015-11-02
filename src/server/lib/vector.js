function vector(data){
	//TODO
	if(data){
	this.vectorArray=data;
	this.err=null;
	return this;
	}
	else return false;
}
//remove consecutive points with the same value

vector.prototype.Deduplication = function(){
        if(this.err)
        	return this;
        var err,i,j;
        var rawdata = this.vectorArray;
        var newData = new Array();
        if (Array.isArray(rawdata)){
            var N = rawdata.length;
            for(i=0;i<N;i++){ 
                if(Array.isArray(rawdata[i])){
                newData.push(new Array());
                }
                
                else{
                err={};

                err.message="item is not array type "+rawdata[i].toString();
                }

            }

            if (!err){
               // var isSameLength = true;
                for(i=0;i<N;i++){
                    newData[i].push(rawdata[i][0]);
                }
                
                var ArrayLength = rawdata[0].length;
                var step = 1;
                for(j=1;j<ArrayLength;j++){
                    var isSameValue = true;
                    
                    for (i=0;i<N;i++){
                        isSameValue=isSameValue&&(rawdata[i][j]==rawdata[i][j-step]);    
                    }
                    if(!isSameValue){
                        for(i=0;i<N;i++){
                            newData[i].push(rawdata[i][j]);
                        }
                        step = 1;

                    }
                    else{
                    	step++;
                    }
                }
                
            }
        }

        else {
            err={};
            err.message = "Only Accept Array Type Data.";

        }


        if (err){
            this.err=err;
        }
        else{
        	this.vectorArray=newData;
        }
        return this;
       
}

vector.prototype.GetValue=function(){
	return this.vectorArray;
}

vector.prototype.GetErr = function(){
	return this.err;
}
//Calculate differences between two consecutive points 
//and push them into a new array  
vector.prototype.CompareDelta= function(){
    	if(this.err)
        	return this;
        var err,i,j;
        var rawdata = this.vectorArray;
        var newData = new Array();
        if (Array.isArray(rawdata)){
            var N = rawdata.length;
            for(i=0;i<N;i++){ 
                if(Array.isArray(rawdata[i])){
                newData.push(new Array());
                }
                
                else{
                err={};
                err.message="item is not array type";
                }

            }

            if (!err){
            	var ArrayLength = rawdata[0].length;
            	for (j=0; j<ArrayLength-1 ; j++ ){
            		for(i=0; i<N ; i++){
            			newData[i].push(rawdata[i][j+1]-rawdata[i][j]);
            		
            		}
            	}

        	}
    	}	
        else{
 			err={};
            err.message = "Only Accept Array Type Data.";
        }

        if (err){
            this.err=err;
        }
        else{
        	this.vectorArray=newData;
        }
        return this;
}

//Dynamic time wraping algorithm 
//which is used for aligning vectors of different lengths
vector.DWT = function(ref,test){
	var rl = ref[0].length;
	var tl = test[0].length;
	//console.log(rl,tl);
	var N = ref.length; 
	//console.log(m, n);
	var i, j,n,testloop;
	var distance = 0, Mindistance;
	var DistanceMatrix = new Array();
			for (i = 0; i < rl; i++) {
				DistanceMatrix[i] = new Array();
				
				for (j = 0; j < tl; j++) {
					for(n=0; n<N; n++)
					distance+=(test[n][j]-ref[n][i])*(test[n][j]-ref[n][i]);

					//console.log(distance);
					//console.log(distance);
					DistanceMatrix[i].push(distance);
					distance = 0;
				}
			}

		var DtwMatrix = new Array();
		for (i = 0; i < rl; i++) {
			DtwMatrix[i] = new Array();
			for (j = 0; j < tl; j++) {
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
	return DtwMatrix[rl - 1][tl - 1];

}

module.exports=vector;
