package com.sgw.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sgw.backend.entity.MenuSection;

public interface MenuSectionRepository extends JpaRepository<MenuSection, Long> {
}