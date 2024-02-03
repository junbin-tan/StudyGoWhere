package com.sgw.backend.exception;

public class UserIsNotVerifiedException extends Exception{
    public UserIsNotVerifiedException(String msg) {
        super(msg);
    }
}
