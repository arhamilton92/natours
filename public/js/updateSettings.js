/** @format */

import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (name, email) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: 'http://localhost:8000/api/v1/users/me',
			data: {
				name,
				email,
			},
		});
		if (res.data.status === 'success') {
			showAlert('success', 'Updated info!');
			window.setTimeout(() => {
				location.reload(true);
			}, 1000);
		}
	} catch (error) {
		showAlert('error', error.response.data.message);
	}
};
