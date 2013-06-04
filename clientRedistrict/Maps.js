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
				locations: true,
				tracks: true
			}
		}    
    },
    
    
	initialize: function (){
	this.settings = this.defaults().settings;
		var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/b73781c9f5ae42339e9d2877273ab5c5/{styleId}/256/{z}/{x}/{y}.png',
		    cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

		var minimal   = L.tileLayer(cloudmadeUrl, {styleId: 22677, attribution: cloudmadeAttribution}),
		    midnight  = L.tileLayer(cloudmadeUrl, {styleId: 999,   attribution: cloudmadeAttribution}),
		    blackWhite  = L.tileLayer(cloudmadeUrl, {styleId: 19655,   attribution: cloudmadeAttribution});
			
		var county = L.tileLayer.wms("http://129.252.37.169/geoserver/flowmap/wms", {
		layers: 'flowmap:countieswgs84',
		format: 'image/png',
		transparent: true
		});
		
		this.map = L.map(this.$el.get(0), {
		    //center: new L.LatLng(38.736737, -9.138908),
			 center: new L.LatLng(39.90,-93.69),
		    zoom: 12,
		    layers: layers
		});    
		
		
		var baseMapCanvas = {
		    "Night View": midnight,
		    "Minimal": minimal,
		    "Black & White": blackWhite
		};
		
		var overlayMapCanvas = {
			"country name": county
		};
		
		L.control.layers(baseMapCanvas, overlayMapCanvas).addTo(this.map);
	}
		
});
