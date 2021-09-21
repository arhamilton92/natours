/** @format */

import '@babel/polyfill';
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';
import { updateData } from './updateSettings.js'

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data')

// DELEGATION
if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}
if (loginForm) {
	loginForm.addEventListener('submit', (e) => {
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		e.preventDefault();
		login(email, password);
	});
}
if (logOutBtn) logOutBtn.addEventListener('click', () => {
    logout()
});
if (userDataForm) {
	userDataForm.addEventListener('submit', (e) => {
		e.preventDefault()
		const email = document.getElementById('email').value;
		const name = document.getElementById('name').value;
		updateData(name, email)
	});
}
