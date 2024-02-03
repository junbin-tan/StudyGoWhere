package com.sgw.backend.repository;

import com.sgw.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // maybe we want to use CrudRepository, do more research later

    // this is the magical part, just define the method; as long as the method name matches a certain pattern it will
    // automatically be created accordingly
    Admin getAdminByUserId(Long userId);
    Admin getAdminByUsername(String username);

    Admin findAdminByEmail(String email);

}

