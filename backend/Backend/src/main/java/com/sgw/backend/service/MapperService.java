package com.sgw.backend.service;

import com.sgw.backend.dto.BillableDTO;
import com.sgw.backend.dto.FullTransactionDTO;
import com.sgw.backend.dto.PartialTransactionDTO;
import com.sgw.backend.entity.Billable;
import com.sgw.backend.entity.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
public class MapperService {
    public PartialTransactionDTO toPartialTransactionDTO(Transaction transaction) {
        return new PartialTransactionDTO(
                transaction.getTransactionId(),
                transaction.getPayerWallet().getGeneralUser().getUsername(),
                transaction.getReceiverWallet().getGeneralUser().getUsername(),
                generateTotalPrice(transaction),
                transaction.getCreatedTime(),
                transaction.getTransactionStatus(),
                transaction.getRefunded()
        );
    }

    public BigDecimal generateTotalPrice(Transaction transaction) {
        return Optional.ofNullable(transaction.getBillable())
                .map(Billable::getBillablePrice)
                .orElse(totalTransactionDetails(transaction));
    }

    private BigDecimal totalTransactionDetails(Transaction transaction) {
        return transaction.getTransactionDetails().stream().flatMap(d -> d.getBillables().stream())
                .map(Billable::getBillablePrice).reduce(BigDecimal.ZERO, (x,y) -> x.add(y));
    }

    public FullTransactionDTO toFullTransactionDTO(Transaction transaction) {
        return new FullTransactionDTO(
                transaction.getTransactionId(),
                transaction.getPayerWallet().getGeneralUser().getUsername(),
                transaction.getReceiverWallet().getGeneralUser().getUsername(),
                generateTotalPrice(transaction),
                transaction.getCreatedTime(),
                generateBillableDTOs(transaction),
                transaction.getTransactionStatus(),
                transaction.getRefunded()
        );
    }

    private List<BillableDTO> generateBillableDTOs(Transaction transaction) {
        List<BillableDTO> billableDTOList = new ArrayList<>();
        if (!transaction.getTransactionDetails().isEmpty()) {
            billableDTOList = transaction.getTransactionDetails().stream()
                    .flatMap(td -> td.getBillables().stream())
                    .map(b -> new BillableDTO(
                            b.getBillableId(),
                            b.getLabel(),
                            b.getBillablePrice()
                    )).toList();
        } else {
            log.info("CORRECT");
            Billable b = transaction.getBillable();
            BillableDTO dto = new BillableDTO(
                    b.getBillableId(),
                    b.getLabel(),
                    b.getBillablePrice()
            );
            billableDTOList.add(dto);
        }
        log.info("ENDING SIZE " + billableDTOList.size());
        return billableDTOList;
    }
}
