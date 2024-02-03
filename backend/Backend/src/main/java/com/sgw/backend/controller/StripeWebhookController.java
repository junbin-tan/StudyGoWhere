package com.sgw.backend.controller;

import com.sgw.backend.config.StripeConfig;
import com.sgw.backend.service.StripeService;
import com.sgw.backend.service.WalletService;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/stripe-webhooks")
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    @Autowired
    private WalletService walletService;

    @Autowired
    private StripeService stripeService;

    @Autowired
    private StripeConfig stripeConfig;

    /*
     * RUN THIS COMMAND FOR STRIPE CLI:
     * stripe listen --forward-to localhost:5001/public/stripe-webhooks/webhook
     */

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(HttpServletRequest request) {
        System.out.println("IN StripeWebhookController");
        String payload;
        try {
            payload = request.getReader().lines().collect(Collectors.joining("\n"));
            System.out.println("PAYLOAD IN StripeWebhookController: " + payload);
            String sigHeader = request.getHeader("Stripe-Signature");

            Event event = stripeConfig.constructEvent(payload, sigHeader);

            // Handle the event
            switch (event.getType()) {
                case "payment_intent.succeeded": {
                    PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().getObject().get();
                    String paymentIntentId = paymentIntent.getId();

                    // Handle the successful payment intent
                    stripeService.handleSuccessfulPayment(paymentIntentId);
                    break;
                }
                // Handle other events?
                default:
                    System.out.println("Unhandled event type: " + event.getType());
            }

            return ResponseEntity.ok("");
        } catch (IOException | StripeException e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        }
    }
}
