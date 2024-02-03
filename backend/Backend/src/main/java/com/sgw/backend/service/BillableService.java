package com.sgw.backend.service;

import com.sgw.backend.entity.Billable;
import com.sgw.backend.repository.BillableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BillableService {

    private final BillableRepository billableRepository;

    public BillableService(BillableRepository billableRepository) {
        this.billableRepository = billableRepository;
    }

    public Billable getBillableById(Long id) {
//        return billableRepository.getReferenceById(id); // removed old method, new one has clearer error message
        return billableRepository.findById(id).orElseThrow(() -> new RuntimeException("Billable of id " + id + " not found"));
    }
}
