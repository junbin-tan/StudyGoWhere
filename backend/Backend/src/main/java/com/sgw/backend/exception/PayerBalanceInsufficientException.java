package com.sgw.backend.exception;

public class PayerBalanceInsufficientException extends Exception {

    public PayerBalanceInsufficientException(String msg) {
        super(msg);
    }
}
