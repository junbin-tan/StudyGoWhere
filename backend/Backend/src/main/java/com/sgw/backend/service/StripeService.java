package com.sgw.backend.service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgw.backend.entity.*;
import com.sgw.backend.repository.BillableRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgw.backend.repository.WalletRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

@Service
@Transactional
@AllArgsConstructor
public class StripeService {

    private final WalletRepository walletRepository;
    private final StudentService studentService;
    private final OwnerService ownerService;
    private final TransactionService transactionService;
    private final BillableRepository billableRepository;

    public List<Wallet> getAllWallets() {
        return walletRepository.findAll();
    }

    public Wallet getWalletById(Long id) {
        return walletRepository.getReferenceById(id);
    }

    // Temporary method for SR1 (will use transaction & billable in future)
    /*
     * @Params student: student to top up
     * 
     * @Params amount: amount in cents to top up (e.g. SGD$10.00 = 1000)
     * 
     * @Returns a map containing the client secret for the payment intent (stripe)
     */
    public Map<String, Object> createPaymentIntentWithStripe(Student student, int amount) throws StripeException {

        // Create a payment intent with Stripe
        Map<String, Object> paymentIntentParams = new HashMap<>();
        paymentIntentParams.put("amount", amount);
        paymentIntentParams.put("currency", "sgd");

        // Possible to change to allow card & paynow but low priority
        Map<String, Object> automaticPaymentMethods = new HashMap<>();
        automaticPaymentMethods.put("enabled", true);
        automaticPaymentMethods.put("allow_redirects", "never");
        paymentIntentParams.put("automatic_payment_methods",
                automaticPaymentMethods);

        // Add metadata to payment intent
        Map<String, String> metadata = new HashMap<>();
        metadata.put("student_id", String.valueOf(student.getUserId()));
        paymentIntentParams.put("metadata", metadata);

        // Create a payment intent.
        PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams);

        // Return the client secret to the frontend.
        Map<String, Object> response = new HashMap<>();
        response.put("client_secret", paymentIntent.getClientSecret());

        return response;
    }

    public Map<String, Object> createPaymentIntentWithStripeForOwner(Owner owner, int amount) throws StripeException {

        // Create a payment intent with Stripe
        Map<String, Object> paymentIntentParams = new HashMap<>();
        paymentIntentParams.put("amount", amount);
        paymentIntentParams.put("currency", "sgd");

        // Possible to change to allow card & paynow but low priority
        Map<String, Object> automaticPaymentMethods = new HashMap<>();
        automaticPaymentMethods.put("enabled", true);
        automaticPaymentMethods.put("allow_redirects", "never");
        paymentIntentParams.put("automatic_payment_methods",
                automaticPaymentMethods);

        // Add metadata to payment intent
        Map<String, String> metadata = new HashMap<>();
        metadata.put("owner_id", String.valueOf(owner.getUserId()));
        paymentIntentParams.put("metadata", metadata);

        // Create a payment intent.
        PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams);

        // Return the client secret to the frontend.
        Map<String, Object> response = new HashMap<>();
        response.put("client_secret", paymentIntent.getClientSecret());

        // this response is not an actual HTTP "response", this is a Map<String,Object>
        return response;
    }

    // On successful payment intent notification from stripe webhook,
    // update associated student wallet balance
    public void handleSuccessfulPayment(String paymentIntentId) {
        try {
            // Retrieve the PaymentIntent
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            // Retrieve owner / student
            String studentIdStr = paymentIntent.getMetadata().get("student_id");

            if (studentIdStr != null) {
                Student student = studentService.getStudentById(Long.parseLong(studentIdStr));
                Wallet studentWallet = student.getWallet();

                // Update the wallet balance
                BigDecimal amount = new BigDecimal(paymentIntent.getAmount());
//                BigDecimal newWalletBalance = studentWallet.getWalletBalance().add(amount);
//                studentWallet.setWalletBalance(newWalletBalance);

                TopUp topup = new TopUp();
                topup.setBillablePrice(amount);
                topup.setBillableName("TOP-UP");

                // Save the wallet
                walletRepository.save(studentWallet);
                transactionService.topUpTransactionRecord(generateTopup(amount), studentWallet);
            } else {
                Long ownerId = Long.parseLong(paymentIntent.getMetadata().get("owner_id"));
                Owner owner = ownerService.getOwnerById(ownerId);
                Wallet ownerWallet = owner.getWallet();

                BigDecimal amount = new BigDecimal(paymentIntent.getAmount());
//                BigDecimal newWalletBalance = ownerWallet.getWalletBalance().add(amount);
//                ownerWallet.setWalletBalance(newWalletBalance);

                walletRepository.save(ownerWallet);
                transactionService.topUpTransactionRecord(generateTopup(amount), ownerWallet);
            }

        } catch (StripeException e) {
            System.out.println("StripeException occurred in StripeService handleSuccessfulPayment");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("Other exception occurred in StripeService handleSuccessfulPayment");
            e.printStackTrace();
        }
    }
    public TopUp generateTopup(BigDecimal amount) {
        TopUp topup = new TopUp();
        topup.setBillablePrice(amount);
        topup.setBillableName("TOP-UP");
        billableRepository.saveAndFlush(topup);
        return topup;
    }

}
