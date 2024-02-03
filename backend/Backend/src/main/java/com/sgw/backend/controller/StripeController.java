package com.sgw.backend.controller;

import java.util.Map;

import com.sgw.backend.entity.Owner;
import com.sgw.backend.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.sgw.backend.entity.Student;
import com.sgw.backend.service.StripeService;
import com.sgw.backend.service.StudentService;
import com.stripe.exception.StripeException;

@RestController
@RequestMapping("/public/api/stripe")
public class StripeController {
    @Autowired
    private StripeService stripeService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private OwnerService ownerService;

    @PostMapping("/payment/{studentId}")
    public ResponseEntity<?> handlePaymentIntent(@PathVariable long studentId, @RequestBody JsonNode body) {
        int amount = body.get("amount").asInt();
        try {
            Student student = studentService.getStudentById(studentId);
            Map<String, Object> response = stripeService.createPaymentIntentWithStripe(student, amount);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/payment/owner/{ownerId}")
    public ResponseEntity<?> handlePaymentIntentForOwner(@PathVariable long ownerId, @RequestBody JsonNode body) {
        int amount = body.get("amount").asInt();
        try {
            Owner owner = ownerService.getOwnerById(ownerId);
            Map<String, Object> response = stripeService.createPaymentIntentWithStripeForOwner(owner, amount);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
