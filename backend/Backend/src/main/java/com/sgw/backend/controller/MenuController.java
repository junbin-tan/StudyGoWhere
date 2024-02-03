package com.sgw.backend.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import com.sgw.backend.dto.MenuItemNameQuantityDTO;
import com.sgw.backend.dto.KDSOrderDTO;
import com.sgw.backend.entity_venue.Operator;
import com.sgw.backend.service.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sgw.backend.dto.MenuItemQuantityDTO;
import com.sgw.backend.dto.TransactionDTO;
import com.sgw.backend.entity.Menu;
import com.sgw.backend.entity.MenuItem;
import com.sgw.backend.entity.MenuSection;
import com.sgw.backend.exception.PayerBalanceInsufficientException;
import com.sgw.backend.repository.OwnerRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserContext userContext;

    @Autowired
    private OperatorService operatorService;

    private final Map<Long, SseEmitter> liveOrderSSE = new ConcurrentHashMap<>();

    /*
     * Create a menu template for owner (can add to multiple venues) -
     * ** EDIT THE ENDPOINT LATER **
     * 
     * http://localhost:5001/public/create-menu-template?ownerId=4
     */
    @PostMapping(value = { "/public/create-menu-template", "/owner/create-menu-template" })
    public ResponseEntity<?> ownerCreateMenuTemplate(@RequestParam long ownerId, @RequestBody Menu menuTemplate) {
        try {
            Menu createdMenuTemplate = menuService.ownerCreateMenuTemplate(ownerId, menuTemplate);
            return ResponseEntity.ok(createdMenuTemplate);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /*
     * Adds a menu section
     * ** EDIT THE ENDPOINT LATER **
     * 
     * http://localhost:5001/public/add-section-to-menu?menuId=8
     */
    @PostMapping(value = { "/public/add-section-to-menu", "/owner/add-section-to-menu" })
    public ResponseEntity<?> addSectionToMenu(@RequestParam long menuId, @RequestBody MenuSection menuSection) {
        try {
            MenuSection createdMenuSection = menuService.addSectionToMenu(menuId, menuSection);
            return ResponseEntity.ok(createdMenuSection);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /*
     * Adds a menu item to a menu section
     * ** EDIT THE ENDPOINT LATER **
     * 
     * http://localhost:5001/public/add-menu-item-to-section?menuSectionId=25
     */
    @PostMapping(value = { "/public/add-menu-item-to-section", "/owner/add-menu-item-to-section" })
    public ResponseEntity<?> addMenuItemToSection(@RequestParam long menuSectionId, @RequestBody MenuItem menuItem) {
        try {
            MenuItem createdMenuItem = menuService.addMenuItemToSection(menuSectionId, menuItem);
            return ResponseEntity.ok(createdMenuItem);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /*
     * Retrieve all menus from DB
     * 
     * http://localhost:5001/public/get-all-menus
     */
    @GetMapping(value = { "public/get-all-menus", "owner/get-all-menus" })
    public ResponseEntity<?> getAllMenus() {
        try {
            List<Menu> menus = menuService.getAllMenus();
            return ResponseEntity.ok(menus);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /*
     * Retrieve all menus by owner ID
     * 
     * http://localhost:5001/public/get-own-menus?ownerId=4
     * # Cannot have owner in the URL because it will conflict?
     */
    @GetMapping(value = { "public/get-own-menus", "owner/get-own-menus" })
    public ResponseEntity<?> getMenusByOwnerId(@RequestParam long ownerId) {
        try {
            List<Menu> menus = menuService.getMenusByOwnerId(ownerId);
            return ResponseEntity.ok(menus);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /*
     * Retrieve menu associated with a venue
     * 
     * http://localhost:5001/public/get-menu-by-venue-id?venueId=1
     */
    @GetMapping(value = { "public/get-menu-by-venue-id", "owner/get-menu-by-venue-id" })
    public ResponseEntity<?> getMenuByVenueId(@RequestParam long venueId) {
        try {
            Menu menu = menuService.getMenuByVenueId(venueId);

            if (menu != null) {
                System.out.println("Menu found for ID " + venueId + ": " + menu.getMenuId());
                return ResponseEntity.ok(menu);
            } else {
                return new ResponseEntity<>("Menu not found for ID " + venueId, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /*
     * Generate a menu from a template menu, and associate it to a venue via deep
     * cloning
     * 
     * http://localhost:5001/public/set-menu-to-venue?menuTemplateId=1&venueId=2
     */
    @PostMapping("/public/set-menu-to-venue")
    public ResponseEntity<?> setMenuToVenue(@RequestParam long menuTemplateId, @RequestParam long venueId) {
        try {
            Menu associatedMenu = menuService.copyMenuToVenue(menuTemplateId, venueId);
            System.out.println("Associated menu: " + menuTemplateId + " to venue: " + venueId + " successfully.");
            return ResponseEntity.ok(associatedMenu);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /*
     * Testing creating a transaction with multiple menu items
     * 
     * Method can be extended in the future to allow for different line items
     * instead
     */
    @PostMapping("/public/create-multiple-menuitem-transaction")
    public ResponseEntity<TransactionDTO> createTransactionForMultipleItems(
            @RequestParam Long payerWalletId,
            @RequestParam String receiverUsername,
            @RequestBody List<MenuItemQuantityDTO> menuItemAndQuantities) {

        try {
            // Convert DTO -> Pair<Long, Integer>
            List<Pair<Long, Integer>> convertedPairs = menuItemAndQuantities.stream()
                    .map(dto -> Pair.of(dto.getMenuItemId(), dto.getQuantity()))
                    .collect(Collectors.toList());

            // Get receiver wallet ID
            Long receiverWalletId = ownerRepository.getOwnerByUsername(receiverUsername).getWallet().getWalletId();

            TransactionDTO transactionDTO = transactionService.createMenuTransaction(
                    convertedPairs, payerWalletId, receiverWalletId);
            System.out.println(liveOrderSSE);
            List<MenuItemNameQuantityDTO> order = menuService.retrieveOrderForKiosk(convertedPairs);
            String username = walletService.getWalletById(payerWalletId).getGeneralUser().getUsername();
            Long venueId = menuService.getVenueIdFromMenuItemId(menuItemAndQuantities.get(0).getMenuItemId());
            try {
                liveOrderSSE.get(venueId).send(new KDSOrderDTO(order, transactionDTO.getTransactionId(),username));
            } catch (Exception e) {
                System.out.println("KDS disconnected atm");
            }
            return new ResponseEntity<>(transactionDTO, HttpStatus.OK);
        } catch (PayerBalanceInsufficientException e) {
            System.out.println("Payer balance insufficient");
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("public/create-order-connection")
    public SseEmitter createOrderConnection(){
        System.out.println("ATTEMPTING TO OPEN CONNECTION");
        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        sseEmitter.onCompletion(() -> {
            System.out.println("CONNECTION COMPLETED");
        });
        sseEmitter.onTimeout(() -> {
            System.out.println("CONNECTION TIMED OUT");
        });
        Operator operator = userContext.obtainRequesterIdentity(username -> operatorService.getOperatorByUsername(username)).get();
        Long venueId = operator.getVenue().getVenueId();
        System.out.println("this is the operator id: " + venueId);
        if (liveOrderSSE.get(venueId) != null) {
            liveOrderSSE.get(venueId).complete();
        }
        liveOrderSSE.put(venueId, sseEmitter);

        return sseEmitter;
    }

    @PostMapping("public/sseTest")
    public ResponseEntity<?> sseTest(@RequestBody Long itemId) {
        //Not needed anymore
        try {
            System.out.println(itemId);
//            liveOrderSSEService.broadcast(requestBody,1L);
            System.out.println(liveOrderSSE);
            List<Pair<Long, Integer>> sampleItems = new ArrayList<>();
            sampleItems.add(Pair.of(itemId, 1));
            //Send convert menuItemsId -> item name + quantity. Get DTOs.
            List<MenuItemNameQuantityDTO> order = menuService.retrieveOrderForKiosk(sampleItems);
            //Send order to kiosk
            //Return these items: username, transactionId and order itself. Currently only returning order.

            liveOrderSSE.get(1L).send(order);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error receiving sseTest");
        }
        return ResponseEntity.status(404).build();
    }

    @PostMapping("public/complete-order")
    public ResponseEntity<?> completeOrder(@RequestBody Long transactionId) {
        try {
            transactionService.completeATransaction(transactionService.getTransactionById(transactionId));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error completing transaction: " + e.getMessage());
        }
        return ResponseEntity.status(404).build();
    }

    @GetMapping("public/retrieveVenueOrders")
    public List<KDSOrderDTO> retrieveVenueOrders() {
        Long venueId = userContext.obtainRequesterIdentity(username -> operatorService.getOperatorByUsername(username)).map(operator -> operator.getVenue().getVenueId()).orElse(null);
        System.out.println("Retrieving orders for venueId: " + venueId);
        List<KDSOrderDTO> orders = menuService.retrieveVenueOrders(venueId);
        return orders;
    }

    @GetMapping("owner/menu/getMenuByMenuId/{id}")
    public Menu getMenuByMenuId(@PathVariable Long id) {
        return menuService.getMenuById(id);
    }

    @DeleteMapping("owner/menu/deleteMenuByMenuId/{id}")
    public void deleteMenuByMenuId(@PathVariable Long id) {
        menuService.deleteMenuById(id);
    }
    @DeleteMapping("owner/menu/deleteMenuSection")
    public void deleteMenuSectionBySectionId(@RequestParam Long menuSectionId) {
        menuService.deleteMenuSectionByMenuIdAndSectionId(menuSectionId);
    }

    @DeleteMapping("owner/menu/deleteMenuItem")
    public void deleteMenuItemByItemId(@RequestParam Long menuItemId) {
        menuService.deleteMenuItemByMenuItemId(menuItemId);
    }

    @PutMapping("owner/menu/updateMenu")
    public ResponseEntity<?> updateMenu(@RequestBody Menu menu) {
        try {
            Menu newMenu =  menuService.updateMenu(menu);
            return ResponseEntity.ok(newMenu);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PutMapping("owner/menu/updateMenuSection")
    public ResponseEntity<?> updateMenuSection(@RequestBody MenuSection menuSection) {
        try {
            MenuSection newMenuSection =  menuService.updateMenuSection(menuSection);
            return ResponseEntity.ok(newMenuSection);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("owner/menu/updateMenuItem")
    public ResponseEntity<?> updateMenuItem(@RequestBody MenuItem menuItem) {
        try {
            MenuItem newMenuItem =  menuService.updateMenuItem(menuItem);
            return ResponseEntity.ok(newMenuItem);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }




}
