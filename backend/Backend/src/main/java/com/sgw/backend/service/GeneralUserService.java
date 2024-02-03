package com.sgw.backend.service;

import com.sgw.backend.entity.GeneralUser;
import com.sgw.backend.repository.GeneralUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GeneralUserService {

    private final GeneralUserRepository userRepo;

    public GeneralUserService(GeneralUserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public List<GeneralUser> getAllGeneralUsers() {
        return userRepo.findAll();
    }

    // note that this addGeneralUser can add Admins, Students, etc.
    public void addGeneralUser(GeneralUser generalUser) {
        // this one is slightly ambiguous because it updates if there is already an existing user
        userRepo.save(generalUser);
    }

    public GeneralUser getGeneralUserById(Long id) {
        return userRepo.getGeneralUserByUserId(id);
    }

    public GeneralUser getGeneralUserByUsername(String username) {
        return userRepo.getGeneralUserByUsername(username);
    }
}
