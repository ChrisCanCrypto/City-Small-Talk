const yelpSection = $('#yelp-section');
const weatherSection = $('#weather-section');
const newsSection = $('#news-section');
var zipField = undefined;
var cityField = undefined;
var stateNameField = undefined;
var stateCodeField = undefined;
var searchField = undefined;
var yelpTerm = 'restaurants';
var weatherObj = {
	cityName: cityField,
	currentTemp: undefined,
	highTemp: undefined,
	lowTemp: undefined,
	disc: undefined,
	sunrise: undefined,
	sunset: undefined
};

var isSearchReady = false;

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

function handleYelp(zip, term) {
	term = term || 'restaurants';
	const token =
		'Bearer kGyQVf1mVDbLkBJA3ybB37c2we4jmAPdkQfW-42BBsHskQQtW-zxsZIXpSY66UUVmAG7sG9_moAVW33smeq8OQbbU3JnvNu9bQviMTAZB4DMychkVCt0dW0WxX4JXXYx';

	fetch(makeYelpURL(zip, term), {
		headers: {
			'Authorization': token
		}
	})
		.then(res => res.json())
		.then(yelpJson => displayYelpList(yelpJson))
		.catch(e => console.log(e));
	// displayYelpList(yelpResponse);
}

function makeYelpURL(zip, term) {
	var corsAnywhereURL = 'https://cors-anywhere.herokuapp.com';
	var yelpURL = 'https://api.yelp.com/v3/businesses/search?';
	var searchLocation = 'location=' + zip;
	var searchTerm = 'term=' + term;

	return corsAnywhereURL + '/' + yelpURL + searchTerm + '&' + searchLocation;
}

function displayYelpList(yelp) {
	var yelpEntry = '';
	yelpEntry += addYelpEntries(yelp.businesses, 20);
	yelpSection.empty();
	$('.yelp-handler').removeClass('hidden');
	yelpSection.append(yelpEntry);
}

function addYelpEntries(yelp, amount) {
	console.log(yelp);
	var newEntries = '';

	for (let i = 0; i < amount; i++) {
		newEntries += '<div class="yelp-card">';
		newEntries += addYelpImg(yelp[i]);
		newEntries += addYelpInfo(yelp[i]);
		newEntries += addYelpStats(yelp[i]);
		newEntries += '</div>';
	}

	return newEntries;
}

function addYelpImg(yelp) {
	var imgStr = '<div class="y-img"> <img src="';
	imgStr += yelp.image_url;
	imgStr += '" alt="';
	imgStr += yelp.name;
	imgStr += ' image" > </div>';
	return imgStr;
}

function addYelpInfo(yelp) {
	var infoStr = '';
	infoStr += '<h2 class="y-name"><a href="';
	infoStr += yelp.url;
	infoStr += '" target="_blank">';
	infoStr += yelp.name;
	infoStr += '</a></h2>';
	infoStr += '<h5 class="y-cat">';
	for (let j = 0; j < yelp.categories.length; j++) {
		infoStr += yelp.categories[j].title;
		infoStr += ' | ';
	}
	infoStr += '</h5>';
	infoStr += '<div class="y-loc">';
	for (let k = 0; k < yelp.location.display_address.length; k++) {
		infoStr += '<p>' + yelp.location.display_address[k] + '</p>';
	}
	infoStr += '</div>';
	infoStr += '<p class="y-num">';
	infoStr += yelp.display_phone;
	infoStr += '</p>';
	return infoStr;
}

function addYelpStats(yelp) {
	var statStr = '';
	statStr += '<div class="y-stars">';
	statStr += setStarsImg(yelp.rating);
	statStr += '</div>';
	statStr += '<p class="y-rev">Based on ';
	statStr += yelp.review_count;
	statStr += ' Reviews</p>';
	statStr += '<a class="y-logo" href="';
	statStr += yelp.url;
	statStr += '" target="_blank">';
	statStr +=
		'<img src="Resources/YelpLogo_Trademark/Screen(R)/Yelp_trademark_RGB.png" alt="yelp logo"  />';
	statStr += '</a>';
	statStr += '</div>';
	return statStr;
}

