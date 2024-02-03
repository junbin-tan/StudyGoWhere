package com.sgw.backend.entity;

public enum VoucherStatusEnum {
    UNREDEEMED, // Voucher is bought but not yet activated
    ACTIVATED, // Voucher is activated and can be redeemed (has a 15-minute window for usage)
    REDEEMED, // Voucher has been used
    EXPIRED, // Voucher wasn't used within its validity period or within the 15-minute window
}
