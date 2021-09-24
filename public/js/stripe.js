/** @format */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
    // get checkout session from API
    const stripe = Stripe('pk_test_51Jcx3mI20R6TlRgOtSizmRe5rWEEmFO56L1C4DBoC2r99xruz5vKoHpZPQS4H0FbbUy7xNsDw4GK3WnKGgPymSn600ocF1wbte');
    try {
		const session = await axios({
			method: 'GET',
			url: `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`,
        });
        console.log(session)
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (error) {
        console.log('error')
        showAlert('error', error.response.data.message);
    }
};
