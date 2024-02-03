package com.sgw.backend.entity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long transactionDetailId;

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    // Store all the billables (items) created from a transaction
    @OneToMany(mappedBy = "transactionDetail", cascade = CascadeType.ALL)
    private List<Billable> billables = new ArrayList<>();

    /*
     * This method aggregates the billables by class, and returns a map of the
     * billable class and the number of billables of that class
     */
    public Map<String, Integer> aggregateBillablesByClass() {
        if (billables == null) {
            return Collections.emptyMap();
        }

        return billables.stream()
                .collect(Collectors.groupingBy(Billable::getBillableName, Collectors.summingInt(b -> 1)));
    }

}
