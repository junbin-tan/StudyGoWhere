package com.sgw.backend.exception;

public class NotEnoughMoneyInWalletException extends RuntimeException{
    public NotEnoughMoneyInWalletException(String m) {
        super(m);
    }
}
