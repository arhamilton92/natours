/** @format */

import axios from 'axios';
import { showAlert } from './alerts';

// type is either password or data
export const updateSettings = async (data, type) => {
	const url =
		type === 'password'
			? 'http://localhost:8000/api/v1/users/updatemypassword'
			: 'http://localhost:8000/api/v1/users/me';
	try {
		const res = await axios({
			method: 'PATCH',
			url,
			data
		});
		if (res.data.status === 'success') {
			showAlert('success', `Updated ${type}!`);
			window.setTimeout(() => {
				location.reload(true);
			}, 1000);
		}
	} catch (error) {
		showAlert('error', error.response.data.message);
	}
};
