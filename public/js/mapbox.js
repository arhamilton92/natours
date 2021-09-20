/** @format */

/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
	'pk.eyJ1IjoiYXJoYW1pbHRvbiIsImEiOiJja3R0MDZhejYxa3R0MnZvMmdsZ3lseWc5In0.ASj5wPRzqBaDCzed8QtKZA';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
});
