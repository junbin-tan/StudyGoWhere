package com.sgw.backend.repository;

import com.sgw.backend.entity.GeneralUser;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneralUserRepository extends JpaRepository<GeneralUser, Long> {
    // maybe we want to use CrudRepository, do more research later

    // this is the magical part, just define the method; as long as the method name
    // matches a certain pattern it will
    // automatically be created accordingly
    public GeneralUser getGeneralUserByUserId(Long userId);

    public GeneralUser getGeneralUserByUsername(String username);

}
