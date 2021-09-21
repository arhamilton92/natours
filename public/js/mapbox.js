/** @format */

/* eslint-disable */
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
	'pk.eyJ1IjoiYXJoYW1pbHRvbiIsImEiOiJja3R0MDZhejYxa3R0MnZvMmdsZ3lseWc5In0.ASj5wPRzqBaDCzed8QtKZA';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/arhamilton/cktt0zgo70jg518pe090z88a8',
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
	// create location marker
	const el = document.createElement('div');
	el.className = 'marker';

	// add marker
	new mapboxgl.Marker({
		element: el,
		anchor: 'bottom',
	})
		.setLngLat(loc.coordinates)
		.addTo(map);

	//add popup
	new mapboxgl.Popup({ offset: 30 })
		.setLngLat(loc.coordinates)
		.setHTML(`<p>Day${loc.day}: ${loc.description}</p>`)
		.addTo(map);

	// extend map bounds to include current location
	bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
	padding: {
		top: 200,
		bottom: 200,
		left: 100,
		right: 100,
	},
});
