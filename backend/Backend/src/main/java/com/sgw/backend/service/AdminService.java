package com.sgw.backend.service;

import com.sgw.backend.config.AuthenticationRequest;
import com.sgw.backend.config.AuthenticationResponse;
import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.Wallet;
import com.sgw.backend.exception.EmailAlreadyExistsException;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.repository.AdminRepository;
import com.sgw.backend.repository.WalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final JwtService jwtService;
    private final WalletService walletService;
    private final AdminRepository adminRepo ;
    private final PasswordEncoder passwordEncoder;
    private final EmailSendingService emailSendingService;


    public List<Admin> getAllAdmins() {
        return adminRepo.findAll();
    }

    // note that this addGeneralUser can add Admins, Students, etc.
    public Admin addAdmin(Admin newAdmin) throws UsernameAlreadyExistsException {
        Admin checkedAdmin = getAdminByUsername(newAdmin.getUsername());
        Admin emailCheck = adminRepo.findAdminByEmail(newAdmin.getEmail());

        if (emailCheck != null) {
            UsernameAlreadyExistsException e = new UsernameAlreadyExistsException("This email exists");
            throw e;
        }
//        // repo.save() is ambiguous as it does an update if user already exists
//        // so we will check if there is an existing user with that username
//        // if there isn't, the save() method will persist a new user
        if (checkedAdmin == null) {
            System.out.println("DOESIT FKING CM EHRE?");
            walletService.addNewWalletToUser(newAdmin);
            // setting relationship
            adminRepo.save(newAdmin);
            String email = newAdmin.getEmail();
            String password = emailSendingService.sendEmailForPassword(email, 8);
            newAdmin.setPassword(passwordEncoder.encode(password));
            adminRepo.save(newAdmin);
            return newAdmin;

        } else {
            UsernameAlreadyExistsException e = new UsernameAlreadyExistsException("This guy already exists");
            throw e;
        }

    }

    public Admin addAdminInternalUse(Admin admin) {
        walletService.addNewWalletToUser(admin);

        String password = admin.getPassword();
        admin.setPassword(passwordEncoder.encode(password));
        adminRepo.save(admin);
        return admin;
    }

    public Admin addUnlimitedAdminInternalUse(Admin admin) {
        walletService.addNewUnlimitedWalletToAdmin(admin);

        String password = admin.getPassword();
        admin.setPassword(passwordEncoder.encode(password));
        adminRepo.save(admin);
        return admin;
    }




    public Admin updateAdmin(Long id, Admin admin) throws EmailAlreadyExistsException {
        Admin temp = adminRepo.findById(id).orElse(null);

        Admin emailCheck = adminRepo.findAdminByEmail(admin.getEmail());

        if (emailCheck != null && temp.getUserId() != emailCheck.getUserId()) {
            EmailAlreadyExistsException e = new EmailAlreadyExistsException("This email exists");
            throw e;
        }

        if (temp != null) {
            temp.setUsername(admin.getUsername());
            temp.setPassword(passwordEncoder.encode(admin.getPassword()));
            temp.setName(admin.getName());
            temp.setEmail(admin.getEmail());
            adminRepo.save(temp);
            return  temp;
        }
        return null;
    }

    public Admin updateAdminNoPassword(Long id, Admin admin) throws EmailAlreadyExistsException{
        Admin temp = adminRepo.findById(id).orElse(null);

//        Admin emailCheck = adminRepo.findAdminByEmail(admin.getEmail());
//
//        if (emailCheck != null) {
//            EmailAlreadyExistsException e = new EmailAlreadyExistsException("This email exists");
//            throw e;
//        }
        if (temp != null) {
            temp.setUsername(admin.getUsername());
            temp.setName(admin.getName());
            temp.setEmail(admin.getEmail());
            adminRepo.save(temp);
            return  temp;
        }
        return null;
    }

    public void deleteAdmin(Long id) {
        Admin temp = adminRepo.findById(id).orElse(null);
        if (temp != null) {
            temp.setEnabled(false);
            adminRepo.save(temp);
        }
    }

    public void activateAdmin(Long id) {
        Admin temp = adminRepo.findById(id).orElse(null);
        if (temp != null) {
            temp.setEnabled(true);
            adminRepo.save(temp);
        }
    }

    public Admin getAdminById(Long id) {
        return adminRepo.getAdminByUserId(id);
    }

    public Admin getAdminByUsername(String username) {
        return adminRepo.getAdminByUsername(username);
    }
}
