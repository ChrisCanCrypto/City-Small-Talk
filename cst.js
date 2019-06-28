const yelpSection = $('#yelp-section');
const weatherSection = $('#weather-section');
const newsSection = $('#news-section');
var zipField = undefined;
var cityField = undefined;
var stateNameField = undefined;
var stateCodeField = undefined;
var searchField = undefined;
var yelpTerm = undefined;
var weatherObj = {
	cityName: cityField,
	currentTemp: undefined,
	highTemp: undefined,
	lowTemp: undefined,
	disc: undefined,
	sunrise: undefined,
	sunset: undefined
};

var yelpStar = {
	'0': 'Resources/yelp_stars/web_and_ios/regular/regular_0.png',
	'1': 'Resources/yelp_stars/web_and_ios/regular/regular_1.png',
	'1.5': 'Resources/yelp_stars/web_and_ios/regular/regular_1_half.png',
	'2': 'Resources/yelp_stars/web_and_ios/regular/regular_2.png',
	'2.5': 'Resources/yelp_stars/web_and_ios/regular/regular_2_half.png',
	'3': 'Resources/yelp_stars/web_and_ios/regular/regular_3.png',
	'3.5': 'Resources/yelp_stars/web_and_ios/regular/regular_3_half.png',
	'4': 'Resources/yelp_stars/web_and_ios/regular/regular_4.png',
	'4.5': 'Resources/yelp_stars/web_and_ios/regular/regular_4_half.png',
	'5': 'Resources/yelp_stars/web_and_ios/regular/regular_5.png'
};

var weatherResponse = undefined;
var yelpResponse = undefined;
var newsResponse = undefined;

function handleSearch() {
	handleZipInput();

	$('form').on('submit', function(event) {
		event.preventDefault();
		updateCitySearch(searchField);
		handleYelp();
		handleNews();
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
	// displayYelpList(yelpResponse);
}

function setStarsImg(rating) {
	return '<img class="yelp-result-stars" alt="' + rating + ' stars" src="' + yelpStar[rating] + '">';
}

function searchYelp(yelpSettings) {
	$.ajax(yelpSettings).done(function(response) {
		yelpResponse = response;
		console.log(yelpResponse);
		displayYelpList(yelpResponse);
	});
}

function addYelpEntries(res, amount) {
	var newEntries = '';

	for (let i = 0; i < amount; i++) {
		newEntries += '<li class="yelp-card">';
		newEntries += addYelpImg(res[i]);
		newEntries += addResultInfo(res[i]);
		newEntries += addResultStats(res[i]);
		newEntries += '</li>';
	}

	return newEntries;
}

function addYelpImg(res) {
	var imgStr = '<div class="y-img"> <img src="';
	imgStr += res.image_url;
	imgStr += '" alt="';
	imgStr += res.name;
	imgStr += ' image" > </div>';
	return imgStr;
}

function addNewsImg(res) {
	var imgStr = '<img src="';
	imgStr += res.urlToImage;
	imgStr += '" alt="';
	imgStr += res.title;
	imgStr += ' image" class="result-img">';
	return imgStr;
}

function addResultInfo(res) {
	var infoStr = '';
	infoStr += '<h2 class="y-name"><a href="';
	infoStr += res.url;
	infoStr += '" target="_blank">';
	infoStr += res.name;
	infoStr += '</a></h2>';
	infoStr += '<h5 class="y-cat">';
	for (let j = 0; j < res.categories.length; j++) {
		infoStr += res.categories[j].title;
		infoStr += ' | ';
	}
	infoStr += '</h5>';
	infoStr += '<div class="y-loc">';
	for (let k = 0; k < res.location.display_address.length; k++) {
		infoStr += '<p>' + res.location.display_address[k] + '</p>';
	}
	infoStr += '</div>';
	infoStr += '<p class="y-num">';
	infoStr += res.display_phone;
	infoStr += '</p>';
	return infoStr;
}

function addResultStats(res) {
	var statStr = '';
	statStr += '<div class="y-stars">';
	statStr += setStarsImg(res.rating);
	statStr += '</div>';
	statStr += '<p class="y-rev">Based on ';
	statStr += res.review_count;
	statStr += ' Reviews</p>';
	statStr += '</div>';
	statStr += '<a class="y-logo" href="';
	statStr += res.url;
	statStr += '" target="_blank">';
	statStr += '<img src="Resources/YelpLogo_Trademark/Screen(R)/Yelp_trademark_RGB.png" alt="yelp logo"  />';
	statStr += '</a>';
	return statStr;
}

function displayYelpList(res) {
	yelpSection.empty();
	var yelpEntry = '<h2>Yelp Results</h2><hl><ul>';
	yelpEntry += addYelpEntries(res.businesses, 3);
	yelpEntry += '</ul>';

	yelpSection.append(yelpEntry);
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
			q: '"' + stateNameField + '"'
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
		newsResponse = response;
		console.log(newsResponse);
		displayNewsList(newsResponse);
	});
}

function displayNewsList(res) {
	newsSection.empty();
	var newsEntry = '<h2>News Results</h2><ul>';
	newsEntry += addNewsEntries(res.articles, 3);
	newsEntry += '</ul>';

	newsSection.append(newsEntry);
}

function addNewsEntries(res, amount) {
	var newEntries = '';

	for (let i = 0; i < amount; i++) {
		newEntries += '<li class="result">';
		newEntries += addNewsImg(res[i]);
		newEntries += addNewsInfo(res[i]);
		newEntries += '</li>';
	}

	return newEntries;
}

function addNewsInfo(res) {
	var infoStr = '';
	infoStr += '<div class="result-info">';
	infoStr += '<h2 class="result-name">';
	infoStr += res.title;
	infoStr += '</h2>';
	infoStr += '<h5 class="result-source">';
	infoStr += res.source.name + ' | ' + res.publishedAt;
	infoStr += '</h5><p><a href="';
	infoStr += res.url;
	infoStr += '">Read More</a></p></div>';
	return infoStr;
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
		weatherResponse = response;
		console.log(weatherResponse);
		setWeatherObj(weatherResponse);
		displayWeather();
	});
}

function setWeatherObj(res) {
	weatherObj.currentTemp = kelvinToFahrenheit(res.main.temp);
	weatherObj.highTemp = kelvinToFahrenheit(res.main.temp_max);
	weatherObj.lowTemp = kelvinToFahrenheit(res.main.temp_min);
	weatherObj.disc = res.weather[0].description;
	weatherObj.sunrise = res.sys.sunrise;
	weatherObj.sunset = res.sys.sunset;
	weatherObj.cityName = cityField;
}

function displayWeather() {
	weatherSection.empty();
	weatherStr = '';
	weatherStr += '<h2>';
	weatherStr += weatherObj.cityName;
	weatherStr += '</h2>';
	weatherStr += '<h2>';
	weatherStr += weatherObj.currentTemp;
	weatherStr += '&#8457</h2>';
	weatherStr += '<div class="temp-range">';
	weatherStr += '<h4 class="high">High: ' + weatherObj.highTemp + '&#8457</h4>';
	weatherStr += '<h4 class="low">Low: ' + weatherObj.lowTemp + '&#8457</h4>';
	weatherStr += '</div>';
	weatherStr += '<h2 class="desc">';
	weatherStr += weatherObj.disc;
	weatherStr += '</h2>';

	weatherSection.append(weatherStr);
}

function kelvinToFahrenheit(temp) {
	fahTemp = Math.floor((parseFloat(temp) - 273.15) * 1.8 + 32);
	console.log(fahTemp);
	return fahTemp;
}

function handleCST() {
	handleSearch();
}

$(handleCST);
