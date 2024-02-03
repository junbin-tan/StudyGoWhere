package com.sgw.backend.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgw.backend.entity.Voucher;
import com.sgw.backend.service.VoucherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @PostMapping("/student/activatevoucher/{voucherId}")
    public ResponseEntity<Object> activateVoucher(@PathVariable Long voucherId) {
        try {
            Voucher voucher = voucherService.activateVoucher(voucherId);
            System.out.println("Voucher activated: " + voucher.getVoucherCode());
            return ResponseEntity.ok(voucher);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .badRequest()
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @PostMapping(value = { "/owner/usevoucher/{voucherCode}", "/student/usevoucher/{voucherCode}" })
    public ResponseEntity<String> useVoucher(@PathVariable String voucherCode) {
        try {
            voucherService.validateVoucherForUse(voucherCode);
            return ResponseEntity.ok("Voucher is valid for use.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/owner/getvoucherbycode/{voucherCode}")
    public ResponseEntity<?> getVoucherByVoucherCode(@PathVariable String voucherCode) {
        try {
            Voucher fetchedVoucher = voucherService.getVoucherByVoucherCode(voucherCode);
            if (fetchedVoucher == null) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.ok(fetchedVoucher);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }

    }

    @GetMapping("/student/getallvouchers/{studentId}")
    public ResponseEntity<List<Voucher>> getAllVouchersForStudent(@PathVariable Long studentId) {
        try {
            List<Voucher> vouchers = voucherService.getAllVouchersByStudent(studentId);
            if (vouchers.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(vouchers);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
