package com.sgw.backend.exception;

public class UserDoesNotExistException  extends Exception {
    public UserDoesNotExistException(String msg) {
        super(msg);
    }
}
