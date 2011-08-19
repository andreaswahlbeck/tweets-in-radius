/* Author: 

*/

function checkForNull(value) {
	if(typeof(value) === 'undefined' || value == null) {
	    return true;
	} else {
		return false;
	}
}

var mapHandler = function(){
    
	var tweetHandler = null;
	
	var radius = 3000;
	
	var resultMap = null;
	var center = null;
	var tweetsRadius = null;
	
	function initializeMap(lat, long, mapDiv, handler) {
		var startLatLong;
		var zoomLevel = 5;
		tweetHandler = handler;
	    
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
	   	//center = addMarker(startLatLong,'center',centerImg);
	   	center = startLatLong;
	   	assignLatLongToInputs();
	   	assignRadiusToInputs();
		google.maps.event.addListener(resultMap, 'click', changeCenterOnclick);
		console.log('map init complete');
	}
	
	function changeCenterOnclick(event) {
		console.log('changing center onclick');
		var latLong;
		
		clearOldResults();
		
		if (!checkForNull(event)) {
			console.log("Lat long from event: " + event.latLng.toString());
			latLong = event.latLng;
			assignLatLongToInputs();
		} else {
			console.log("Lat long from input: " + $('#latitude').attr('value').toString().substring(0,10) + ',' + $('#longitude').attr('value').toString().substring(0,10));
			latLong = new google.maps.LatLng($('#latitude').attr('value').toString().substring(0,10), $('#longitude').attr('value').toString().substring(0,10));
		} 
		clearRadius();
		resultMap.setCenter(latLong);
		resultMap.setZoom(11);
		console.log('setting center position: ' + latLong.toString());
		center = latLong;
		showRadius();
		tweetHandler.getTweets();
	}
	
	function clearOldResults() {
		$("#accordion").remove();
		$('<div id="accordion"></div>').appendTo("#resultDiv");
	}
	
	function updateCenter(latLong) {
		
	}
	
	function assignLatLongToInputs() {
		$('#latitude').attr('value',getCenter().lat().toString().substring(0,10));
		$('#longitude').attr('value',getCenter().lng().toString().substring(0,10));
	}
	
	function assignRadiusToInputs() {
		$('#radius').attr('value',radius);
	}
	
	function clearRadius() {
		if (!checkForNull(tweetsRadius)) {
			tweetsRadius.setMap(null);
		}
	}
	
	function showRadius(){
		setRadius();
		var circleOptions = {
			      strokeColor: "#33FF66",
			      strokeOpacity: 0.5,
			      strokeWeight: 2,
			      fillColor: "#33FF66",
			      fillOpacity: 0.20,
			      map: resultMap,
			      center: getCenter(),
			      radius: radius,
			      clickable: false
			    };
		tweetsRadius = new google.maps.Circle(circleOptions);
	}
	
	function addMarker(position, title, iconUrl) {
		return new google.maps.Marker({position: position, map: resultMap, title:title, icon: iconUrl});
	}
	
	function getCenter() {
		return center; 
	}
	
	function getRadius() {
		return radius;
	}
	
	function setRadius() {
		var inputVal = parseInt($('#radius').attr('value'));
		console.log("checking input radius: " + inputVal);
		console.log(typeof(inputVal));
		if (typeof(inputVal)=='number' ) {
			console.log('updating radius');
			radius = inputVal; 
		}
	}
	
	return {
		init:initializeMap,
		getCenter:getCenter,
		getRadius:getRadius,
		changeCenter:changeCenterOnclick,
		setRadiusFromInput:setRadius
	};
}();


var tweetHandler = function(){
	function parseTweets(data) {
		if (checkForNull(data.results)) {
			console.log("error data back...");
		} else {
			$.each(data.results,function(){putTweetInResult(this);});
			$("#accordion").accordion({autoHeight: false,navigation: true});
		}
	}


	function putTweetInResult(tweet) {
//		var templateMarkup = '<div class="result"><img src="${profile_image_url}" /><p><span>${from_user}</span>${text}</p></div>';
		var templateMarkup = '<h3><a href="#">${from_user}</a></h3><div class="result"><img src="${profile_image_url}" /><p><span>${from_user}</span>${text}</p></div>';
		console.log("handling tweet from: " + tweet.from_user);
		$.template("tweetTemplate", templateMarkup);
		$.tmpl("tweetTemplate", tweet).appendTo("#accordion");
	}

	function getTweets() {
		var geoData = mapHandler.getCenter().lat().toString().substring(0,10) + '%2C' + mapHandler.getCenter().lng().toString().substring(0,10) + '%2C' + mapHandler.getRadius() / 1000 + "km";
		var tweetSearch = "http://search.twitter.com/search.json?rpp=20&result_type=recent&geocode=" + geoData;
		console.log('Searching: ' + tweetSearch);
		$.ajax({dataType: "jsonp", jsonpCallback: "tweetHandler.parseTweets",url: tweetSearch});
	}
	
	return {getTweets:getTweets,parseTweets:parseTweets};
	
}();	
	
function initialize() {
	mapHandler.init(null, null,'mapDiv',tweetHandler);
}

function findTweets() {
	mapHandler.changeCenter(null);
}





















