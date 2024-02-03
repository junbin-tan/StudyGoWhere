package com.sgw.backend.repository;

import com.sgw.backend.entity.SubscriptionType;
import com.sgw.backend.entity.SubscriptionTypeStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionTypeRepository extends JpaRepository<SubscriptionType, Long> {
    List<SubscriptionType> findSubscriptionTypeByAdminUserId(Long adminId);

    List<SubscriptionType> findSubscriptionTypesBySubscriptionTypeStatusEnum(SubscriptionTypeStatusEnum statusEnum);
}
