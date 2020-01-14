// write some damn .js

const key = "&APPID=73850cb2206998863eff087956e1fb33";
// let date = moment().format("MMMM Do YYYY");

let $buttons = $(".btn");
let $input = $("#city-input");
let $buttonArr = [];
let $city = $("#city");
let $temp = $("#temp");
let $wind = $("#wind");
let $uv = $("#uv");

$(".search-btn").on("click", function(e) {
	e.preventDefault();
	var cityName = $input
		.val()
		.toLowerCase()
		.trim();
	// for (var i = 0; i < $buttons.length; i++) {
	$buttonArr.push(cityName);
	// }
	weatherPull();
	console.log(cityName);
});

function weatherPull() {
	let queryURL =
		"http://api.openweathermap.org/data/2.5/weather?q=" +
		$buttonArr[0] +
		"&units=imperial" +
		key;
	$.ajax({
		url: queryURL,
		method: "GET"
	}).then(function(res) {
		let city = res.name;
		let time = res.dt;
		let temp = res.main.temp;
		let icon = res.weather.icon;
		let humid = res.main.humidity;
		let wind = res.wind.speed;
		// for UV index, I need the lat & lon

		let lat = res.coord.lon;
		let lon = res.coord.lat;

		console.log("lat: " + lat, "lon: " + lon);
	});
}
console.log($buttonArr);
