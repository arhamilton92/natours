/** @format */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
    // get checkout session from API
    try {
		const session = await axios({
			method: 'GET',
			url: `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`,
		});
		if (session.data.status === 'success') {
			console.log(session)
		}
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
    //
    // create checkout form + charge credit card
};
