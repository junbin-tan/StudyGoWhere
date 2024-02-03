package com.sgw.backend.controller;

import com.sgw.backend.entity.Subscription;
import com.sgw.backend.entity.SubscriptionType;
import com.sgw.backend.exception.InvalidUserException;
import com.sgw.backend.exception.NotEnoughMoneyInWalletException;
import com.sgw.backend.exception.UserHasSubscriptionException;
import com.sgw.backend.misc.SchedulerComponent;
import com.sgw.backend.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    private final SchedulerComponent schedulerComponent;

    @PostMapping("/owner/subscription/create")
    public ResponseEntity<?> createSubscription(@Valid @RequestBody SubscriptionType sbt) {
        try {
            return ResponseEntity.ok(subscriptionService.createSubscription(sbt));
        } catch (UserHasSubscriptionException e) {
            // put the queue subscription here
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NotEnoughMoneyInWalletException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/owner/subscriptionpage/create")
    public ResponseEntity<?> createSubscriptionSubscriptionPage(@Valid @RequestBody SubscriptionType sbt) {
        try {
            return ResponseEntity.ok(subscriptionService.createSubscriptionForInternal(sbt));
        } catch (UserHasSubscriptionException e) {
            // put the queue subscription here
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NotEnoughMoneyInWalletException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/owner/subscriptionforowner")
    public ResponseEntity<Subscription> getSubscription() {
        return subscriptionService.findAssociatedSubscription().map(s -> ResponseEntity.ok(s))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/owner/subscription/queue")
    public ResponseEntity<Subscription> queueNextMonthSubscription(@Valid @RequestBody SubscriptionType type) {
        if (subscriptionService.queueNextSubscription(type)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
}
