package com.sgw.backend.exception;

public class VenueDoesNotBelongToRequesterException extends RuntimeException {

    public VenueDoesNotBelongToRequesterException(String msg) {
        super(msg);
    }
}
