package com.sgw.backend.repository;

import com.sgw.backend.entity.Voucher;
import com.sgw.backend.entity.VoucherStatusEnum;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Voucher findByVoucherCode(String voucherCode);

    List<Voucher> findAllByVoucherStatusEnum(VoucherStatusEnum voucherStatusEnum);
}
