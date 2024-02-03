package com.sgw.backend.exception;

public class UserIsDisabledException extends  Exception{

    public UserIsDisabledException(String msg){
        super(msg);
    };
}
