package com.sgw.backend.exception;

public class OperatorUsernameAlreadyTakenException extends RuntimeException {
    public OperatorUsernameAlreadyTakenException (String message) {
        super(message);
    }
}
