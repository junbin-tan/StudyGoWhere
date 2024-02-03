package com.sgw.backend.exception;

public class UserHasSubscriptionException  extends  RuntimeException{
    public UserHasSubscriptionException(String m) {
        super(m);
    }
}
