/** @format */

/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
	'pk.eyJ1IjoiYXJoYW1pbHRvbiIsImEiOiJja3R0MDZhejYxa3R0MnZvMmdsZ3lseWc5In0.ASj5wPRzqBaDCzed8QtKZA';
var map = new mapboxgl.Map({
	container: 'map',
    style: 'mapbox://styles/arhamilton/cktt0zgo70jg518pe090z88a8',
    center: [-118.113491, 34.111745],
    zoom: 5
});
