const yelpIframe = $('#yelp-iframe');
const weatherIframe = $('#weather-iframe');
const newsIframe = $('#news-iframe');
var zipField = undefined;
var cityField = undefined;
var stateNameField = undefined;
var stateCodeField = undefined;
var searchField = undefined;

function handleSearch() {
	handleZipInput();

	$('form').on('submit', function(event) {
		event.preventDefault();
		updateCitySearch(searchField);
		// handleYelp();
		// handleNews();
		handleWeather();
	});
}

function handleZipInput() {
	// Search using Zip Code
	$('#zip-input').keyup(function(event) {
		zipField = $(this).val();

		if (zipField.length == 5) {
			$.getJSON('Resources/csvjson.json', function(data) {
				$.each(data, function(key, value) {
					if (zipField == value.zip) {
						searchField = value;
						$('#city-input').val(searchField.city);
						$('#state-input').val(searchField.state_name);
					}
				});
			});
		}
	});
}

function updateCitySearch(searchField) {
	cityField = searchField.city;
	stateNameField = searchField.state_name;
	stateCodeField = searchField.state_code;
	zipField = searchField.zip;
}

function handleYelp() {
	let token =
		'Bearer kGyQVf1mVDbLkBJA3ybB37c2we4jmAPdkQfW-42BBsHskQQtW-zxsZIXpSY66UUVmAG7sG9_moAVW33smeq8OQbbU3JnvNu9bQviMTAZB4DMychkVCt0dW0WxX4JXXYx';
	var yelpURL = 'https://api.yelp.com/v3/businesses/search?';
	var corsAnywhereURL = 'https://cors-anywhere.herokuapp.com';
	var yelpSettings = {
		async: true,
		crossDomain: true,
		url: corsAnywhereURL + '/' + yelpURL,
		method: 'GET',
		data: {
			term: 'restaurants',
			location: zipField
		},
		headers: {
			'Authorization': token
		}
	};

	searchYelp(yelpSettings);
}

function searchYelp(yelpSettings) {
	$.ajax(yelpSettings).done(function(response) {
		console.log(response);
	});
}

function handleNews() {
	let token = 'Bearer ba31778142b040128190f031a0b8a129';
	var newsURL = 'https://newsapi.org/v2/everything';
	var newsSettings = {
		async: true,
		crossDomain: true,
		url: newsURL,
		method: 'GET',
		data: {
			q: '"' + cityField + '+' + stateNameField + '"'
			// apiKey: 'ba31778142b040128190f031a0b8a129'
		},
		headers: {
			'Authorization': token
		}
	};
	searchNews(newsSettings);
}

function searchNews(newsSettings) {
	$.ajax(newsSettings).done(function(response) {
		console.log(response);
	});
}

function handleWeather() {
	let token = 'Bearer 2be7e49343b9a3ad3209acd251a978d0';
	var weatherURL = 'api.openweathermap.org/data/2.5/weather';
	var corsAnywhereURL = 'https://cors-anywhere.herokuapp.com';
	var weatherSettings = {
		async: true,
		crossDomain: true,
		url: corsAnywhereURL + '/' + weatherURL,
		method: 'GET',
		data: {
			zip: zipField,
			APPID: '2be7e49343b9a3ad3209acd251a978d0'
		}
	};
	searchWeather(weatherSettings);
}

function searchWeather(weatherSettings) {
	$.ajax(weatherSettings).done(function(response) {
		console.log(response);
	});
}

function handleCST() {
	handleSearch();
}

$(handleCST);
