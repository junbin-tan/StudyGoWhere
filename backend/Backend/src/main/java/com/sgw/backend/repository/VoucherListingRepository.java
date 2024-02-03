package com.sgw.backend.repository;

import com.sgw.backend.entity.Voucher;
import com.sgw.backend.entity.VoucherListing;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VoucherListingRepository extends JpaRepository<VoucherListing, Long> {
    List<VoucherListing> findByOwnerUserId(Long userId);
    List<VoucherListing> findByOwnerUsername(String username);
    @Query("SELECT vl FROM VoucherListing vl JOIN vl.vouchers v WHERE v = :voucher")
    VoucherListing findByVoucher(@Param("voucher") Voucher voucher);

    @Query("SELECT vl FROM VoucherListing vl JOIN vl.vouchers v WHERE v.billableId = :voucherId")
    VoucherListing findByVoucherId(@Param("voucherId") Long voucherId);
}
