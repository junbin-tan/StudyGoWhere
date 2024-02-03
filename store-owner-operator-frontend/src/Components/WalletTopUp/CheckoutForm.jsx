import React, {useState} from 'react';
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import {BACKEND_PREFIX} from "../../FunctionsAndContexts/serverPrefix";
import {Button} from "@mui/material";
import ButtonStyles from '../../utilities/ButtonStyles';

const CheckoutForm = ({ownerId, accessToken, options}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (elements == null) {
            return;
        }

        // Trigger form validation and wallet collection
        const {error: submitError} = await elements.submit();
        if (submitError) {
            // Show error to your customer
            setErrorMessage(submitError.message);
            return;
        }

        // Create the PaymentIntent and obtain clientSecret from your server endpoint
        const res = await fetch(`${BACKEND_PREFIX}/public/api/stripe/payment/owner/${ownerId}`, {
            method: 'POST',
            body: JSON.stringify(options),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        const {client_secret: clientSecret} = await res.json();

        const {error} = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            clientSecret,
            confirmParams: {
                return_url: 'http://localhost:3000/wallet',
            },
        });

        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setErrorMessage(error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <br />
            <div className="flex justify-center">
            <Button type="submit" disabled={!stripe || !elements}
                style={(!stripe || !elements) ? ButtonStyles.disabled : ButtonStyles.success}
            >
               Pay
            </Button>
            </div>
            {/*<button type="submit" disabled={!stripe || !elements}>*/}
            {/*    Pay*/}
            {/*</button>*/}
            {/* Show error message to your customers */}
            {errorMessage && <div><b>{errorMessage}</b></div>}
        </form>
    );
};

export default CheckoutForm;
