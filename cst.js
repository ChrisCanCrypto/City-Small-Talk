const yelpIframe = $('#yelp-iframe');
const weatherIframe = $('#weather-iframe');
const newsIframe = $('#news-iframe');
var zipField = undefined;
var cityField = undefined;
var stateNameField = undefined;
var stateCodeField = undefined;
var searchField = undefined;

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

function handleSearch() {
	handleZipInput();

	$('form').on('submit', function(event) {
		event.preventDefault();
		updateCitySearch(searchField);
		handleYelp();
	});
}

function searchYelp(yelpSettings) {
	$.ajax(yelpSettings).done(function(response) {
		console.log(response);
	});
}

function handleYelp() {
	let location = zipField;
	let term = 'restaurants';
	var yelpSettings = {
		'async': true,
		'crossDomain': true,
		'url': 'https://api.yelp.com/v3/businesses/search?',
		'method': 'GET',
		'headers': {
			'cache-control': 'no-cache',
			'Authorization':
				'Bearer kGyQVf1mVDbLkBJA3ybB37c2we4jmAPdkQfW-42BBsHskQQtW-zxsZIXpSY66UUVmAG7sG9_moAVW33smeq8OQbbU3JnvNu9bQviMTAZB4DMychkVCt0dW0WxX4JXXYx'
		}
	};
	yelpSettings.url = updateYelpURL(yelpSettings.url);
	searchYelp(yelpSettings);
}

function updateYelpURL(url) {
	url += 'location=' + zipField;
	return url;
}

function handleCST() {
	handleSearch();
}

$(handleCST);
