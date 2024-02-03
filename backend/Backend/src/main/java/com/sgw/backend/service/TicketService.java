package com.sgw.backend.service;

import com.sgw.backend.entity.*;
import com.sgw.backend.exception.InvalidTicketException;
import com.sgw.backend.exception.InvalidUserException;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.util.Pair;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    private final GeneralUserRepository generalUserRepository;

    private final UserContext userContext;
    private static final Set<String> validFields = Set.of("subject", "description", "adminResponse", "ticketCategory",
            "generalUser");
    private static final Set<String> validSortFields = Set.of("subject", "description", "adminResponse",
            "createdAt", "ticketStatus", "ticketCategory");
    private static final Map<String, Boolean> validAscDesc = Map.of("asc", true, "desc", false);
    private static final Set<String> validCategories = Set.of("ACCOUNT", "FINANCE", "BOOKING", "VOUCHER", "OTHERS");
    private static final String USERNAME = "username";
    private static final String GENERAL_USER_FIELD = "generalUser";
    private static final String CREATED_AT = "createdAt";
    private static final String CATEGORY = "ticketCategory";

    public Optional<Ticket> createTicket(Ticket ticket) {
        return userContext
                .obtainRequesterIdentity((username) -> generalUserRepository.getGeneralUserByUsername(username))
                .map(saveTicket(ticket));
    }

    private Function<GeneralUser, Ticket> saveTicket(Ticket ticket) {
        return generalUser -> {
            if (ticket.getTicketCategory() == null) {
                ticket.setTicketCategory("");
            }
            ticket.setGeneralUser(generalUser);
            generalUser.getTickets().add(ticket);
            ticket.setCreatedAt(Instant.now());
            ticketRepository.save(ticket);
            return ticket;
        };
    }

    public boolean toggleTicketResolution(Long id, TicketStatusEnum statusEnum) {
        return ticketRepository.findById(id)
                .map(existingT -> {
                    existingT.setTicketStatus(statusEnum);
                    return true;
                }).orElse(false);
    }

    public Pair<List<DTOMapperService.TicketDTO>, Long> getAllTickets(String keyword, String field,
            Integer pageNum, Integer pageSize,
            String sortField, String sortOrder) {
        Optional<Sort> optSort = validateAndReturnSort(sortField, sortOrder);
        return Pair.of(
                ticketRepository.findAll(wildcardSearchSpecification(keyword.trim(), field.trim()),
                        PageRequest.of(pageNum, pageSize, optSort.orElse(defaultSort()))).getContent()
                        .stream().map(DTOMapperService.getTicketMapper()).collect(Collectors.toList()),
                ticketRepository.count(wildcardSearchSpecification(keyword.trim(), field.trim())));

    }

    public Sort defaultSort() {
        return Sort.by(CREATED_AT).descending();
    }

    public Pair<List<DTOMapperService.TicketDTO>, Long> getRelatedTicketsRefactored(String keyword, String field,
            Integer pageNum, Integer pageSize,
            String sortField, String sortOrder) {
        Optional<Sort> optSort = validateAndReturnSort(sortField, sortOrder);
        if (validateKeywordField(keyword, field)) {
            return Pair.of(searchRelevantTickets(
                    (existingSpec) -> Specification.where(existingSpec)
                            .and(wildcardSearchSpecification(keyword, field)),
                    pageNum, pageSize, optSort.orElse(defaultSort())).stream()
                    .map(DTOMapperService.getTicketMapper())
                    .collect(Collectors.toList()),
                    countRelevantTickets(
                            (existingSpec) -> Specification.where(existingSpec)
                                    .and(wildcardSearchSpecification(keyword, field))));
        } else {
            return Pair.of(searchRelevantTickets(UnaryOperator.identity(), pageNum, pageSize, defaultSort())
                    .stream()
                    .map(DTOMapperService.getTicketMapper())
                    .collect(Collectors.toList()),
                    countRelevantTickets(UnaryOperator.identity()));
        }

    }

    private Optional<Sort> validateAndReturnSort(String sortField, String sortOrder) {
        if (!validSortFields.contains(sortField) || validAscDesc.get(sortOrder) == null) {
            return Optional.empty();
        }
        return validAscDesc.get(sortOrder) ? Optional.ofNullable(Sort.by(sortField).ascending())
                : Optional.ofNullable(Sort.by(sortField).descending());
    }

    private Long countRelevantTickets(UnaryOperator<Specification<Ticket>> function) {
        return userContext
                .obtainRequesterIdentity((username) -> generalUserRepository.getGeneralUserByUsername(username))
                .map(user -> ticketRepository.count(function.apply(matchUser(user))))
                .orElse(0L);
    }

    private List<Ticket> searchRelevantTickets(UnaryOperator<Specification<Ticket>> function, Integer pageNum,
            Integer pageSize, Sort sort) {
        return userContext
                .obtainRequesterIdentity((username) -> generalUserRepository.getGeneralUserByUsername(username))
                .map(user -> {
                    return ticketRepository.findAll(
                            function.apply(matchUser(user)),
                            PageRequest.of(pageNum, pageSize, sort)).getContent();
                }).orElse(new ArrayList<>());
    }

    private boolean validateKeywordField(String keyword, String field) {
        if (!validFields.contains(field)) {
            return false;
        } else if (field.equals(CATEGORY) && !validCategories.contains(keyword.toUpperCase().trim())) {
            return false;
        }
        return true;
    }

    private Specification<Ticket> matchUser(GeneralUser user) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(GENERAL_USER_FIELD).get(USERNAME), user.getUsername());
        };
    }

    private Specification<Ticket> wildcardSearchSpecification(String keyword, String field) {
        return (root, query, criteriaBuilder) -> {
            if (field.equals(GENERAL_USER_FIELD)) {
                return criteriaBuilder.like(criteriaBuilder.lower(root.get(GENERAL_USER_FIELD).get(USERNAME)),
                        '%' + keyword.toLowerCase() + '%');
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get(field)), '%' + keyword.toLowerCase() + '%');
        };
    }

    public List<Ticket> getTicketsByUsername(String username) {
        return ticketRepository
                .findAllByGeneralUserUserId(generalUserRepository.getGeneralUserByUsername(username).getUserId());
    }

    public Optional<DTOMapperService.TicketDTO> getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId).map(DTOMapperService.getTicketMapper());
    }

    public boolean updateTicketByAdmin(Ticket ticket, Long ticketId) {
        return ticketRepository.findById(ticketId)
                .map(t -> {
                    t.setTicketStatus(ticket.getTicketStatus());
                    return true;
                }).orElse(false);
    }

    public void markAsRead(Long ticketId) throws InvalidUserException {
        GeneralUser user = userContext
                .obtainRequesterIdentity((username) -> generalUserRepository.getGeneralUserByUsername(username))
                .orElseThrow(() -> new InvalidUserException(""));
        ticketRepository.findById(ticketId).ifPresentOrElse(ticket -> {
            if (ticket.getGeneralUser().getUsername().equals(user.getUsername())) {
                ticket.setNotifyClient(false);
            } else if (user instanceof Admin) {
                ticket.setNotifyAdmin(false);
            }
        }, () -> {
            throw new InvalidTicketException("");
        });
    }
}
