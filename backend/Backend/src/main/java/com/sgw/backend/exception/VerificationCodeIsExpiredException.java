package com.sgw.backend.exception;

public class VerificationCodeIsExpiredException extends Exception{
    public VerificationCodeIsExpiredException(String msg) {
        super(msg);
    }
}
