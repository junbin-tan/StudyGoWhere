package com.sgw.backend.controller;

import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.Owner;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.service.AdminService;
import com.sgw.backend.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    // needs to be final for annotations to use variables
//    private final String baseAddress = "admin";

    @Autowired
    private OwnerService ownerService;

    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @PostMapping
    public ResponseEntity<Admin> postAdmin(@RequestBody Admin admin) {
        try {
            adminService.addAdmin(admin);
            return ResponseEntity.ok(admin);
        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            return ResponseEntity.badRequest().build();
            // return some error request to client
        } catch (Exception e) {
            System.out.println("something happened");
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/{id}")
    public Admin getAdminById(@PathVariable("id") Long id) {
        // need to catch exception here? maybe if user doesnt exist
        try {
            return adminService.getAdminById(id);
        } catch (Exception e) {
            // will make custom exception later
            System.out.println("User with id " + id + " does not exist");
            // return some error request to client
        }

        // placeholder
        return null;
    }


    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin admin) {
        try{
            return ResponseEntity.ok(adminService.updateAdmin(id, admin));
        } catch (Exception e){
            return ResponseEntity.notFound().build();
        }

    }

    @PutMapping("/updateadminnopassword/{id}")
    public ResponseEntity<Admin> updateAdminNoPassword(@PathVariable Long id, @RequestBody Admin admin) {
        try {
            return ResponseEntity.ok(adminService.updateAdminNoPassword(id, admin));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
    }

    @PutMapping("/activateadmin/{id}")
    public void activateAdmin(@PathVariable Long id) {
        adminService.activateAdmin(id);
    }

    @GetMapping("/getLoginAdmin")
    public Admin getAdminByToken() {
        Admin adminUser = (Admin) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Admin realAdmminUserObject = adminService.getAdminByUsername(adminUser.getUsername());
        return realAdmminUserObject;
    }



}