const key = "73850cb2206998863eff087956e1fb33";
const date = moment().format(": MMM Do YYYY ");

const $buttons = $(".buttons");
const $input = $("#city-input");
const $buttonArr = [];
const $city = $("#city");
const $temp = $("#temp");
const $humid = $("#humid");
const $wind = $("#wind");
const $uv = $("#UV");
const $createdButton = $(".btn");
const $forecastColumns = $(".fore-col");

function init() {
	let firstCity = $buttonArr.pop();
	weatherPull(firstCity);
}

function toStorage(cityName) {
	$buttonArr.push(cityName);
	let inputArr = JSON.stringify($buttonArr);
	localStorage.setItem("cityButtons", inputArr);
}

function returnStorage() {
	let getInput = localStorage.getItem("cityButtons");
	let output = JSON.parse(getInput);
	if (output != null) {
		for (let i = 0; i < output.length; i++) {
			$buttonArr.push(output[i]);
		}
	}

	for (let i = 0; i < $buttonArr.length; i++) {
		const cityButton = $("<button>").addClass("btn-outline-secondary btn");
		cityButton.text($buttonArr[i]);
		$buttons.prepend(cityButton);
		// console.log(output, $buttonArr);
	}
}

function clearForecastDivs() {
	for (let i = 1; i < $forecastColumns.length; i++) {
		$forecastColumns[i].empty();
	}
}

function weatherPull(cityName) {
	let weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${key}`;

	$.ajax({
		url: weatherURL,
		method: "GET"
	}).then(function(res) {
		// getting data points to display;
		let city = res.name;
		let temp = res.main.temp;
		let icon = res.weather[0].icon;
		let humid = res.main.humidity;
		let wind = res.wind.speed;

		// display data points from API;
		$city.empty().append(city, date);
		$temp.empty().prepend("Temperature: " + temp + " ºF");
		$humid.empty().append("Humidity: " + humid + " %");
		$wind.empty().append("Wind: " + wind + " mph");

		// for UV index, new call;
		let lat = "&lat=" + res.coord.lat;
		let lon = "&lon=" + res.coord.lon;

		// call for the weather indication icon;
		let iconURL = `https://openweathermap.org/img/wn/${icon}.png`;
		let img = $("<img>").attr("src", iconURL);
		$city.append(img);

		// call for the UV index in the searched city;
		let uvURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${key}${lat}${lon}`;

		$.ajax({
			url: uvURL,
			method: "GET"
		}).then(function(result) {
			// console.log(result);
			let uvIndex = result.value;
			console.log(uvIndex);

			if (uvIndex > 3) {
				$uv.empty().append("UV Index: " + uvIndex);
				$uv.removeClass();
				$uv.addClass("badge badge-succuss");
			} else if (uvIndex > 3 && uvIndex < 7) {
				$uv.empty().append("UV Index: " + uvIndex);
				$uv.removeClass();
				$uv.addClass("badge badge-warning");
			} else uvIndex > 7;
			$uv.empty().append("UV Index: " + uvIndex);
			$uv.removeClass();
			$uv.addClass("badge badge-danger");
		});

		// call for the forecast data
		function forecastData(lat, lon) {
			$forecastColumns.removeClass("hide");

			let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?${lat}${lon}&units=imperial&appid=${key}`;

			$.ajax({
				url: forecastURL,
				method: "GET"
			}).then(function(res) {
				console.log(res);

				let i = 7;
				$forecastColumns.each(function() {
					if (i < 40) {
						$(this)
							.children(".row-city")
							.html(moment(res.list[i].dt_txt).format("dddd"));
						$(this)
							.children(".row-date")
							.html(moment().format("MM - DD - YYYY"));

						let icon =
							"https://openweathermap.org/img/wn/" +
							res.list[i].weather[0].icon +
							".png";
						let img = $("<img>").attr("src", icon);
						$(this)
							.children(".row-icon")
							.html(img);

						let temp = res.list[i].main.temp;
						$(this)
							.children(".row-temp")
							.html("temp: " + temp + "ºF");

						let humid = res.list[i].main.humidity;
						$(this)
							.children(".row-humid")
							.html("humidity: " + humid + " %");
					}
					i = i + 8;
				});
			});
		}
		forecastData(lat, lon);
	});
}

$(".search-btn").on("click", function(e) {
	e.preventDefault();
	var cityName = $input
		.val()
		.toLowerCase()
		.trim();
	// if buttonArr does not include city name;
	if (!$buttonArr.includes(cityName)) {
		toStorage(cityName);

		let cityButton = $("<button>").addClass("btn-outline-secondary btn");
		cityButton.text(cityName);
		$buttons.prepend(cityButton);
	}
	weatherPull(cityName);
});

$(".buttons").on("click", "button", function() {
	$buttons.empty();
	let createdButton = "";
	for (let i = 0; i < $buttonArr.length; i++) {
		createdButton = $("<button>").addClass("btn-outline-secondary btn");
		createdButton.text($buttonArr[i]);
		$buttons.prepend(createdButton);
	}
	weatherPull($(this)[0].innerText);
});

returnStorage();
init();
