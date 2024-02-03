package com.sgw.backend.config;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    @Value("${stripe.apiKey}")
    private String apiKey;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
    }

    public Event constructEvent(String payload, String sigHeader) throws StripeException {
        return Webhook.constructEvent(
                payload, sigHeader, stripeWebhookSecret);
    }
}
