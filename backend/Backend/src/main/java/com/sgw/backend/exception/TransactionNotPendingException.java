package com.sgw.backend.exception;

public class TransactionNotPendingException extends Exception {
    public TransactionNotPendingException(String msg) {
        super(msg);
    }
}
