package com.sgw.backend.exception;

public class UsernameAlreadyExistsException extends Exception {

    public UsernameAlreadyExistsException(String msg) {
        super(msg);
    }
}
