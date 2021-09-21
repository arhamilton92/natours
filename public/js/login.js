/** @format */

/* eslint-disable */
console.log('login JS file connected');

const login = async (email, password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: 'http://localhost:8000/api/v1/users/login',
			data: {
				email,
				password,
			},
		});
		if (res.data.status === 'success') {
			window.setTimeout(() => {
				location.assign('/');
			}, 100);
		}
	} catch (error) {
		alert(error.response.data.message);
	}
};

document.querySelector('.form').addEventListener('submit', (e) => {
	e.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	login(email, password);
});
