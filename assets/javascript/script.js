const key = "73850cb2206998863eff087956e1fb33";
let date = moment().format(": MMM Do YYYY ");

let $buttons = $(".buttons");
let $input = $("#city-input");
let $buttonArr = [];
let $city = $("#city");
let $temp = $("#temp");
let $humid = $("#humid");
let $wind = $("#wind");
let $uv = $("#UV");
let $createdButton = $(".btn");
let $forecastColumns = $(".col-sm-2");

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
	// forecastData();

	// forecastData();
});
console.log($buttonArr);

//  ****** trying to make the generated buttons work....   ******

$(".buttons").on("click", "button", function() {
	$buttons.empty();
	let createdButton = "";
	for (let i = 0; i < $buttonArr.length; i++) {
		createdButton = $("<button>").addClass("btn-outline-secondary btn");
		createdButton.text($buttonArr[i]);
		$buttons.prepend(createdButton);
	}
	weatherPull($(this)[0].innerText);
	// forecastData();
});

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
	console.log("output arr: ", output);

	// $buttonArr.push(output);
	for (let i = 0; i < $buttonArr.length; i++) {
		const cityButton = $("<button>").addClass("btn-outline-secondary btn");
		cityButton.text($buttonArr[i]);
		$buttons.prepend(cityButton);
		// console.log(output, $buttonArr);
	}
}

function weatherPull(cityName) {
	let weatherURL =
		"http://api.openweathermap.org/data/2.5/weather?q=" +
		cityName +
		"&units=imperial" +
		"&APPID=" +
		key;
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
		let lat = "&lat=" + res.coord.lon;
		let lon = "&lon=" + res.coord.lat;
		// console.log("lat: " + lat, "lon: " + lon);

		// call for the weather indication icon;
		let iconURL = "https://openweathermap.org/img/wn/" + icon + ".png";
		let img = $("<img>").attr("src", iconURL);
		$city.append(img);

		// call for the uv index in the searched city;
		let uvURL =
			"http://api.openweathermap.org/data/2.5/uvi?appid=" + key + lat + lon;
		$.ajax({
			url: uvURL,
			method: "GET"
		}).then(function(result) {
			// console.log(result);
			let uvIndex = result.value;
			// console.log(uvIndex);
			$uv.empty().append("UV Index: " + uvIndex);
		});

		//  ***** in progress *****

		// call for the forecast data
		function forecastData() {
			let forecastURL =
				"https://api.openweathermap.org/data/2.5/forecast?" +
				lat +
				lon +
				"&units=imperial" +
				"&APPID=" +
				key;
			$.ajax({
				url: forecastURL,
				method: "GET"
			}).then(function(res) {
				// console.log(res);

				//  ***** still broken, but very close.
				// getting the values back in the console.log
				// but they are not appending the values;
				for (let i = 7; i < 40; i = i + 8) {
					let date = res.list[i].dt_txt;
					$(".col-sm-2").append(date[i]);

					let icon =
						"https://openweathermap.org/img/wn/" +
						res.list[i].weather[0].icon +
						".png";
					let img = $("<img>").attr("src", icon);
					$forecastColumns.append(img[i]);

					let temp = res.list[i].main.temp;
					$forecastColumns.append(temp[i]);
					let humid = res.list[i].main.humidity;
					$forecastColumns.append(humid[i]);
					console.log(
						"Date: " + date.slice(0, 10),
						icon,
						"temp: " + temp + "ºF",
						"humidity: " + humid
					);
				}
			});
		}
		forecastData();
	});
}

returnStorage();
