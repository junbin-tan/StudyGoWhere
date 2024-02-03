// package com.sgw.backend;

// import com.sgw.backend.entity.*;
// import com.sgw.backend.repository.StudentRepository;
// import com.sgw.backend.repository.TicketRepository;
// import com.sgw.backend.repository.WalletRepository;
// import com.sgw.backend.service.DTOMapperService;
// import com.sgw.backend.service.TicketService;
// import org.junit.jupiter.api.*;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.data.domain.Sort;
// import
// org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.User;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.test.context.TestPropertySource;
// import org.springframework.transaction.annotation.Transactional;

// import java.math.BigDecimal;
// import java.time.Instant;
// import java.util.ArrayList;
// import java.util.List;
// import java.util.Optional;
// import java.util.function.Function;

// import static org.junit.jupiter.api.Assertions.*;

// @SpringBootTest
// @TestPropertySource(locations = "classpath:application-test.properties")
// @Transactional(rollbackFor = Exception.class)
// @TestInstance(TestInstance.Lifecycle.PER_CLASS)
// public class TicketServiceTest {

// private final TicketService ticketService;

// private final WalletRepository walletRepository;

// private final TicketRepository ticketRepository;

// private final StudentRepository studentRepository;

// private static Student studentSample;

// @Autowired
// public TicketServiceTest(StudentRepository studentRepository,
// TicketRepository ticketRepository,

// WalletRepository walletRepository, TicketService ticketService) {
// this.ticketRepository = ticketRepository;
// this.studentRepository = studentRepository;
// this.walletRepository = walletRepository;
// this.ticketService = ticketService;
// }

// @BeforeAll
// public void testInit() {
// createStudentAndWallet("username", "password");

// UserDetails userDetails = new User(studentSample.getUsername(),
// studentSample.getPassword(),
// studentSample.getAuthorities());
// UsernamePasswordAuthenticationToken token = new
// UsernamePasswordAuthenticationToken(userDetails,
// null, userDetails.getAuthorities());
// SecurityContextHolder.getContext().setAuthentication(token);
// }

// @Test
// public void ticketCreation() {
// Ticket ticket = createTicket();

// ticketService.createTicket(ticket);

// Optional<Ticket> managedT = ticketRepository.findById(ticket.getTicketId());
// Assertions.assertTrue(managedT.isPresent());
// Assertions.assertTrue(managedT.map(t -> t.getGeneralUser()).isPresent());
// Assertions.assertTrue(managedT.map(t -> t.getGeneralUser()).map(u ->
// !u.getTickets().isEmpty()).orElse(false));
// Assertions.assertEquals(1, ticketRepository.count());
// }

// @Test
// public void ticketReply() {
// Ticket sampleTicket = createTicket();
// ticketService.createTicket(sampleTicket);

// final String reply = "REPLY";

// Assertions.assertTrue(ticketService.addAdminResponse(sampleTicket.getTicketId(),
// reply));
// Assertions.assertTrue(ticketRepository.findById(sampleTicket.getTicketId())
// .map(verifyReply(reply)).orElse(false));
// Assertions.assertEquals(1, ticketRepository.count());

// }

// @Test
// public void ticketReplyInvalid() {
// Ticket sampleTicket = createTicket();
// ticketService.createTicket(sampleTicket);

// final String reply = "REPLY";

// assertFalse(ticketService.addAdminResponse(-1L, reply));
// assertFalse(ticketRepository.findById(sampleTicket.getTicketId()).map(verifyReply(reply)).orElse(false));
// Assertions.assertEquals(1, ticketRepository.count());
// }

// @Test
// public void toggleTicketResolution() {
// Ticket sampleTicket = createTicket();
// ticketService.createTicket(sampleTicket);

// toggleTest(sampleTicket, TicketStatusEnum.UNRESOLVED);
// toggleTest(sampleTicket, TicketStatusEnum.RESOLVED);
// Assertions.assertEquals(1, ticketRepository.count());
// }

// @Test
// public void toggleInvalidResolutionId() {
// Ticket sampleTicket = createTicket();
// ticketService.createTicket(sampleTicket);
// assertFalse(ticketService.toggleTicketResolution(-1L,
// TicketStatusEnum.UNRESOLVED));
// Assertions.assertTrue(ticketRepository.findById(sampleTicket.getTicketId())
// .map(verifyToggle(TicketStatusEnum.RESOLVED))
// .orElse(Boolean.FALSE));
// Assertions.assertEquals(1, ticketRepository.count());

// }

// @Test
// public void testSearch() {

// Ticket sampleTicket = createTicket();
// ticketService.createTicket(sampleTicket);
// List<DTOMapperService.TicketDTO> tickets = ticketService
// .getAllTickets("sample", "subject", 0, 10, "subject", "asc").getFirst();
// List<DTOMapperService.TicketDTO> notPresent = ticketService
// .getAllTickets("notMatching", "subject", 0, 10, "subject", "asc").getFirst();

// createStudentAndWallet("new", "password");

// assertEquals(1, ticketRepository.count());
// assertEquals(1, tickets.size());
// assertEquals(0, notPresent.size());

