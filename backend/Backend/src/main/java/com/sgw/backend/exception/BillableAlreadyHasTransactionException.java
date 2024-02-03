package com.sgw.backend.exception;

public class BillableAlreadyHasTransactionException extends Exception {

    public BillableAlreadyHasTransactionException(String msg) {
        super(msg);
    }
}
