package com.sgw.backend.entity;

import jakarta.persistence.Entity;

@Entity
public class TopUp extends Billable {
    @Override
   public String getLabel() {
       return super.getBillableName();
   }
}