// }

// @Test
// public void testAllTicketsSearchSort() {
// Ticket sampleTicket = createTicket();
// ticketService.createTicket(sampleTicket);
// Ticket lastSampleTicket = createLastTicket();
// ticketService.createTicket(lastSampleTicket);

// List<Ticket> tickets = ticketService.getRelatedTicketsRefactored("",
// "subject", 0, 10, "subject", "asc")
// .getFirst();

// assertEquals(2, ticketRepository.count());
// assertEquals(2, tickets.size());
// assertTrue(tickets.get(0).getTicketId() == (sampleTicket.getTicketId()));

// List<Ticket> secondTickets = ticketService.getRelatedTicketsRefactored("",
// "subject", 0, 10, "subject", "desc")
// .getFirst();
// assertEquals(2, ticketRepository.count());
// assertEquals(2, tickets.size());
// assertTrue(secondTickets.get(0).getTicketId() ==
// (lastSampleTicket.getTicketId()));

// }

// @Test
// public void testRelatedSearch() {
// Ticket sampleTicket = createTicket();
// ticketService.createTicket(sampleTicket);

// List<Ticket> tickets = ticketService.getRelatedTicketsRefactored("sample",
// "subject", 0, 10, "subject", "asc")
// .getFirst();
// List<Ticket> notPresent = ticketService
// .getRelatedTicketsRefactored("notMatching", "subject", 0, 10, "subject",
// "asc").getFirst();

// assertEquals(1, ticketRepository.count());
// assertEquals(1, tickets.size());
// assertEquals(0, notPresent.size());
// }

// @Test
// public void testSort() {
// Ticket sampleTicket = createTicket();
// ticketService.createTicket(sampleTicket);
// Ticket lastSampleTicket = createLastTicket();
// ticketService.createTicket(lastSampleTicket);

// List<Ticket> tickets = ticketService.getRelatedTicketsRefactored("",
// "subject", 0, 10, "subject", "asc")
// .getFirst();

// assertEquals(2, ticketRepository.count());
// assertEquals(2, tickets.size());
// assertTrue(tickets.get(0).getTicketId() == (sampleTicket.getTicketId()));

// List<Ticket> secondTickets = ticketService.getRelatedTicketsRefactored("",
// "subject", 0, 10, "subject", "desc")
// .getFirst();
// assertEquals(2, ticketRepository.count());
// assertEquals(2, tickets.size());
// assertTrue(secondTickets.get(0).getTicketId() ==
// (lastSampleTicket.getTicketId()));

// }

// private void createStudentAndWallet(String username, String password) {
// studentSample = new Student(username, password);
// studentSample.setTickets(new ArrayList<>());

// Wallet wallet = new Wallet();
// wallet.setVouchers(List.of());
// wallet.setIncomingTransactions(List.of());
// wallet.setOutgoingTransactions(List.of());
// wallet.setWalletBalance(BigDecimal.ONE);
// wallet.setGeneralUser(studentSample);
// studentSample.setWallet(wallet);

// walletRepository.save(wallet);
// studentRepository.save(studentSample);
// }

// private void createAndSetNewSecurityContext() {
// createStudentAndWallet("new", "password");
// UserDetails userDetails = new User(studentSample.getUsername(),
// studentSample.getPassword(),
// studentSample.getAuthorities());
// UsernamePasswordAuthenticationToken token = new
// UsernamePasswordAuthenticationToken(userDetails,
// null, userDetails.getAuthorities());
// SecurityContextHolder.getContext().setAuthentication(token);
// }

// private Ticket createTicket() {
// Ticket ticket = new Ticket();
// ticket.setAdminResponse("");
// ticket.setTicketStatus(TicketStatusEnum.RESOLVED);
// ticket.setSubject("sample");
// ticket.setDescription("description");
// ticket.setImages(List.of());
// ticket.setCreatedAt(Instant.now());
// return ticket;
// }

// private Ticket createLastTicket() {
// Ticket ticket = new Ticket();
// ticket.setAdminResponse("");
// ticket.setTicketStatus(TicketStatusEnum.RESOLVED);
// ticket.setSubject("zzzzz");
// ticket.setDescription("zzzzz");
// ticket.setImages(List.of());
// ticket.setCreatedAt(Instant.now());
// return ticket;
// }

// private void toggleTest(Ticket sampleTicket, TicketStatusEnum
// ticketStatusEnum) {

// Assertions.assertTrue(ticketService.toggleTicketResolution(sampleTicket.getTicketId(),
// ticketStatusEnum));
// Assertions.assertTrue(ticketRepository.findById(sampleTicket.getTicketId())
// .map(verifyToggle(ticketStatusEnum))
// .orElse(Boolean.FALSE));
// }

// private Function<? super Ticket, Boolean> verifyToggle(TicketStatusEnum
// ticketStatusEnum) {
// return t -> t.getTicketStatus().equals(ticketStatusEnum);
// }

// private Function<Ticket, Boolean> verifyReply(String reply) {
// return t -> t.getAdminResponse().equals(reply);
// }

// @AfterAll
// public void testCleanUp() {

// }

// }