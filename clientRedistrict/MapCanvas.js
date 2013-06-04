var MapCanvas = Canvas.extend({
    map: null,
    heatmapOverlay: null,
    heatmapData: null,
    type: "MapCanvas",
    
    defaults: function(){
		return {
			settings: {
				id: "map",
				type: "ROADMAP",
				heatmap: false,
				locations: false,
				tracks: false,
				county: true
			}
		}    
    },
    
    initialize: function() {
	    _.bindAll(this, 'tracksStatement', 'locationsStatement', 'loadedTracksData', 'loadedLocationsData', 'loadedHeatmapData', 'render', 'initialize', 'resize', 'updateSettings', 'zoomToFitBounds', 'highlightTrack');

	    this.settings = this.defaults().settings;
		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/b73781c9f5ae42339e9d2877273ab5c5/{styleId}/256/{z}/{x}/{y}.png',
		    cloudmadeAttribution = '';
		
		var minimal   = L.tileLayer(cloudmadeUrl, {styleId: 22677, attribution: cloudmadeAttribution}),
		    midnight  = L.tileLayer(cloudmadeUrl, {styleId: 999,   attribution: cloudmadeAttribution}),
		    blackWhite  = L.tileLayer(cloudmadeUrl, {styleId: 19655,   attribution: cloudmadeAttribution});    

		popJsonParse();
		
		this.locationsLayer = L.layerGroup();
		
		//this.tracksLayer = L.layerGroup();
		//this.heatmapLayer = L.TileLayer.heatMap({
		//	radius: 15,
		//	opacity: 0.9
		//});
		
		var county = L.tileLayer.wms("http://129.252.37.169/geoserver/flowmap/wms", {
		layers: 'flowmap:countieswgs84',
		format: 'image/png',
		transparent: true
		});
		
		var jsons={"type":"FeatureCollection","features":[{"type":"Feature","id":"countieswgs84.1","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.41314621969816,32.707262947304166],[-86.41120288041303,32.40980811601479],[-86.49680344226154,32.34430435113076],[-86.81493246962505,32.340668969874635],[-86.9169698116626,32.66403322398187],[-86.41314621969816,32.707262947304166]]]]},"geometry_name":"geom","properties":{"newstcnty":"01001","sum_sum_ar":1565319936,"sum_sum_po":24460,"sum_sum__1":32259,"sum_sum__2":34222,"sum_sum__3":43671,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.2","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.61590571645249,31.244290712253804],[-87.59894994610845,30.997281387434438],[-87.36696489160549,30.440287268226758],[-87.51835006094477,30.2802393448185],[-88.0284120307685,30.220933790934907],[-87.7552814947657,30.27709586500916],[-88.00825537174518,30.68471570476151],[-87.96024263599425,31.146295677075763],[-87.9728765181289,31.162526150025876],[-87.94659337077887,31.192762414124292],[-87.76516289667882,31.297181740897916],[-87.61590571645249,31.244290712253804]]]]},"geometry_name":"geom","properties":{"newstcnty":"01003","sum_sum_ar":4351430144,"sum_sum_po":59382,"sum_sum__1":78556,"sum_sum__2":98280,"sum_sum__3":140415,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.3","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.05610449183942,32.062903906138246],[-85.06817440979823,31.9917054848606],[-85.1410251425342,31.780302159848773],[-85.12701917741083,31.76218096305228],[-85.41650248648878,31.619305739069713],[-85.74830800939985,31.617887965732965],[-85.65772879530907,31.880123695271482],[-85.41030246542843,32.146506734262665],[-85.05610449183942,32.062903906138246]]]]},"geometry_name":"geom","properties":{"newstcnty":"01005","sum_sum_ar":2341839872,"sum_sum_po":22543,"sum_sum__1":24756,"sum_sum__2":25417,"sum_sum__3":29038,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.4","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.02685945980787,33.246350846090294],[-86.8811950988784,33.049785467641996],[-86.8761378898943,32.83614483686915],[-87.01917007464249,32.83691258290524],[-87.42120627588876,32.8743875419389],[-87.42193888852502,33.003262759927324],[-87.06574583133872,33.24679682540997],[-87.02685945980787,33.246350846090294]]]]},"geometry_name":"geom","properties":{"newstcnty":"01007","sum_sum_ar":1621330048,"sum_sum_po":13812,"sum_sum__1":15723,"sum_sum__2":16576,"sum_sum__3":20826,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.5","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.30352195683867,34.09900794350429],[-86.3256464194466,33.94005615700966],[-86.57783719133953,33.76504292700936],[-86.95367313629443,33.81519971043728],[-86.96335409331216,33.85825174051719],[-86.45289104334913,34.25922711413377],[-86.30352195683867,34.09900794350429]]]]},"geometry_name":"geom","properties":{"newstcnty":"01009","sum_sum_ar":1685440000,"sum_sum_po":26853,"sum_sum__1":36459,"sum_sum__2":39248,"sum_sum__3":51024,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.6","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.43360026169182,32.23450783844654],[-85.41030246542843,32.146506734262665],[-85.65772879530907,31.880123695271482],[-85.99690628273166,32.05090481395644],[-85.91918455060572,32.27423471533637],[-85.43360026169182,32.23450783844654]]]]},"geometry_name":"geom","properties":{"newstcnty":"01011","sum_sum_ar":1621240064,"sum_sum_po":11824,"sum_sum__1":10596,"sum_sum__2":11042,"sum_sum__3":11714,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.7","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.44823052083619,31.964484447148543],[-86.49925483851561,31.525174324041142],[-86.70157330101293,31.52365483833416],[-86.86318289863902,31.543695801557032],[-86.90591618875193,31.75261830414535],[-86.9069220274898,31.830481645560692],[-86.8576056068828,31.96202462348869],[-86.44823052083619,31.964484447148543]]]]},"geometry_name":"geom","properties":{"newstcnty":"01013","sum_sum_ar":2014599936,"sum_sum_po":22007,"sum_sum__1":21680,"sum_sum__2":21892,"sum_sum__3":21399,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.8","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.53013604773697,33.94132745912165],[-85.79609228757859,33.55612070323995],[-86.14559170846445,33.67900074958696],[-86.06530191108254,33.84210539768044],[-85.73901475320481,33.96836573829975],[-85.53013604773697,33.94132745912165]]]]},"geometry_name":"geom","properties":{"newstcnty":"01015","sum_sum_ar":1585740032,"sum_sum_po":103092,"sum_sum__1":119761,"sum_sum__2":116034,"sum_sum__3":112249,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.9","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.23243638811289,33.10796284817937],[-85.1841916638617,32.87040402206306],[-85.1323051331657,32.746437191392936],[-85.59319927883524,32.72840660672856],[-85.59322722856554,33.10722759375993],[-85.23243638811289,33.10796284817937]]]]},"geometry_name":"geom","properties":{"newstcnty":"01017","sum_sum_ar":1559990016,"sum_sum_po":36356,"sum_sum__1":39191,"sum_sum__2":36876,"sum_sum__3":36583,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.10","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.462127681388,34.28629853379957],[-85.42190031536339,34.08073002407211],[-85.39888365017437,33.96403590769499],[-85.53013604773697,33.94132745912165],[-85.73901475320481,33.96836573829975],[-85.84365632513547,34.19991684881105],[-85.51375292136953,34.52409216864438],[-85.462127681388,34.28629853379957]]]]},"geometry_name":"geom","properties":{"newstcnty":"01019","sum_sum_ar":1553929984,"sum_sum_po":15606,"sum_sum__1":18760,"sum_sum__2":19543,"sum_sum__3":23988,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.11","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.51736630713334,33.020450279173325],[-86.37723517549,32.75419700289907],[-86.41314621969816,32.707262947304166],[-86.9169698116626,32.66403322398187],[-87.01778145029482,32.728995717937416],[-87.01917007464249,32.83691258290524],[-86.8761378898943,32.83614483686915],[-86.8811950988784,33.049785467641996],[-86.51736630713334,33.020450279173325]]]]},"geometry_name":"geom","properties":{"newstcnty":"01021","sum_sum_ar":1815030016,"sum_sum_po":25180,"sum_sum__1":30612,"sum_sum__2":32458,"sum_sum__3":39593,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.12","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.93065420816612,32.310437471361816],[-88.07347747733493,31.990037842329272],[-88.18081659802579,31.81819093093512],[-88.08828490243165,31.69914924485527],[-88.46440492893328,31.69772780790155],[-88.47320523304519,31.893707853244447],[-88.43126137415396,32.22752731440551],[-88.42142732663586,32.30854520719116],[-87.93065420816612,32.310437471361816]]]]},"geometry_name":"geom","properties":{"newstcnty":"01023","sum_sum_ar":2384969984,"sum_sum_po":16589,"sum_sum__1":16839,"sum_sum__2":16018,"sum_sum__3":15922,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.13","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.6677722240659,31.991211483471115],[-87.50094166921568,31.82910430131219],[-87.57124222790063,31.439900668034802],[-87.76516289667882,31.297181740897916],[-87.94659337077887,31.192762414124292],[-87.90614922989374,31.491594463013662],[-88.08828490243165,31.69914924485527],[-88.18081659802579,31.81819093093512],[-88.07347747733493,31.990037842329272],[-87.6677722240659,31.991211483471115]]]]},"geometry_name":"geom","properties":{"newstcnty":"01025","sum_sum_ar":3244019968,"sum_sum_po":26724,"sum_sum__1":27702,"sum_sum__2":27240,"sum_sum__3":27867,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.14","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.64352439931314,33.495780098076644],[-85.65370365919152,33.106522012645165],[-86.00920828531726,33.09014673104418],[-86.17440306134934,33.10428128740031],[-85.8519305762703,33.498639660762436],[-85.64352439931314,33.495780098076644]]]]},"geometry_name":"geom","properties":{"newstcnty":"01027","sum_sum_ar":1569580032,"sum_sum_po":12636,"sum_sum__1":13703,"sum_sum__2":13252,"sum_sum__3":14254,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.15","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.39888365017437,33.96403590769499],[-85.38652429162849,33.90162283786875],[-85.33825607231982,33.65301681002318],[-85.30449129106628,33.48277777825742],[-85.64352439931314,33.495780098076644],[-85.8519305762703,33.498639660762436],[-85.79609228757859,33.55612070323995],[-85.53013604773697,33.94132745912165],[-85.39888365017437,33.96403590769499]]]]},"geometry_name":"geom","properties":{"newstcnty":"01029","sum_sum_ar":1453100032,"sum_sum_po":10996,"sum_sum__1":12595,"sum_sum__2":12730,"sum_sum__3":14123,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.16","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.78920061173234,31.617806194055298],[-85.79147426208861,31.19617930339237],[-86.19344734086711,31.19204851156798],[-86.194007838563,31.43991198344883],[-86.14594798165297,31.6175861499608],[-85.78920061173234,31.617806194055298]]]]},"geometry_name":"geom","properties":{"newstcnty":"01031","sum_sum_ar":1762489984,"sum_sum_po":34872,"sum_sum__1":38533,"sum_sum__2":40240,"sum_sum__3":43615,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.17","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.4264958183074,34.79994104621647],[-87.52959624182695,34.56699530433564],[-88.13995545652645,34.58161498628381],[-88.0978525487765,34.89211977171349],[-87.80693368505253,34.73197643671118],[-87.4264958183074,34.79994104621647]]]]},"geometry_name":"geom","properties":{"newstcnty":"01033","sum_sum_ar":1615079936,"sum_sum_po":49632,"sum_sum__1":54519,"sum_sum__2":51666,"sum_sum__3":54984,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.18","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.70157330101293,31.52365483833416],[-86.70033125398773,31.192138450747994],[-87.4273124338733,31.26022166862649],[-86.90591618875193,31.75261830414535],[-86.86318289863902,31.543695801557032],[-86.70157330101293,31.52365483833416]]]]},"geometry_name":"geom","properties":{"newstcnty":"01035","sum_sum_ar":2208369920,"sum_sum_po":15645,"sum_sum__1":15884,"sum_sum__2":14054,"sum_sum__3":14089,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.19","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.00920828531726,33.09014673104418],[-86.00710544004328,32.7548636558785],[-86.37723517549,32.75419700289907],[-86.51736630713334,33.020450279173325],[-86.49105261092222,33.10283182513637],[-86.17440306134934,33.10428128740031],[-86.00920828531726,33.09014673104418]]]]},"geometry_name":"geom","properties":{"newstcnty":"01037","sum_sum_ar":1725890048,"sum_sum_po":10662,"sum_sum__1":11377,"sum_sum__2":11063,"sum_sum__3":12202,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.20","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.49925483851561,31.525174324041142],[-86.194007838563,31.43991198344883],[-86.19344734086711,31.19204851156798],[-86.18731040698542,30.99387417172712],[-86.38870579475649,30.994005891391982],[-86.68836546304394,30.994420971226646],[-86.70033125398773,31.192138450747994],[-86.70157330101293,31.52365483833416],[-86.49925483851561,31.525174324041142]]]]},"geometry_name":"geom","properties":{"newstcnty":"01039","sum_sum_ar":2703350016,"sum_sum_po":34079,"sum_sum__1":36850,"sum_sum__2":36478,"sum_sum__3":37631,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.21","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.19141917090901,31.966308868294796],[-86.14594798165297,31.6175861499608],[-86.194007838563,31.43991198344883],[-86.49925483851561,31.525174324041142],[-86.44823052083619,31.964484447148543],[-86.40630787820734,32.05059088997265],[-86.19141917090901,31.966308868294796]]]]},"geometry_name":"geom","properties":{"newstcnty":"01041","sum_sum_ar":1582080000,"sum_sum_po":13188,"sum_sum__1":14110,"sum_sum__2":13635,"sum_sum__3":13665,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.22","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.5819523167705,34.30460638234079],[-86.45289104334913,34.25922711413377],[-86.96335409331216,33.85825174051719],[-87.15103712222938,33.99312727869513],[-87.10990220261651,34.2992037993485],[-87.11010050396095,34.313708036536234],[-86.5819523167705,34.30460638234079]]]]},"geometry_name":"geom","properties":{"newstcnty":"01043","sum_sum_ar":1954899968,"sum_sum_po":52445,"sum_sum__1":61642,"sum_sum__2":67613,"sum_sum__3":77483,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.23","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.41650248648878,31.619305739069713],[-85.4175049381177,31.31480668381623],[-85.71093937807234,31.195010026413552],[-85.79147426208861,31.19617930339237],[-85.78920061173234,31.617806194055298],[-85.74830800939985,31.617887965732965],[-85.41650248648878,31.619305739069713]]]]},"geometry_name":"geom","properties":{"newstcnty":"01045","sum_sum_ar":1457440000,"sum_sum_po":52938,"sum_sum__1":47821,"sum_sum__2":49633,"sum_sum__3":49129,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.24","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.9169698116626,32.66403322398187],[-86.81493246962505,32.340668969874635],[-86.90698135736532,32.04783026388408],[-87.17808658572268,32.0473760042611],[-87.47221184484054,32.26478428656854],[-87.47308866547925,32.307479731073606],[-87.42316175480049,32.48283420664969],[-87.11127198028579,32.48954847741346],[-87.01778145029482,32.728995717937416],[-86.9169698116626,32.66403322398187]]]]},"geometry_name":"geom","properties":{"newstcnty":"01047","sum_sum_ar":2572920064,"sum_sum_po":55296,"sum_sum__1":53981,"sum_sum__2":48130,"sum_sum__3":46365,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.25","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.53412884534941,34.62378399441748],[-85.52730129629637,34.58860723821305],[-85.51375292136953,34.52409216864438],[-85.84365632513547,34.19991684881105],[-86.10611618179205,34.2006675781231],[-86.05773571188664,34.4759131229453],[-85.5831837060078,34.860298279585],[-85.53412884534941,34.62378399441748]]]]},"geometry_name":"geom","properties":{"newstcnty":"01049","sum_sum_ar":2016710016,"sum_sum_po":41981,"sum_sum__1":53658,"sum_sum__2":54651,"sum_sum__3":64452,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.26","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.00710544004328,32.7548636558785],[-85.88100274030592,32.7532036893493],[-85.88619265539018,32.49292268879385],[-86.02305408408616,32.419846849609286],[-86.41120288041303,32.40980811601479],[-86.41314621969816,32.707262947304166],[-86.37723517549,32.75419700289907],[-86.00710544004328,32.7548636558785]]]]},"geometry_name":"geom","properties":{"newstcnty":"01051","sum_sum_ar":1702109952,"sum_sum_po":33535,"sum_sum__1":43390,"sum_sum__2":49210,"sum_sum__3":65874,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.27","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.70033125398773,31.192138450747994],[-86.68836546304394,30.994420971226646],[-86.78596569874992,30.99680324149082],[-87.16264707668888,30.998879789358533],[-87.59894994610845,30.997281387434438],[-87.61590571645249,31.244290712253804],[-87.4273124338733,31.26022166862649],[-86.70033125398773,31.192138450747994]]]]},"geometry_name":"geom","properties":{"newstcnty":"01053","sum_sum_ar":2468120064,"sum_sum_po":34906,"sum_sum__1":38440,"sum_sum__2":35518,"sum_sum__3":38440,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.28","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.84365632513547,34.19991684881105],[-85.73901475320481,33.96836573829975],[-86.06530191108254,33.84210539768044],[-86.19880396414061,33.98870516679867],[-86.3256464194466,33.94005615700966],[-86.30352195683867,34.09900794350429],[-86.10611618179205,34.2006675781231],[-85.84365632513547,34.19991684881105]]]]},"geometry_name":"geom","properties":{"newstcnty":"01055","sum_sum_ar":1421080064,"sum_sum_po":94144,"sum_sum__1":103057,"sum_sum__2":99840,"sum_sum__3":103459,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.29","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.63592103596501,33.915152901031185],[-87.42369962636882,33.60199158789528],[-87.84067142907595,33.52473444542888],[-87.94650233536521,33.52395887726696],[-87.95176031455613,33.91983146720379],[-87.63592103596501,33.915152901031185]]]]},"geometry_name":"geom","properties":{"newstcnty":"01057","sum_sum_ar":1630109952,"sum_sum_po":16252,"sum_sum__1":18809,"sum_sum__2":17962,"sum_sum__3":18495,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.30","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.52959624182695,34.56699530433564],[-87.52970629544178,34.30450817016767],[-87.6347064709124,34.30690472789148],[-88.17359369867381,34.32095888356532],[-88.15625920785226,34.4631240093406],[-88.13995545652645,34.58161498628381],[-87.52959624182695,34.56699530433564]]]]},"geometry_name":"geom","properties":{"newstcnty":"01059","sum_sum_ar":1674040064,"sum_sum_po":23933,"sum_sum__1":28350,"sum_sum__2":27814,"sum_sum__3":31223,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.31","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.71093937807234,31.195010026413552],[-85.48583382329119,31.199666869607377],[-85.4883678704842,30.996907389420464],[-85.49834706184728,30.996751559770477],[-86.03510792560652,30.993145613209148],[-86.18731040698542,30.99387417172712],[-86.19344734086711,31.19204851156798],[-85.79147426208861,31.19617930339237],[-85.71093937807234,31.195010026413552]]]]},"geometry_name":"geom","properties":{"newstcnty":"01061","sum_sum_ar":1499049984,"sum_sum_po":21924,"sum_sum__1":24253,"sum_sum__2":23647,"sum_sum__3":25764,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.32","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.71570121634242,33.00670679281008],[-87.8703523917591,32.76255126942453],[-87.7437768146086,32.65422394289308],[-87.81255384631946,32.524429578725915],[-87.85340808017706,32.5319550566881],[-88.07836850949249,32.61875212497756],[-88.17182940081338,32.995740686002456],[-87.8375146231711,33.15352247353968],[-87.71570121634242,33.00670679281008]]]]},"geometry_name":"geom","properties":{"newstcnty":"01063","sum_sum_ar":1709049984,"sum_sum_po":10650,"sum_sum__1":11021,"sum_sum__2":10153,"sum_sum__3":9974,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.33","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.42193888852502,33.003262759927324],[-87.42120627588876,32.8743875419389],[-87.52448485238018,32.481900048701974],[-87.81255384631946,32.524429578725915],[-87.7437768146086,32.65422394289308],[-87.8703523917591,32.76255126942453],[-87.71570121634242,33.00670679281008],[-87.42193888852502,33.003262759927324]]]]},"geometry_name":"geom","properties":{"newstcnty":"01065","sum_sum_ar":1700109952,"sum_sum_po":15888,"sum_sum__1":15604,"sum_sum__2":15498,"sum_sum__3":17185,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.34","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.12701917741083,31.76218096305228],[-85.04557028432347,31.516965199990196],[-85.0877292277414,31.30850738743687],[-85.4175049381177,31.31480668381623],[-85.41650248648878,31.619305739069713],[-85.12701917741083,31.76218096305228]]]]},"geometry_name":"geom","properties":{"newstcnty":"01067","sum_sum_ar":1472210048,"sum_sum_po":13254,"sum_sum__1":15302,"sum_sum__2":15374,"sum_sum__3":16310,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.35","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.0877292277414,31.30850738743687],[-85.02854792910652,31.075344325607947],[-85.00244058689022,31.000503531067956],[-85.4883678704842,30.996907389420464],[-85.48583382329119,31.199666869607377],[-85.71093937807234,31.195010026413552],[-85.4175049381177,31.31480668381623],[-85.0877292277414,31.30850738743687]]]]},"geometry_name":"geom","properties":{"newstcnty":"01069","sum_sum_ar":1506189952,"sum_sum_po":56574,"sum_sum__1":74632,"sum_sum__2":81331,"sum_sum__3":88787,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.36","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.60520189063007,34.984604234913476],[-85.5831837060078,34.860298279585],[-86.05773571188664,34.4759131229453],[-86.32700766347577,34.59966108892712],[-86.31128854500737,34.991015738879575],[-85.86396563147257,34.988304282245124],[-85.60520189063007,34.984604234913476]]]]},"geometry_name":"geom","properties":{"newstcnty":"01071","sum_sum_ar":2918769920,"sum_sum_po":39202,"sum_sum__1":51407,"sum_sum__2":47796,"sum_sum__3":53926,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.37","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.57783719133953,33.76504292700936],[-86.51680548082848,33.54579645275377],[-87.02685945980787,33.246350846090294],[-87.06574583133872,33.24679682540997],[-87.26692745954729,33.51282403242728],[-86.95367313629443,33.81519971043728],[-86.57783719133953,33.76504292700936]]]]},"geometry_name":"geom","properties":{"newstcnty":"01073","sum_sum_ar":2910619904,"sum_sum_po":644991,"sum_sum__1":671324,"sum_sum__2":651525,"sum_sum__3":662047,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.38","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.95176031455613,33.91983146720379],[-87.94650233536521,33.52395887726696],[-88.27459030798038,33.533896999955076],[-88.24891031060719,33.74487106071032],[-88.20719603440385,34.05823546461579],[-87.9869053318155,34.05200488065192],[-87.95176031455613,33.91983146720379]]]]},"geometry_name":"geom","properties":{"newstcnty":"01075","sum_sum_ar":1568240000,"sum_sum_po":14335,"sum_sum__1":16453,"sum_sum__2":15715,"sum_sum__3":15904,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.39","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.21075121706836,34.99894717913689],[-87.26065980100208,34.75854355958375],[-87.4264958183074,34.79994104621647],[-87.80693368505253,34.73197643671118],[-88.0978525487765,34.89211977171349],[-88.20003156275756,34.99555248475068],[-87.98488942749016,35.00580464593122],[-87.60623485439346,35.003566435376484],[-87.22319473747764,34.999229517186414],[-87.21075121706836,34.99894717913689]]]]},"geometry_name":"geom","properties":{"newstcnty":"01077","sum_sum_ar":1862320000,"sum_sum_po":68111,"sum_sum__1":80546,"sum_sum__2":79661,"sum_sum__3":87966,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.40","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.26065980100208,34.75854355958375],[-87.10506376728395,34.685951777722515],[-87.11010050396095,34.313708036536234],[-87.10990220261651,34.2992037993485],[-87.52970629544178,34.30450817016767],[-87.52959624182695,34.56699530433564],[-87.4264958183074,34.79994104621647],[-87.26065980100208,34.75854355958375]]]]},"geometry_name":"geom","properties":{"newstcnty":"01079","sum_sum_ar":1859789952,"sum_sum_po":27281,"sum_sum__1":30170,"sum_sum__2":31513,"sum_sum__3":34803,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.41","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.1323051331657,32.746437191392936],[-85.0806889647096,32.607939902093534],[-85.00091086202946,32.51034316322278],[-85.43410196788786,32.40970406740051],[-85.69590392772017,32.59580445192511],[-85.59319927883524,32.72840660672856],[-85.1323051331657,32.746437191392936]]]]},"geometry_name":"geom","properties":{"newstcnty":"01081","sum_sum_ar":1594870016,"sum_sum_po":61268,"sum_sum__1":76283,"sum_sum__2":87146,"sum_sum__3":115092,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.42","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.78364970664441,34.9918456531228],[-86.79005890092849,34.55070326119992],[-87.10506376728395,34.685951777722515],[-87.26065980100208,34.75854355958375],[-87.21075121706836,34.99894717913689],[-86.83637480468204,34.99168611412462],[-86.78364970664441,34.9918456531228]]]]},"geometry_name":"geom","properties":{"newstcnty":"01083","sum_sum_ar":1572470016,"sum_sum_po":41699,"sum_sum__1":46005,"sum_sum__2":54135,"sum_sum__3":65676,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.43","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.49680344226154,32.34430435113076],[-86.40630787820734,32.05059088997265],[-86.44823052083619,31.964484447148543],[-86.8576056068828,31.96202462348869],[-86.90698135736532,32.04783026388408],[-86.81493246962505,32.340668969874635],[-86.49680344226154,32.34430435113076]]]]},"geometry_name":"geom","properties":{"newstcnty":"01085","sum_sum_ar":1878310016,"sum_sum_po":12897,"sum_sum__1":13253,"sum_sum__2":12658,"sum_sum__3":13473,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.44","geometry":{"type":"MultiPolygon","coordinates":[[[[-85.69590392772017,32.59580445192511],[-85.43410196788786,32.40970406740051],[-85.43360026169182,32.23450783844654],[-85.91918455060572,32.27423471533637],[-86.02305408408616,32.419846849609286],[-85.88619265539018,32.49292268879385],[-85.69590392772017,32.59580445192511]]]]},"geometry_name":"geom","properties":{"newstcnty":"01087","sum_sum_ar":1588519936,"sum_sum_po":24841,"sum_sum__1":26829,"sum_sum__2":24928,"sum_sum__3":24105,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.45","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.31128854500737,34.991015738879575],[-86.32700766347577,34.59966108892712],[-86.42428138445335,34.47937060865656],[-86.55017763925194,34.54587834211035],[-86.79005890092849,34.55070326119992],[-86.78364970664441,34.9918456531228],[-86.31878075883829,34.99106518871812],[-86.31128854500737,34.991015738879575]]]]},"geometry_name":"geom","properties":{"newstcnty":"01089","sum_sum_ar":2105090048,"sum_sum_po":186540,"sum_sum__1":196966,"sum_sum__2":238912,"sum_sum__3":276700,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.46","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.81255384631946,32.524429578725915],[-87.52448485238018,32.481900048701974],[-87.47308866547925,32.307479731073606],[-87.47221184484054,32.26478428656854],[-87.6677722240659,31.991211483471115],[-88.07347747733493,31.990037842329272],[-87.93065420816612,32.310437471361816],[-88.04031503245957,32.41983434713358],[-87.85340808017706,32.5319550566881],[-87.81255384631946,32.524429578725915]]]]},"geometry_name":"geom","properties":{"newstcnty":"01091","sum_sum_ar":2545469952,"sum_sum_po":23819,"sum_sum__1":25047,"sum_sum__2":23084,"sum_sum__3":22539,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.47","geometry":{"type":"MultiPolygon","coordinates":[[[[-87.6347064709124,34.30690472789148],[-87.63610176272309,34.00210730951191],[-87.63592103596501,33.915152901031185],[-87.95176031455613,33.91983146720379],[-87.9869053318155,34.05200488065192],[-88.20719603440385,34.05823546461579],[-88.2037474759545,34.08646519212917],[-88.17359369867381,34.32095888356532],[-87.6347064709124,34.30690472789148]]]]},"geometry_name":"geom","properties":{"newstcnty":"01093","sum_sum_ar":1925810048,"sum_sum_po":23788,"sum_sum__1":30041,"sum_sum__2":29830,"sum_sum__3":31214,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.48","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.05773571188664,34.4759131229453],[-86.10611618179205,34.2006675781231],[-86.30352195683867,34.09900794350429],[-86.45289104334913,34.25922711413377],[-86.5819523167705,34.30460638234079],[-86.55017763925194,34.54587834211035],[-86.42428138445335,34.47937060865656],[-86.32700766347577,34.59966108892712],[-86.05773571188664,34.4759131229453]]]]},"geometry_name":"geom","properties":{"newstcnty":"01095","sum_sum_ar":1613929984,"sum_sum_po":54211,"sum_sum__1":65622,"sum_sum__2":70832,"sum_sum__3":82231,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.49","geometry":{"type":"MultiPolygon","coordinates":[[[[-88.08682117892701,30.259666974780124],[-88.31332456324459,30.229826881805273],[-88.12466227934918,30.283443310424406],[-88.08682117892701,30.259666974780124]]],[[[-87.96024263599425,31.146295677075763],[-88.00825537174518,30.68471570476151],[-88.1361748298232,30.32053245322369],[-88.39501512319043,30.369230532481208],[-88.41244430138278,30.73540755643394],[-88.42562641182859,30.998143335861737],[-88.43199657894057,31.114123038524802],[-87.9728765181289,31.162526150025876],[-87.96024263599425,31.146295677075763]]]]},"geometry_name":"geom","properties":{"newstcnty":"01097","sum_sum_ar":3288459268,"sum_sum_po":634616,"sum_sum__1":729960,"sum_sum__2":757286,"sum_sum__3":799686,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}},{"type":"Feature","id":"countieswgs84.50","geometry":{"type":"MultiPolygon","coordinates":[[[[-86.9069220274898,31.830481645560692],[-86.90591618875193,31.75261830414535],[-87.4273124338733,31.26022166862649],[-87.61590571645249,31.244290712253804],[-87.76516289667882,31.297181740897916],[-87.57124222790063,31.439900668034802],[-87.50094166921568,31.82910430131219],[-86.9069220274898,31.830481645560692]]]]},"geometry_name":"geom","properties":{"newstcnty":"01099","sum_sum_ar":2679879936,"sum_sum_po":20883,"sum_sum__1":22651,"sum_sum__2":23968,"sum_sum__3":24324,"maxsimptol":0.08993220293,"minsimptol":0.08993220293,"stateid":1}}],"crs":{"type":"EPSG","properties":{"code":"4326"}}};
		
			
		//var layers = [minimal,county];
		var layers = [minimal];
		//if(this.settings.locations) layers.push(this.locationsLayer);
		//if(this.settings.tracks) layers.push(this.tracksLayer);
		//if(this.settings.heatmap) layers.push(this.heatmapLayer);
		
		this.map = L.map(this.$el.get(0), {
		    //center: new L.LatLng(38.736737, -9.138908),
			center: new L.LatLng(39.90,-93.69),
		    zoom: 5,
		    layers: layers
		});    
		
		var drawnItems = new L.FeatureGroup();
		this.map.addLayer(drawnItems);

		var drawControl = new L.Control.Draw({
			draw: {
				position: 'topleft',
				polygon: {
					title: 'Draw a sexy polygon!',
					allowIntersection: false,
					drawError: {
						color: '#b00b00',
						timeout: 1000
					},
					shapeOptions: {
						color: '#bada55'
					}
				},
				circle: {
					shapeOptions: {
						color: '#662d91'
					}
				}
			},
			edit: {
				featureGroup: drawnItems
			}
		});
		this.map.addControl(drawControl);	
		
		var baseMaps = {
		    "Night View": midnight,
		    "Minimal": minimal,
		    "Black & White": blackWhite
		};

		
		this.map.on('draw:created', function (e) {
			var type = e.layerType,
				layer = e.layer;
			
			
			console.log('type=========draw========'+layer._latlngs.length);
			
			
			   
			   	for(var j=0;j<geometryArray.length;j++){
				    for(var k=0;k<geometryArray[j].length;k++){
						//console.log('split========'+geometryArray[j][k].toString().split(","));
						var str=geometryArray[j][k].toString().split(",");
						for(var a=0;a<str.length;a++)
						{
						    if(a%2==0){
								console.log('Value1======'+str[a]);
							}else{
							    console.log('Value2======'+str[a]);
							}
							for(var i=0;i<layer._latlngs.length;i++){
							    console.log('=========layer========'+layer._latlngs[i]);
							}
						}
			
					  }
					  break;
				}
				
			
			if (type === 'marker') {
				layer.bindPopup('A popup!');
			}

			drawnItems.addLayer(layer);
		});
		
		// get color depending on population density value
		function getColor(d) {
			return d > 1000 ? '#800026' :
			       d > 500  ? '#BD0026' :
			       d > 200  ? '#E31A1C' :
			       d > 100  ? '#FC4E2A' :
			       d > 50   ? '#FD8D3C' :
			       d > 20   ? '#FEB24C' :
			       d > 10   ? '#FED976' :
			                  '#FFEDA0';
		}
		
		function getColor1(d) {
			return d > 1000 ? '#FF1493' :
			       d > 500  ? '#8B008B' :
			       d > 200  ? '#008B8B' :
			       d > 100  ? '#FC4E2A' :
			       d > 50   ? '#7FFF00' :
			       d > 20   ? '#B22222' :
			       d > 10   ? '#A0522D' :
			                  '#A0522D';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.density)
			};
		}
		
		function style1(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor1(feature.properties.density)
			};
		}
		
		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;
		var schooljson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			this.map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}
        
		/*
		geojson = L.geoJson(jsons, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(this.map);*/
		 
		//alert(properties);

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}
		
		
		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}


		var overlayMaps = {
			"country name": county,
			//"unit": geojson,
		};
			
						
		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 10, 20, 50, 100, 200, 500, 1000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};
		
	    ajaxPost(this.map,overlayMaps,L,midnight,minimal,blackWhite,county);
		ajaxPostPopTab(this.map,L);
		ajaxPostSchool();
		
	},
	
	
	tracksStatement: function(){
    	var sql = "http://visualmobility.cartodb.com/api/v2/sql/?format=geojson&q=WITH segments AS (SELECT ST_Makeline(pts.the_geom) AS the_geom, ST_Length(ST_Makeline(pts.the_geom_webmercator))/1000 AS distance, transport_modes.factor, transport_mode, (MAX(timestamp)-MIN(timestamp)) AS time, pts.track_id, pts.path_id AS id, pts.user_id FROM (SELECT * FROM points WHERE points.user_id=" + this.userId + " ORDER BY points.track_id, points.path_id, points.timestamp ASC) AS pts JOIN paths ON pts.path_id=paths.cartodb_id JOIN transport_modes ON paths.transport_mode=transport_modes.name GROUP BY id, pts.track_id, factor, pts.user_id, transport_mode), starts AS ( SELECT events.date AS date, events.track_id, events.location_id AS location_id, locations.name AS location_name FROM events JOIN locations ON events.location_id=locations.cartodb_id WHERE events.type='StartTrack' ), ends AS ( SELECT events.date AS date, events.track_id, events.location_id AS location_id, locations.name AS location_name FROM events JOIN locations ON events.location_id=locations.cartodb_id WHERE events.type='EndTrack' ), tracks AS ( SELECT segments.track_id AS id, SUM(distance*factor) AS carbon, SUM(distance) AS distance, SUM(segments.time) AS time, starts.location_id AS start_id, ends.location_id AS end_id, starts.date AS start_date, ends.date AS end_date, starts.location_name AS start_name, ends.location_name AS end_name, user_id FROM segments JOIN starts ON starts.track_id=segments.track_id JOIN ends ON ends.track_id=segments.track_id GROUP BY segments.track_id, user_id, start_date, end_date, start_id, end_id, start_name, end_name ) SELECT segments.*, tracks.start_id, tracks.end_id FROM segments JOIN tracks ON segments.track_id=tracks.id WHERE segments.track_id IN (SELECT tracks.id FROM tracks WHERE ";
    	
    	sql += this.filter.userFiltering(this.userId);
    	sql += this.filter.minDateFiltering();
		sql += this.filter.maxDateFiltering();
		sql += this.filter.minTimeFiltering();
		sql += this.filter.maxTimeFiltering();
		sql += this.filter.minDistanceFiltering();
		sql += this.filter.maxDistanceFiltering();
		sql += this.filter.minDurationFiltering();
		sql += this.filter.maxDurationFiltering();
		sql += this.filter.minCarbonFiltering();
		sql += this.filter.maxCarbonFiltering();
		sql += this.filter.startLocationFiltering();
		sql += this.filter.endLocationFiltering();
		sql += this.filter.transportModeFiltering();
    	
    	sql += " )";
		console.log(sql);
		return encodeUrl(sql);
    },
    
    locationsStatement: function(){
	    var sql = "http://visualmobility.cartodb.com/api/v2/sql?format=geojson&q=WITH segments AS ( SELECT ST_Makeline(pts.the_geom_webmercator) AS the_geom_webmercator, ST_Length(ST_Makeline(pts.the_geom_webmercator))/1000 AS distance, transport_modes.factor, transport_mode, (MAX(timestamp)-MIN(timestamp)) AS time, pts.track_id, pts.path_id AS id, pts.user_id FROM (SELECT * FROM points WHERE points.user_id=" + this.userId + " ORDER BY points.track_id, points.path_id, points.timestamp ASC) AS pts JOIN paths ON pts.path_id=paths.cartodb_id JOIN transport_modes ON paths.transport_mode = transport_modes.name GROUP BY pts.path_id, pts.track_id, factor, pts.user_id, transport_mode ), starts AS ( SELECT events.date AS date, events.track_id, events.location_id AS location_id, locations.name AS location_name FROM events JOIN locations ON events.location_id=locations.cartodb_id WHERE events.type='StartTrack' ), ends AS ( SELECT events.date AS date, events.track_id, events.location_id AS location_id, locations.name AS location_name FROM events JOIN locations ON events.location_id=locations.cartodb_id WHERE events.type='EndTrack' ), tracks AS ( SELECT segments.track_id AS id, SUM(distance*factor) AS carbon, SUM(distance) AS distance, SUM(segments.time) AS time, starts.location_id AS start_id, ends.location_id AS end_id, starts.date AS start_date, ends.date AS end_date, starts.location_name AS start_name, ends.location_name AS end_name, user_id FROM segments JOIN starts ON starts.track_id=segments.track_id JOIN ends ON ends.track_id=segments.track_id GROUP BY segments.track_id, user_id, start_date, end_date, start_id, end_id, start_name, end_name ) SELECT locations.cartodb_id AS id, locations.name, COUNT(tracks.end_id) AS cnt, locations.the_geom FROM tracks JOIN locations ON (locations.cartodb_id=start_id OR locations.cartodb_id=end_id) WHERE tracks.id IN ( SELECT id FROM tracks WHERE ";
    	
    	sql += this.filter.userFiltering(this.userId);
    	sql += this.filter.minDateFiltering();
		sql += this.filter.maxDateFiltering();
		sql += this.filter.minTimeFiltering();
		sql += this.filter.maxTimeFiltering();
		sql += this.filter.minDistanceFiltering();
		sql += this.filter.maxDistanceFiltering();
		sql += this.filter.minDurationFiltering();
		sql += this.filter.maxDurationFiltering();
		sql += this.filter.minCarbonFiltering();
		sql += this.filter.maxCarbonFiltering();
		sql += this.filter.startLocationFiltering();
		sql += this.filter.endLocationFiltering();
		sql += this.filter.transportModeFiltering();
    	
    	sql += " ) GROUP BY locations.cartodb_id ORDER BY cnt ASC";
/*     	console.log(sql); */
		return encodeUrl(sql);
    },
    
    heatmapStatement: function(){
	    var sql = "http://visualmobility.cartodb.com/api/v2/sql/?q=WITH segments AS ( SELECT ST_Makeline(pts.the_geom_webmercator) AS the_geom_webmercator, ST_Length(ST_Makeline(pts.the_geom_webmercator))/1000 AS distance, transport_modes.factor, transport_mode, (MAX(timestamp)-MIN(timestamp)) AS time, pts.track_id, pts.path_id AS id, pts.user_id FROM (SELECT * FROM points WHERE points.user_id=" + this.userId + " ORDER BY points.track_id, points.path_id, points.timestamp ASC) AS pts JOIN paths ON pts.path_id=paths.cartodb_id JOIN transport_modes ON paths.transport_mode = transport_modes.name GROUP BY pts.path_id, pts.track_id, factor, pts.user_id, transport_mode ), starts AS ( SELECT events.date AS date, events.track_id, events.location_id AS location_id, locations.name AS location_name FROM events JOIN locations ON events.location_id=locations.cartodb_id WHERE events.type='StartTrack' ), ends AS ( SELECT events.date AS date, events.track_id, events.location_id AS location_id, locations.name AS location_name FROM events JOIN locations ON events.location_id=locations.cartodb_id WHERE events.type='EndTrack' ), tracks AS ( SELECT segments.track_id AS id, SUM(distance*factor) AS carbon, SUM(distance) AS distance, SUM(segments.time) AS time, starts.location_id AS start_id, ends.location_id AS end_id, starts.date AS start_date, ends.date AS end_date, starts.location_name AS start_name, ends.location_name AS end_name, user_id FROM segments JOIN starts ON starts.track_id=segments.track_id JOIN ends ON ends.track_id=segments.track_id GROUP BY segments.track_id, user_id, start_date, end_date, start_id, end_id, start_name, end_name ) SELECT ST_x(geom) AS lon, ST_y(geom) AS lat, count(geom) AS value FROM ( SELECT ST_SnapToGrid(points.the_geom,0.0001) AS geom FROM points WHERE points.track_id IN ( SELECT tracks.id FROM tracks WHERE ";
	    
	    sql += this.filter.userFiltering(this.userId);
	    sql += this.filter.minDateFiltering();
		sql += this.filter.maxDateFiltering();
		sql += this.filter.minTimeFiltering();
		sql += this.filter.maxTimeFiltering();
		sql += this.filter.minDistanceFiltering();
		sql += this.filter.maxDistanceFiltering();
		sql += this.filter.minDurationFiltering();
		sql += this.filter.maxDurationFiltering();
		sql += this.filter.minCarbonFiltering();
		sql += this.filter.maxCarbonFiltering();
		sql += this.filter.startLocationFiltering();
		sql += this.filter.endLocationFiltering();
		sql += this.filter.transportModeFiltering();
	    
	    sql += ")) AS foo GROUP BY lon, lat";
	    console.log(sql);
		return encodeUrl(sql);
    },
    
    
    render: function(){
		console.log("MapCanvas: Rendering");
		
		//d3.json(this.tracksStatement(), this.loadedTracksData);
		//d3.json(this.locationsStatement(), this.loadedLocationsData);
		//$.get(this.heatmapStatement(), this.loadedHeatmapData);
	},
	
	zoomToFitBounds: function(bounds){
		if(!this.bounds && !bounds) return;
		
		if(bounds) this.map.fitBounds([[bounds[0][1], bounds[0][0]], [bounds[1][1], bounds[1][0]]]);
		else this.map.fitBounds([[this.bounds[0][1], this.bounds[0][0]], [this.bounds[1][1], this.bounds[1][0]]]);
	},
	
	resize: function(){
		console.log("MapCanvas: resize()");
		this.map.invalidateSize(true);
	},
	
	clear: function(){
		this.unbind();
		this.filter.off("change", this.render);
		
		var id = this.$el.attr('id');
		var newNode = $('<div id="' + id + '" class="cell">');
		
		this.$el.before(newNode);
		this.$el.remove();
		this.$el = newNode;
	}, 
	
	loadedTracksData: function(collection){
		console.log("MapCanvas: LoadedTracksData");
		/* console.log(collection); */
		
		this.tracksLayer.clearLayers();
		this.bounds = d3.geo.bounds(collection);
		
		L.geoJson(collection, {
		    style: function(feature){
			    return {
			    	"color"		: hslToRgb(transportColors[feature.properties.transport_mode]),
				    "opacity"	: 1,
				    "weight"	: 2
			    };
		    }
		}).addTo(this.tracksLayer).bringToBack();	
		this.zoomToFitBounds();	
	},
	
	loadedLocationsData: function(collection){
		console.log("MapCanvas: LoadedLocationsData");
		/* console.log(collection); */
		
		this.locationsLayer.clearLayers();
		
		var min = Math.min.apply(Math, collection.features.map(function(feature){ return feature.properties.cnt }));
		var max = Math.max.apply(Math, collection.features.map(function(feature){ return feature.properties.cnt }));
		
		var colorScale = d3.scale.log().domain([min, max]).interpolate(d3.interpolateHsl).range([d3.hsl(0, .9, .5), d3.hsl(130, .9, .5)]);
		var sizeScale = d3.scale.log().domain([min, max]).range([4, 15]);
		
		L.geoJson(collection, {
		    pointToLayer: function (feature, latlng) {
		        return L.circleMarker(latlng, {
		        	color		: "#000",
				    weight		: 1,
				    opacity		: 1,
				    fillOpacity	: 0.8,
					fillColor	: colorScale(feature.properties.cnt),
					radius		: sizeScale(feature.properties.cnt),
				});
		    },
		    onEachFeature: function(feature, layer){
		    	var p = feature.properties;
			    if (p) {
			    	var popupContent = '<b>Location: </b>' + p.name + '</br>';
			    	popupContent += '<b>Check-ins: </b>' + p.cnt + '</br>';
			        layer.bindPopup(popupContent);
			    }
		    }
		}).addTo(this.locationsLayer).bringToFront();
	},
	
	loadedHeatmapData: function(raw){  
    	console.log("MapCanvas: LoadedHeatmapData in " + raw.time + " seconds.");
    	/* console.log(raw.rows); */
    	this.heatmapLayer.addData(raw.rows);
    	this.heatmapLayer
    	this.heatmapLayer.bringToFront();
    },
	
	updateSettings: function(settings){
		if(this.settings.heatmap == settings.heatmap && this.settings.tracks == settings.tracks){
			return;
		}
		
		this.settings.heatmap = settings.heatmap;
		this.settings.tracks = settings.tracks;
	},
	
	highlightTrack: function(id, start, end){
		this.tracksLayer.eachLayer(function(layer){
			var bounds;
			layer.eachLayer(function(tLayer){
				if(id && tLayer.feature.properties.track_id != id){
					tLayer._path.style.display = "none";
				} else if(start && end && tLayer.feature.properties.start_id != end && tLayer.feature.properties.end_id != end){
					tLayer._path.style.display = "none";
				} else {
					var b = d3.geo.bounds(tLayer.feature);
					if(!bounds) bounds = b;
					bounds[0][0] = Math.min(bounds[0][0], b[0][0]);
					bounds[0][1] = Math.min(bounds[0][1], b[0][1]);
					bounds[1][0] = Math.max(bounds[1][0], b[1][0]);
					bounds[1][1] = Math.max(bounds[1][1], b[1][1]);
				}
			});
			this.zoomToFitBounds(bounds);
		}, this);

		this.locationsLayer.eachLayer(function(layer){
			layer.eachLayer(function(lLayer){
				if(start && end && lLayer.feature.properties.id != start && lLayer.feature.properties.id != end){		
					lLayer._path.style.display = "none";
				}
			});
		});
	},
	
	clearHighlightTrack: function(){
		this.tracksLayer.eachLayer(function(layer){
			this.zoomToFitBounds();
			layer.eachLayer(function(tLayer){
				tLayer._path.style.display = "block";
			});
		}, this);
		
		this.locationsLayer.eachLayer(function(layer){
			layer.eachLayer(function(lLayer){
				lLayer._path.style.display = "block";
			});
		});
	}	
});

MapCanvas.prototype.id = "map";
MapCanvas.prototype.label = "Map";
MapCanvas.prototype.thumb = "thumb_map.png"