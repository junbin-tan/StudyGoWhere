package com.sgw.backend.service;

import com.sgw.backend.entity.*;
import com.sgw.backend.repository.AdminRepository;
import com.sgw.backend.repository.GeneralUserRepository;
import com.sgw.backend.repository.SubscriptionTypeRepository;
import com.sgw.backend.utilities.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class SubscriptionTypeService {

    private final SubscriptionTypeRepository subscriptionTypeRepository;

    private final UserContext userContext;

    private final GeneralUserRepository generalUserRepository;

    private final AdminRepository adminRepository;


    public SubscriptionType createSubscriptionType(SubscriptionType subscriptionType) {
        Optional<Admin> optAdmin = userContext.obtainRequesterIdentity((username) -> adminRepository.getAdminByUsername(username));

        if (optAdmin.isPresent()) {
            Admin admin = optAdmin.get();
            admin.getSubscriptionTypes().add(subscriptionType);
            subscriptionType.setAdmin(admin);
            subscriptionTypeRepository.save(subscriptionType);
            return subscriptionType;
        }

        return null;
    }


    public void deleteSubscriptionType(SubscriptionType subscriptionType) {
        Optional<Admin> optAdmin = userContext.obtainRequesterIdentity((username) -> adminRepository.getAdminByUsername(username));

        if (optAdmin.isPresent()) {
            Admin admin = optAdmin.get();
            admin.getSubscriptionTypes().remove(subscriptionType);
            adminRepository.save(admin);
            subscriptionTypeRepository.delete(subscriptionType);
        }
    }

    public SubscriptionType updateSubscriptionType(SubscriptionType subscriptionType) {
        Optional<SubscriptionType> oldSubscriptionType = subscriptionTypeRepository.findById(subscriptionType.getSubscriptionTypeId());

        if (oldSubscriptionType.isPresent()) {
            SubscriptionType update = oldSubscriptionType.get();
            update.setSubscriptionTypeName(subscriptionType.getSubscriptionTypeName());
            update.setSubscriptionTypeVenueLimit(subscriptionType.getSubscriptionTypeVenueLimit());
            update.setSubscriptionTypePrice(subscriptionType.getSubscriptionTypePrice());
            update.setSubscriptionTypeDuration(subscriptionType.getSubscriptionTypeDuration());
            update.setSubscriptionTypeDetails(subscriptionType.getSubscriptionTypeDetails());
            update.setSubscriptionTypeStatusEnum(subscriptionType.getSubscriptionTypeStatusEnum());

            return update;
        }
        return null;
    }

    public List<SubscriptionType> getAllSubscriptionType() {
        return subscriptionTypeRepository.findAll();
    }

    public List<SubscriptionType> getAllActiveSubscriptionType() {
        return subscriptionTypeRepository.findSubscriptionTypesBySubscriptionTypeStatusEnum(SubscriptionTypeStatusEnum.ACTIVATED);
    }


    public SubscriptionType getSubscriptionTypeById(Long id) {
        return subscriptionTypeRepository.findById(id).orElse(null);
    }

    public SubscriptionType activateDeactivateSubscriptionTypeById(Long id) {
        SubscriptionType subscriptionType = subscriptionTypeRepository.findById(id).orElse(null);
        if (subscriptionType == null) {
            return null;
        }
        if (subscriptionType.getSubscriptionTypeStatusEnum().equals(SubscriptionTypeStatusEnum.ACTIVATED)) {
            subscriptionType.setSubscriptionTypeStatusEnum(SubscriptionTypeStatusEnum.DEACTIVATED);
        } else if (subscriptionType.getSubscriptionTypeStatusEnum().equals(SubscriptionTypeStatusEnum.DEACTIVATED)) {
            subscriptionType.setSubscriptionTypeStatusEnum(SubscriptionTypeStatusEnum.ACTIVATED);
        }

        subscriptionTypeRepository.save(subscriptionType);
        return subscriptionType;
    }




}
