package com.sgw.backend.repository;

import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.Ticket;
import com.sgw.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    // maybe we want to use CrudRepository, do more research later

    // this is the magical part, just define the method; as long as the method name matches a certain pattern it will
    // automatically be created accordingly
    Transaction getTransactionByTransactionId(Long id);

}

