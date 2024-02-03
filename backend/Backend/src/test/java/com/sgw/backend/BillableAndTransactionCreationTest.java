package com.sgw.backend;

import com.sgw.backend.entity.*;
import com.sgw.backend.exception.BillableAlreadyHasTransactionException;
import com.sgw.backend.exception.PayerBalanceInsufficientException;
import com.sgw.backend.exception.TransactionNotPendingException;
import com.sgw.backend.service.*;
import net.minidev.json.JSONUtil;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Tests for Billables and Transactions
 *
 * I advise strongly not to do it this way with @TestMethodOrder with specific
 * Transactional methods
 * The non-Transactional methods have given me a lot of headaches and I don't
 * think I'm doing this again
 */
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BillableAndTransactionCreationTest {
        @Autowired
        AdminService adminService;
        @Autowired
        StudentService studentService;
        @Autowired
        TransactionService transactionService;
        @Autowired
        VoucherService voucherService;
        @Autowired
        OwnerService ownerService;

        @Test
        @Order(1)
        public void createUsersAndWallets() {
                Admin adminUser = new Admin("adminFoo", "password");
                Student sUser = new Student("studentFoo", "password");
                Owner oUser = new Owner("ownerFoo", "password");

                Assertions.assertDoesNotThrow(() -> adminService.addAdmin(adminUser));
                Assertions.assertDoesNotThrow(() -> studentService.addStudent(sUser));
                Assertions.assertDoesNotThrow(() -> ownerService.addOwner(oUser));

                Admin fetchedAdmin = adminService.getAdminByUsername("adminFoo");
                Wallet adminWallet = fetchedAdmin.getWallet();
                Assertions.assertNotNull(adminWallet);

                Student fetchedStudent = studentService.getStudentByUsername("studentFoo");
                Wallet studentWallet = fetchedStudent.getWallet();
                Assertions.assertNotNull(studentWallet);

        }

        @Test
        @Order(2)
        public void createBillables() {
                Voucher v = new Voucher();
                v.setBillablePrice(BigDecimal.TEN);
                voucherService.addVoucher(v);
                Voucher v2 = new Voucher();
                v2.setBillablePrice(BigDecimal.TEN);
                voucherService.addVoucher(v2);
                Assertions.assertDoesNotThrow(() -> voucherService.getVoucherById((long) 1));
                Assertions.assertDoesNotThrow(() -> voucherService.getVoucherById((long) 2));
        }

        /**
         * tests if the previous 2 tests persisted objects into database
         */
        @Test
        @Order(3)
        public void testIfIsNotTransactional() {
                Assertions.assertNotNull(adminService.getAdminByUsername("adminFoo"));
                List<Voucher> allVouchers = voucherService.getAllVouchers();
                Assertions.assertNotNull(allVouchers.get(0));
        }

        /**
         * please take note this Transaction object we are talking about is a
         * StudyGoWhere Transaction, not the technical JTA (java transaction api)
         * Transaction
         * 
         * @throws PayerBalanceInsufficientException
         */
        @Test
        @Transactional
        // @Rollback(false)
        @Order(4)
        public void create2TransactionsThenCompleteAndCancelTest() throws PayerBalanceInsufficientException,
                        TransactionNotPendingException, BillableAlreadyHasTransactionException {

                // ** SETTING UP - fetching previously added Admin, Student and Voucher **
                Admin fetchedAdmin = adminService.getAdminByUsername("adminFoo");
                Wallet adminWallet = fetchedAdmin.getWallet();
                Assertions.assertNotNull(adminWallet);
                adminWallet.setWalletBalance(BigDecimal.TEN.add(BigDecimal.ONE));

                Student fetchedStudent = studentService.getStudentByUsername("studentFoo");
                Wallet studentWallet = fetchedStudent.getWallet();
                Assertions.assertNotNull(studentWallet);

                Voucher fetchedVoucher = voucherService.getVoucherById((long) 1);
                Voucher fetchedVoucher2 = voucherService.getVoucherById((long) 2);
                Assertions.assertNotNull(fetchedVoucher2);

                // need to use compareTo method instead of passing 2 bigdecimals as arguments
                // sidenote: this is the part that requires @Transactional, because
                // fetchedVoucher's billablePrice is lazily fetched
                Assertions.assertEquals(BigDecimal.TEN.compareTo(fetchedVoucher.getBillablePrice()), 0);

                // ** FIRST TRANSACTION CREATION TEST **
                Transaction transactionOne = transactionService.createAndAddTransaction(fetchedVoucher, adminWallet,
                                studentWallet);
                Long transactionId = transactionOne.getTransactionId();
                // fetching transaction
                Transaction fetchedTransactionOne = transactionService.getTransactionById(transactionId);
                Assertions.assertNotNull(fetchedTransactionOne);
                Assertions.assertEquals(fetchedTransactionOne.getTransactionStatus(), TransactionStatusEnum.PENDING);

                // Check if Admin's wallet balance is now $1, since 11 - 10 = 1
                Assertions.assertEquals(adminWallet.getWalletBalance().compareTo(BigDecimal.ONE), 0);
                // Check if student's wallet balance has not increased. It should not increase
                // since transaction is pending
                Assertions.assertEquals(studentWallet.getWalletBalance().compareTo(BigDecimal.ZERO), 0);

                System.out.println(
                                "Transaction creation success, values of admin & student wallets are as expected (admin: "
                                                + adminWallet.getWalletBalance() + ", student: "
                                                + studentWallet.getWalletBalance() + ")");

                // ** CANCELLING transactionOne **
                transactionService.cancelATransaction(fetchedTransactionOne);
                Assertions.assertEquals(fetchedTransactionOne.getTransactionStatus(), TransactionStatusEnum.CANCELLED);
                // check Wallet walletBalances
                Assertions.assertNotEquals(adminWallet.getWalletBalance().compareTo(BigDecimal.ONE), 0);
                Assertions.assertEquals(adminWallet.getWalletBalance().compareTo(BigDecimal.ONE.add(BigDecimal.TEN)),
                                0);
                Assertions.assertEquals(studentWallet.getWalletBalance().compareTo(BigDecimal.ZERO), 0);

                System.out.println(
                                "Cancelling transaction success, values of admin & student wallets are as expected (admin: "
                                                + adminWallet.getWalletBalance() + ", student: "
                                                + studentWallet.getWalletBalance() + ")");

                // ** CREATING and COMPLETING transactionTwo **
                Transaction transactionTwo = transactionService.createAndAddTransaction(fetchedVoucher2, adminWallet,
                                studentWallet);
                transactionService.completeATransaction(transactionTwo);

                Assertions.assertEquals(adminWallet.getWalletBalance().compareTo(BigDecimal.ONE), 0);
                Assertions.assertEquals(studentWallet.getWalletBalance().compareTo(BigDecimal.TEN), 0);
                System.out.println(
                                "Completing creation success, values of admin & student wallets are as expected (admin: "
                                                + adminWallet.getWalletBalance() + ", student: "
                                                + studentWallet.getWalletBalance() + ")");

                // ** CHECK WALLET AND BILLABLE BIDIRECTIONAL REFERENCES **
                Optional<Transaction> optionalTrans = adminWallet.getOutgoingTransactions()
                                .stream()
                                .filter(trans -> trans.getTransactionId() == transactionOne.getTransactionId())
                                .findFirst();

                // check if a match of the same transaction was found
                Assertions.assertTrue(optionalTrans.isPresent());
                optionalTrans.ifPresent((t) -> System.out.println("HELLOOO"));

                // find and checks if bill is the same as the 1st voucher
                Optional<Billable> optionalBill = optionalTrans.map(Transaction::getBillable);
                Assertions.assertTrue(optionalBill.isPresent());
                optionalBill.ifPresent(System.out::println);

                Optional<Boolean> optionalBoolean = optionalBill
                                .map((bill) -> bill.getBillableId() == fetchedVoucher.getBillableId());
                System.out.println(optionalBoolean.isPresent());
                Assertions.assertTrue(optionalBoolean.get());
                // optionalBoolean.ifPresentOrElse(Assertions::assertTrue, Assertions.fail());

                // same process as above repeated for transactionTwo, but also with 2nd voucher

                Optional<Transaction> optionalTransTwo = studentWallet.getIncomingTransactions()
                                .stream()
                                .filter(trans -> trans.getTransactionId() == transactionTwo.getTransactionId())
                                .findFirst();

                Assertions.assertTrue(optionalTransTwo.isPresent());
                Optional<Billable> optionalBillTwo = optionalTransTwo.map(Transaction::getBillable);
                Optional<Boolean> isBillTwoSame = optionalBillTwo
                                .map((bill) -> bill.getBillableId() == fetchedVoucher2.getBillableId());
                Assertions.assertTrue(isBillTwoSame.get());
                Assertions.assertFalse(isBillTwoSame.get());
                // isBillTwoSame.ifPresentOrElse(Assertions::assertTrue, () ->
                // Assertions.fail());

        }

        // @Test
        // @Order(5)
        // public void testIfTransactionalDidRollback() {
        // Admin fetchedAdmin = adminService.getAdminByUsername("adminFoo");
        // Wallet adminWallet = fetchedAdmin.getWallet();
        // System.out.println(adminWallet.getWalletBalance());
        // Assertions.assertEquals(adminWallet.getWalletBalance().compareTo(BigDecimal.ZERO),
        // 0);
        //
        // }
}
