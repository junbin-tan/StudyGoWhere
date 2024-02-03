package com.sgw.backend.controller;

import com.sgw.backend.entity.GeneralUser;
import com.sgw.backend.service.GeneralUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class GeneralUserController {

    @Autowired
    private GeneralUserService generalUserService;

    // needs to be final for annotations to use variables
    private final String baseAddress = "generalUser";

    @GetMapping(value = baseAddress)
    public List<GeneralUser> getAllGeneralUsers() {
        return generalUserService.getAllGeneralUsers();
    }

    @PostMapping(value = baseAddress + "/post")
    public GeneralUser postGeneralUser(@RequestBody GeneralUser generalUser) {
        generalUserService.addGeneralUser(generalUser);
        return generalUser;
    }

    @GetMapping(value = baseAddress + "/{id}")
    public GeneralUser getGeneralUserById(@PathVariable("id") Long id) {
        // need to catch exception here? maybe if user doesnt exist
        try {
            return generalUserService.getGeneralUserById(id);
        } catch (Exception e) {
            System.out.println("User with id " + id + " does not exist");
            // return some error request to client
        }

        // placeholder
        return null;
    }
}