function setStarsImg(rating) {
	return (
		'<img class="yelp-result-stars" alt="' + rating + ' stars" src="' + yelpStar[rating] + '">'
	);
}

function displayYelpError(e) {
	yelpSection.empty();
	var yelpErrorEntry = 'Sorry yelp is running into an issue with your request.' + e;
	$('.yelp-handler').addClass('hidden');
	yelpSection.append(yelpErrorEntry);
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

function displayNewsList(news) {
	newsSection.empty();
	var newsEntry = '<h2>' + stateNameField + ' News</h2>';
	newsEntry += addNewsEntries(news.articles, 5);
	newsSection.append(newsEntry);
}

function addNewsEntries(news, amount) {
	var newEntries = '';

	for (let i = 0; i < amount; i++) {
		newEntries += '<div class="news-card">';
		newEntries += addNewsImg(news[i]);
		newEntries += addNewsInfo(news[i]);
		newEntries += '</div>';
	}

	return newEntries;
}

function addNewsImg(news) {
	var imgStr = '<div class="n-img"><img src="';
	imgStr += news.urlToImage;
	imgStr += '" alt="';
	imgStr += news.title;
	imgStr += ' image"></div>';
	return imgStr;
}

function addNewsInfo(news) {
	var infoStr = '';
	infoStr += '<h2 class="n-name">';
	infoStr += news.title;
	infoStr += '</h2>';
	infoStr += '<h5 class="n-source">';
	infoStr += news.source.name + ' | ' + shortenNewsDate(news);
	infoStr += '</h5><p class="n-desc">';
	infoStr += shortenNewsDesc(news);
	infoStr += '<a href="';
	infoStr += news.url;
	infoStr += '">...Read More</a></p>';
	return infoStr;
}

function shortenNewsDate(news) {
	var newsDate = news.publishedAt;
	newsDate = newsDate.slice(0, newsDate.indexOf('T'));
	return newsDate;
}

function shortenNewsDesc(news) {
	var newsDesc = news.description;
	newsDesc = newsDesc.slice(0, newsDesc.indexOf('.'));
	return newsDesc;
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
	weatherStr += '<h2 class="desc">';
	weatherStr += weatherObj.disc;
	weatherStr += '</h2>';
	weatherStr += '<h2>';
	weatherStr += weatherObj.currentTemp;
	weatherStr += '&#8457</h2>';
	weatherStr += '<div class="temp-range">';
	weatherStr += '<h4 class="high">High: ' + weatherObj.highTemp + '&#8457</h4>';
	weatherStr += '<h4 class="low">Low: ' + weatherObj.lowTemp + '&#8457</h4>';
	weatherStr += '</div>';

	weatherSection.append(weatherStr);
}

function kelvinToFahrenheit(temp) {
	fahTemp = Math.floor((parseFloat(temp) - 273.15) * 1.8 + 32);
	console.log(fahTemp);
	return fahTemp;
}

function handleSearch() {
	handleZipInput();

	$('#search-form').on('submit', function(event) {
		event.preventDefault();
		if (isSearchReady === true) {
			handleYelp(searchField.zip);
			// handleNews();
			// handleWeather();
			$('#zip-input').val('');
			isSearchReady = false;
		} else {
			alert(
				'Something is wrong, Either you have forgotten to enter a zip code, or the zip code you entered is not currently in our database. Try entering another zip code and search again.'
			);
		}
	});

	$('#yelp-form').on('submit', function(event) {
		event.preventDefault();
		if (yelpTerm != undefined && yelpTerm != null) {
			yelpTerm = $('#yelp-term').val();
			handleYelp();
		}
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
						updateCitySearch(searchField);
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

	isSearchReady = true;
}

$(handleSearch);
