package com.sgw.backend.exception;

public class NoTablesAvailableException extends RuntimeException {
    public NoTablesAvailableException(String message) {
        super(message);
    }
}
