/* Author: 

*/

var mapHandler = function(){
    
	var centerImg = 'img/center.png';
	var contest1Img = 'img/contest1.png';
	var contest2Img = 'img/contest2.png';
	var radius = 3000;
	
	var resultMap;
	var center;
	
	function checkForNull(value) {
		if(typeof(value) === 'undefined' || value == null) {
		    return true;
		} else {
			return false;
		}
	}
	
	function initializeMap(lat, long, mapDiv) {
		var startLatLong;
		var zoomLevel = 5;
	    
		if (checkForNull(lat) || checkForNull(long)) {
			
			// get location from browser...
			
			startLatLong = new google.maps.LatLng(62.186014, 15.424805);
		} else {
			startLatLong = new google.maps.LatLng(lat, long);
			zoomLevel = 11;
		}
		
		var mapOptions = { 
			    zoom: zoomLevel, 
			    center: startLatLong, 
			    mapTypeId: google.maps.MapTypeId.ROADMAP 
			};
		
	   	resultMap = new google.maps.Map(document.getElementById(mapDiv), mapOptions);
	   	center = addMarker(startLatLong,'center',centerImg);
		google.maps.event.addListener(resultMap, 'click', changeCenter);
	}
	
	function changeCenter(event) {
		console.log('changing center');
		if (!checkForNull(event)) {
			console.log(event.latLng.toString());
			resultMap.setCenter(event.latLng);
			resultMap.setZoom(11);
			center.setPosition(event.latLng);
			showRadius();
		}
	}
	
	function showRadius(){
		console.log('drawing radius');
	}
	
	function addMarker(position, title, iconUrl) {
		return new google.maps.Marker({position: position, map: resultMap, title:title, icon: iconUrl});
	}

	function clearMap() {
		
	}
	
	function getCenter() {
		return center.getPosition(); 
	}
	
	
	return {
		init:initializeMap,
		getCenter:getCenter,
//		addMarkerToMap:addMarker,
		clearMarkersFromMap:clearMap
	}
}();

function initialize() {
	mapHandler.init(null, null,'mapDiv');
}

function battle() {
	//$.('resultDiv').show();
	console.log('starting battle...');
}



















