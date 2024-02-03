package com.sgw.backend.repository;

import com.sgw.backend.entity.TransactionDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sgw.backend.entity.MenuItemBillable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MenuItemBillableRepository extends JpaRepository<MenuItemBillable, Long> {

    @Query("SELECT DISTINCT mib.transactionDetail FROM MenuItemBillable mib " +
            "JOIN mib.menuItem mi " +
            "JOIN mi.menuSection ms " +
            "JOIN ms.menu m " +
            "JOIN m.venue v " +
            "WHERE v.venueId = :venueId AND mib.transactionDetail.transaction.transactionStatus=PENDING")
    public List<TransactionDetail> findByVenueId(Long venueId);

}
