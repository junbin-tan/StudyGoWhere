import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import React from "react";
import CheckoutForm from "./CheckoutForm";

const CheckoutFormWrapper = ({options, ownerId, accessToken}) => {

    const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_PUB_KEY}`);


    // const options = {
    //     mode: 'payment',
    //     amount: 1099,
    //     currency: 'sgd',
    //     // Fully customizable with appearance API.
    //     appearance: {
    //         /*...*/
    //     },
    // };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm ownerId={ownerId} accessToken={accessToken} options={options}/>
        </Elements>
    );
}

export default CheckoutFormWrapper;