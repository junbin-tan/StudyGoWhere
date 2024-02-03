package com.sgw.backend.controller;

import com.sgw.backend.dto.FullTransactionDTO;
import com.sgw.backend.dto.PartialTransactionDTO;
import com.sgw.backend.entity.Ticket;
import com.sgw.backend.exception.BillableAlreadyHasTransactionException;
import com.sgw.backend.exception.InvalidTransactionException;
import com.sgw.backend.exception.PayerBalanceInsufficientException;
import com.sgw.backend.exception.TransactionNotPendingException;
import com.sgw.backend.service.MapperService;
import com.sgw.backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.apache.naming.TransactionRef;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionService transactionService;

    private final MapperService mapperService;

    @GetMapping("/owner/transactions")
    public ResponseEntity<List<PartialTransactionDTO>> getAllTransactionsOwner() {
        return ResponseEntity.ok(transactionService.getAllTransactionsForOwner().stream()
                .map(mapperService::toPartialTransactionDTO).collect(Collectors.toList()));
    }
    @GetMapping("/admin/own-transactions")
    public ResponseEntity<List<PartialTransactionDTO>> getOwnTransactionsAdmin() {
        return ResponseEntity.ok(transactionService.getAllTransactionsForAdmin().stream()
                .map(mapperService::toPartialTransactionDTO).collect(Collectors.toList()));
    }
    @GetMapping("/student/own-transactions")
    public ResponseEntity<List<PartialTransactionDTO>> getOwnTransactionsStudent() {
        return ResponseEntity.ok(transactionService.getAllTransactionForStudent().stream()
                .map(mapperService::toPartialTransactionDTO).collect(Collectors.toList()));
    }

    @GetMapping("/admin/transactions")
    public ResponseEntity<List<PartialTransactionDTO>> getAllTransactionsAdmin() {
        return ResponseEntity.ok(transactionService.getAllTransactions().stream()
                .map(mapperService::toPartialTransactionDTO).collect(Collectors.toList()));
    }
    @GetMapping("/admin/transactions/{id}")
    public ResponseEntity<FullTransactionDTO> getAllTransactionsAdmin(@PathVariable("id") Long id) {
        return Optional.ofNullable(transactionService.getTransactionById(id))
                .map(mapperService::toFullTransactionDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/admin/transaction/refund")
    public ResponseEntity<FullTransactionDTO> refundTransaction(@RequestBody TransactionRefundDTO dto) {
        try {
            transactionService.refundTransaction(dto.transactionId, dto.refundReason);
            return ResponseEntity.ok().build();
        } catch (BillableAlreadyHasTransactionException | PayerBalanceInsufficientException | TransactionNotPendingException e) {
            return ResponseEntity.badRequest().build();
        } catch (InvalidTransactionException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/owner/transactions/{id}")
    public ResponseEntity<FullTransactionDTO> getAllTransactionsOwner(@PathVariable("id") Long id) {
        return Optional.ofNullable(transactionService.getTransactionById(id))
                .map(mapperService::toFullTransactionDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/admin/wallet-balance")
    public ResponseEntity<BigDecimal> getWalletBalance() {
        return transactionService.getWalletBalance().map(wb -> ResponseEntity.ok(wb)).orElse(ResponseEntity.notFound().build());
    }
    @PostMapping("/admin/refund")
    public ResponseEntity<BigDecimal> refundAmount(@RequestBody RefundDTO dto) throws BillableAlreadyHasTransactionException, PayerBalanceInsufficientException, TransactionNotPendingException {
            transactionService.giveRefund(dto.amt, dto.refundReason, dto.userId);
            return ResponseEntity.ok().build();
    }
    public record RefundDTO(String refundReason, BigDecimal amt, Long userId){}
    public record TransactionRefundDTO(String refundReason, BigDecimal amt, Long transactionId){}

}
