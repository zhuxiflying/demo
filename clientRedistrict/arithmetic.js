/*
public double calculateMeasure(RedistrictingPlan rPlan, boolean isForTotalMeasure) {
		if (pop == null)
			return Double.MAX_VALUE;

		if (exPopPerDist == null) {
			System.err
			.println("The target population is not set yet. Measure cannot be calculated. Debug...");
			return Double.MAX_VALUE;
		}

		int[] regResult = rPlan.getUnitIDs();
		int locCnt = regResult.length;
		int regnum = rPlan.getRegNum();

		if (regnum != regNum) {
			JOptionPane.showMessageDialog(null,
					"The number of districts in current plan is different from the number of targets.");
			return Double.MAX_VALUE;
		}
		
		int[] regPop = new int[regnum];
		for (int i = 0; i < locCnt; i++) {
			regPop[regResult[i]] += pop[i];
		}
		double dev = 0;
		double temp;
		for (int i = 0; i < regNum; i++) {
			temp = getDev(regPop[i], i, exPopPerDist, hierarchy, caps);
			if (isForTotalMeasure) {
                dev += calculateDevWithPower(temp, powerDev, exPopPerDist[i]) * weight;
			} else {
				dev += temp;
			}
		}
	
		return dev;
	}
*/


/*	
	public static double getDev(int pop, int regionId, double[] expectedPop,
			boolean hierachy, double[] caps) {
		if (!hierachy) {
			//if (pop < orgTargetPop[regionId]) {
			if (caps == null || caps[regionId] == 0 || pop < caps[regionId]) {
				if (pop <= expectedPop[regionId])
					//return 0;
					return (expectedPop[regionId] - pop); 
				else 
					return (pop - expectedPop[regionId]);
			} else {
				return Math.pow(pop - expectedPop[regionId], 3);
			}		
		} else {
			if (pop <= expectedPop[regionId])
				return (expectedPop[regionId] - pop);

			double remainder = pop % expectedPop[regionId];
			if (remainder < expectedPop[regionId] / 2.0)
				return (remainder);
			else
				return (expectedPop[regionId] - remainder);
		}
	}
*/	

/*	
	public double calculateDevWithPower(double dev, double power, double expectedPop) {
		if (threshold > 0) {
			if (dev < threshold * expectedPop)
				return dev;
			else
				return Math.pow(dev, power);
		}
		return dev;
	}
*/

function (schoolNumber, popNumber){
	alert(popNumber/schoolNumber);
}

var pop=new Array();
var exPopPerDist=new Array();//average school
//rPlan plan1 plan2 plan3 array 
//boolean isForTotalMeasure
function calculateMeasure(rPlan,isForTotalMeasure) {
		if (pop.length<0)
			return Number.MAX_VALUE;

		if (exPopPerDist.length<0) {
			return Number.MAX_VALUE;
		}

		int[] regResult = rPlan;
		int locCnt = regResult.length;
		int regnum = rPlan.getRegNum();// shcool total number

		if (regnum != regNum) {
			return Number.MAX_VALUE;
		}
		
		int[] regPop = new int[regnum];
		for (int i = 0; i < locCnt; i++) {
			regPop[regResult[i]] += pop[i];
		}
		double dev = 0;
		double temp;
		for (int i = 0; i < regNum; i++) {
			temp = getDev(regPop[i], i, exPopPerDist, hierarchy, caps);
			if (isForTotalMeasure) {
                dev += calculateDevWithPower(temp, powerDev, exPopPerDist[i]) * weight;
			} else {
				dev += temp;
			}
		}
	
		return dev;
}
	
function getDev(pop,regionId,expectedPop,hierachy,caps) {
		if (!hierachy) {
			if (caps == null || caps[regionId] == 0 || pop < caps[regionId]) {
				if (pop <= expectedPop[regionId])
					return (expectedPop[regionId] - pop); 
				else 
					return (pop - expectedPop[regionId]);
			} else {
				return Math.pow(pop - expectedPop[regionId], 3);
			}		
		} else {
			if (pop <= expectedPop[regionId])
				return (expectedPop[regionId] - pop);

			double remainder = pop % expectedPop[regionId];
			if (remainder < expectedPop[regionId] / 2.0)
				return (remainder);
			else
				return (expectedPop[regionId] - remainder);
		}
}
	
var thresold;
// var expectedPop/school number

function calculateDevWithPower(dev,power,expectedPop){
		if (threshold > 0) {
			if (dev < threshold * expectedPop)
				return dev;
			else
				return Math.pow(dev, power);
		}
		return dev;
}


