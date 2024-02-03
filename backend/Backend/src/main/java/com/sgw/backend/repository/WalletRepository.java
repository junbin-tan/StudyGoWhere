package com.sgw.backend.repository;

import com.sgw.backend.entity.Transaction;
import com.sgw.backend.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    public Optional<Wallet> findWalletByGeneralUser_Username(@Param("username") String username);
}

