// write some damn .js silly!!!

const key = "73850cb2206998863eff087956e1fb33";
let date = moment().format(": MMM Do YYYY");

let $buttons = $(".btn");
let $input = $("#city-input");
let $buttonArr = [];
let $city = $("#city");
let $temp = $("#temp");
let $humid = $("#humid");
let $wind = $("#wind");
let $uv = $("#UV");

$(".search-btn").on("click", function(e) {
	e.preventDefault();
	var cityName = $input
		.val()
		.toLowerCase()
		.trim();
	$buttonArr.push(cityName);

	weatherPull();
});

function weatherPull() {
	let weatherURL =
		"http://api.openweathermap.org/data/2.5/weather?q=" +
		$buttonArr[0] +
		"&units=imperial" +
		"&APPID=" +
		key;
	$.ajax({
		url: weatherURL,
		method: "GET"
	}).then(function(res) {
		let city = res.name;
		let temp = res.main.temp;
		let icon = res.weather.icon;
		let humid = res.main.humidity;
		let wind = res.wind.speed;
		// console.log(city, temp, icon, humid, wind);
		// console.log(res);

		$city.append(city, date);
		$temp.prepend(temp);
		$humid.append(humid);
		$wind.append(wind);

		// for UV index, I need the lat, lon and a new api call,
		// "http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}"
		let lat = "&lat=" + res.coord.lon;
		let lon = "&lon=" + res.coord.lat;
		console.log("lat: " + lat, "lon: " + lon);
		let uvURL =
			"http://api.openweathermap.org/data/2.5/uvi?appid=" + key + lat + lon;
		$.ajax({
			url: uvURL,
			method: "GET"
		}).then(function(result) {
			// console.log(result);
			let uvIndex = result.value;
			// console.log(uvIndex);
			$uv.append(uvIndex);
		});
	});
}
console.log($buttonArr);
