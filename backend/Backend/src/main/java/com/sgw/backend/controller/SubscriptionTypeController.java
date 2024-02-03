package com.sgw.backend.controller;

import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.SubscriptionType;
import com.sgw.backend.service.AdminService;
import com.sgw.backend.service.SubscriptionTypeService;
import jakarta.validation.Valid;
import org.hibernate.engine.transaction.jta.platform.internal.SunOneJtaPlatform;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value="/subscriptiontype")
public class SubscriptionTypeController {
    @Autowired
    private AdminService adminService;

    @Autowired
    private SubscriptionTypeService subscriptionTypeService;


    @GetMapping
    public List<SubscriptionType> getAllSubscriptionType() {
        return subscriptionTypeService.getAllSubscriptionType();
    }

    @GetMapping ("/activeOnly")
    public List<SubscriptionType> getAllActiveSubscriptionType() {
        return subscriptionTypeService.getAllActiveSubscriptionType();
    }


    @PostMapping
    public ResponseEntity<SubscriptionType> createSubscriptionType(@Valid @RequestBody SubscriptionType sb) {
        SubscriptionType finalsb = subscriptionTypeService.createSubscriptionType(sb);
        if (finalsb != null) {
            return ResponseEntity.ok(finalsb);
        } else {
            return  ResponseEntity.notFound().build();
        }

    }

    @GetMapping("/{id}")
    public SubscriptionType getSubTypeById(@PathVariable("id") Long id) {
        return subscriptionTypeService.getSubscriptionTypeById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionType> updateSubscriptionType(@PathVariable Long id, @RequestBody SubscriptionType subscriptionType){
        SubscriptionType finalsb = subscriptionTypeService.updateSubscriptionType(subscriptionType);
        if (finalsb != null) {
            return ResponseEntity.ok(finalsb);
        } else {
            return  ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/activateDeactivateSubscriptionType/{id}")
    public void activateDeactivateSubType(@PathVariable Long id) { subscriptionTypeService.activateDeactivateSubscriptionTypeById(id);}


    @DeleteMapping("/{id}")
    public void deleteSubsType(@PathVariable Long id) {
        SubscriptionType thisSb = subscriptionTypeService.getSubscriptionTypeById(id);
        subscriptionTypeService.deleteSubscriptionType(thisSb);
    }





}
