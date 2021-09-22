/** @format */

import '@babel/polyfill';
import { displayMap } from './mapbox.js';
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');

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
if (logOutBtn)
	logOutBtn.addEventListener('click', () => {
		logout();
	});
if (userDataForm) {
	userDataForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const form = new FormData();
		form.append('name', document.getElementById('name').value);
		form.append('email', document.getElementById('email').value);
		form.append('photo', document.getElementById('photo').files[0]);
		console.log(form)
		updateSettings(form, 'data');
	});
}
if (userPasswordForm) {
	userPasswordForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const checkPassword = document.getElementById('password-current').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		const newPassword = document.getElementById('password').value;
		document.querySelector('.btn--save').innerHTML = 'Updating...';
		await updateSettings(
			{ checkPassword, passwordConfirm, newPassword },
			'password'
		);
		document.getElementById('password-current').value = '';
		document.getElementById('password-confirm').value = '';
		document.getElementById('password').value = '';
		document.querySelector('.btn--save').innerHTML = 'Save password';
	});
}
