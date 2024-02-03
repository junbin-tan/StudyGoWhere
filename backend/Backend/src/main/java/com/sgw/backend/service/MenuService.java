package com.sgw.backend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sgw.backend.dto.MenuItemNameQuantityDTO;
import com.sgw.backend.dto.KDSOrderDTO;
import com.sgw.backend.entity.*;
import com.sgw.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sgw.backend.entity_venue.Venue;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuService {

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private MenuSectionRepository menuSectionRepository;

    @Autowired
    private BillableRepository billableRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private MenuItemBillableRepository menuItemBillableRepository;

    /*
     * Create a menu template for owner (can add to multiple venues)
     */
    public Menu ownerCreateMenuTemplate(long ownerId, Menu menuTemplate) {
        Owner owner = ownerRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));

        owner.getMenuTemplates().add(menuTemplate);
        menuTemplate.setOwner(owner);

        menuRepository.save(menuTemplate);

        System.out.println("[Service] Menu template created for owner " + menuTemplate.getMenuId());

        return menuTemplate;
    }

    /*
     * Adds a section to a menu
     */
    public MenuSection addSectionToMenu(long menuId, MenuSection menuSection) {
        Menu menu = menuRepository.findById(menuId).orElseThrow(() -> new RuntimeException("Menu not found"));

        menuSection.setMenu(menu);
        menu.getMenuSections().add(menuSection);

        menuSectionRepository.save(menuSection);

        System.out.println("[Service] Section " + menuSection.getMenuSectionId() + " added to menu "
                + menuSection.getMenu().getMenuId());

        return menuSection;
    }

    /*
     * Adds a menu item to a section
     */
    public MenuItem addMenuItemToSection(long menuSectionId, MenuItem menuItem) {
        MenuSection menuSection = menuSectionRepository.findById(menuSectionId)
                .orElseThrow(() -> new RuntimeException("Menu section not found"));

        menuItem.setMenuSection(menuSection);
        menuSection.getMenuItems().add(menuItem);

        menuItemRepository.save(menuItem);

        System.out.println("[Service] MenuItem " + menuItem.getMenuItemId() + " added to section "
                + menuItem.getMenuSection().getMenuSectionId() + " of menu "
                + menuItem.getMenuSection().getMenu().getMenuId());

        return menuItem;
    }

    /*
     * Get all menus
     */
    public List<Menu> getAllMenus() {

        return menuRepository.findAll();
    }

    /*
     * Retrieve all menus owned by an owner ID
     */
    public List<Menu> getMenusByOwnerId(long ownerId) throws Exception {
        try {
            List<Menu> allMenu = menuRepository.findByOwnerUserId(ownerId);
            List<Menu> templates = new ArrayList<>();
            for (Menu m : allMenu) {
                if (m.getVenue() == null) {
                    templates.add(m);
                }
            }
            return templates;
        } catch (Exception e) {
            System.err.println("Error retrieving menus by owner ID: " + e.getMessage());
            throw new Exception("Failed to retrieve menus for owner ID: " + ownerId, e);
        }
    }

    /*
     * Retrieve menu associated with a venue
     */
    public Menu getMenuByVenueId(long venueId) {
        try {
            return menuRepository.findByVenueVenueId(venueId);
        } catch (Exception e) {
            System.out.println("[Service] Menu not found for venue " + venueId);
            return null;
        }
    }

    /*
     * Copy menu to each venue (menu can edit its own menu, not affecting owner menu
     * template)
     */
    @Transactional
    public Menu copyMenuToVenue(long menuTemplateId, long venueId) {
        Menu template = menuRepository.findById(menuTemplateId)
                .orElseThrow(() -> new RuntimeException("Menu template not found"));
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        // Remove old venue menu if it exists
        if (venue.getMenu() != null) {
            venue.setMenu(null);
            venueRepository.saveAndFlush(venue);
            menuRepository.flush();
        }

        Menu clonedMenu = cloneMenu(template);
        clonedMenu.setVenue(venue);
        venue.setMenu(clonedMenu);

        // SETTING VENUE BACK TO OWNWER
        Owner o = ownerRepository.findById(venue.getOwner().getUserId()).orElse(null);
        List<Venue> venues = o.getVenues();
        if (venues != null) {
            int index = venues.indexOf(venue);
            if (index != -1) {
                venues.set(index, venue);
                o.setVenues(venues);
                ownerRepository.save(o);
            }
        }

        return menuRepository.save(clonedMenu);
    }

    public Long retrieveVenueIdFromMenuItem(Long menuItemId) {
        MenuItem mi = menuItemRepository.getReferenceById(menuItemId);
        return mi.getMenuSection().getMenu().getVenue().getVenueId();
    }

    public List<MenuItemNameQuantityDTO> retrieveOrderForKiosk(List<Pair<Long, Integer>> itemIdAndQuantities) {
        List<MenuItemNameQuantityDTO> res = new ArrayList<MenuItemNameQuantityDTO>();
        for (Pair<Long, Integer> pair: itemIdAndQuantities) {
            MenuItem item = menuItemRepository.findById(pair.getFirst()).orElse(null);
            if (item == null) {
                System.err.println("Error: Menu Item with ID " + pair.getFirst() + " not found.");
                continue;
            }
            res.add(new MenuItemNameQuantityDTO(item.getMenuItemName(), pair.getSecond()));
        }
        return res;
    }

    /*
     * Helper methods for copying menu
     * - cloneMenu
     * - cloneMenuSection
     * - cloneLineItem
     * - cloneLineItemBillable
     */

    private Menu cloneMenu(Menu menu) {
        Menu clonedMenu = new Menu();
        clonedMenu.setMenuName(menu.getMenuName());
        clonedMenu.setMenuDescription(menu.getMenuDescription());
        clonedMenu.setOwner(menu.getOwner());

        for (MenuSection menuSection : menu.getMenuSections()) {
            MenuSection clonedMenuSection = cloneMenuSection(menuSection, clonedMenu);
            clonedMenu.getMenuSections().add(clonedMenuSection);
        }

        return clonedMenu;
    }

    private MenuSection cloneMenuSection(MenuSection menuSection, Menu clonedMenu) {
        MenuSection clonedMenuSection = new MenuSection();
        clonedMenuSection.setMenuSectionName(menuSection.getMenuSectionName());
        clonedMenuSection.setMenuSectionDescription(menuSection.getMenuSectionDescription());
        clonedMenuSection.setMenu(clonedMenu);

        for (MenuItem menuItem : menuSection.getMenuItems()) {
            MenuItem clonedMenuItem = cloneMenuItem(menuItem, clonedMenuSection);
            clonedMenuSection.getMenuItems().add(clonedMenuItem);
        }

        return clonedMenuSection;
    }

    private MenuItem cloneMenuItem(MenuItem menuItem, MenuSection clonedMenuSection) {
        MenuItem clonedMenuItem = new MenuItem();
        clonedMenuItem.setMenuItemName(menuItem.getMenuItemName());
        clonedMenuItem.setMenuItemDescription(menuItem.getMenuItemDescription());
        clonedMenuItem.setSellingPrice(menuItem.getSellingPrice());
        clonedMenuItem.setCostPrice(menuItem.getCostPrice());
        clonedMenuItem.setImageURL(menuItem.getImageURL());
        clonedMenuItem.setMenuSection(clonedMenuSection);

        return clonedMenuItem;
    }

    public List<KDSOrderDTO> retrieveVenueOrders(Long venueId) {
        // Fetch all pending orders. From venueId. venueId -> Get venue -> Get Owner wallet ->
        // All pending transactions -> Each pending transaction where menuItem.venue.id = venueId.
        // Transaction -> Transaction Detail -> MenuBillable -> MenuItem -> MenuSection -> Menu -> Venue -> VenueId = venueId
        Venue venue = venueRepository.getReferenceById(venueId);
        System.out.println("Im here");
        Wallet ownerWallet = venue.getOwner().getWallet();
        System.out.println("Owner found " + venue.getOwner().getUsername());

        List<KDSOrderDTO> res = new ArrayList<KDSOrderDTO>();
        List<TransactionDetail> tds = menuItemBillableRepository.findByVenueId(venueId);
        for (TransactionDetail td : tds) {
            Map<String, Integer> miaq =td.aggregateBillablesByClass();
            KDSOrderDTO kdsInfo = new KDSOrderDTO(MenuItemNameQuantityDTO.fromMap(miaq), td.getTransaction().getTransactionId(), td.getTransaction().getPayerWallet().getGeneralUser().getUsername());
            System.out.println(miaq);
            res.add(kdsInfo);

        }

        return res;
    }
    public Menu getMenuById(Long id) {
        return menuRepository.findById(id).orElse(null);
    }

    public Long getVenueIdFromMenuItemId(Long menuItemId) {
        return menuItemRepository.findVenueIdByMenuItemId(menuItemId);
    }

    public void deleteMenuById(Long id) {
        Menu menu = menuRepository.findById(id).orElse(null);
        Owner o = ownerRepository.findById(menu.getOwner().getUserId()).orElse(null);
        o.getMenuTemplates().remove(menu);
        ownerRepository.save(o);
        if (menu.getVenue() != null) {
            Venue v = venueRepository.findById(menu.getVenue().getVenueId()).orElse(null);
            v.setMenu(null);
            venueRepository.save(v);
        }
        menuRepository.deleteById(id);
    }

    public void deleteMenuSectionByMenuIdAndSectionId(Long menuSectionId) {
        MenuSection menuSection = menuSectionRepository.findById(menuSectionId).orElse(null);
        Menu m = menuRepository.findById(menuSection.getMenu().getMenuId()).orElse(null);
        Owner o = ownerRepository.findById(m.getOwner().getUserId()).orElse(null);
        m.getMenuSections().remove(menuSection);

        menuRepository.save(m);
        List<Menu> menuTemplates = o.getMenuTemplates();
        if (menuTemplates != null) {
            int index = menuTemplates.indexOf(m);
            if (index != -1) {
                menuTemplates.set(index, m);
                o.setMenuTemplates(menuTemplates);
                ownerRepository.save(o);
            }
        }

        menuSectionRepository.deleteById(menuSectionId);
    }

    public void deleteMenuItemByMenuItemId(Long menuItemId) {
        MenuItem menuItem = menuItemRepository.findById(menuItemId).orElse(null);
        MenuSection menuSection = menuSectionRepository.findById(menuItem.getMenuSection().getMenuSectionId()).orElse(null);
        Menu m = menuRepository.findById(menuSection.getMenu().getMenuId()).orElse(null);
        Owner o = ownerRepository.findById(m.getOwner().getUserId()).orElse(null);

        menuSection.getMenuItems().remove(menuItem);
        menuSectionRepository.save(menuSection);

        // setting the menu section with updated item back to menu (m)
        List<MenuSection> menuSections = m.getMenuSections();
        if (menuSections != null) {
            int index = menuSections.indexOf(menuSection);
            if (index != -1) {
                menuSections.set(index, menuSection);
                m.setMenuSections(menuSections);
                menuRepository.save(m);
            }
        }

        // setting the menu with updated section back to owner
        List<Menu> menuTemplates = o.getMenuTemplates();
        if (menuTemplates != null) {
            int index = menuTemplates.indexOf(m);
            if (index != -1) {
                menuTemplates.set(index, m);
                o.setMenuTemplates(menuTemplates);
                ownerRepository.save(o);
            }
        }

        menuItemRepository.deleteById(menuItemId);

    }


    public Menu updateMenu(Menu menu) {
        Menu temp = menuRepository.findById(menu.getMenuId()).orElse(null);
        if (temp != null) {
            temp.setMenuName(menu.getMenuName());
            temp.setMenuDescription(menu.getMenuDescription());
            menuRepository.save(temp);

            //re setting the menu back to owner
            Owner o = ownerRepository.findById(temp.getOwner().getUserId()).orElse(null);
            List<Menu> menuTemplates = o.getMenuTemplates();
            if (menuTemplates != null) {
                int index = menuTemplates.indexOf(temp);
                if (index != -1) {
                    menuTemplates.set(index, temp);
                    o.setMenuTemplates(menuTemplates);
                    ownerRepository.save(o);
                }
            }
            return temp;
        }
        return null;
    }

    public MenuSection updateMenuSection(MenuSection menuSection) {
        MenuSection temp = menuSectionRepository.findById(menuSection.getMenuSectionId()).orElse(null);
        if (temp != null) {
            temp.setMenuSectionName(menuSection.getMenuSectionName());
            temp.setMenuSectionDescription(menuSection.getMenuSectionDescription());
            menuSectionRepository.save(temp);

            //re setting the menu section back to menu
            Menu m = menuRepository.findById(temp.getMenu().getMenuId()).orElse(null);
            List<MenuSection> menuSections = m.getMenuSections();
            if (menuSections != null) {
                int index = menuSections.indexOf(temp);
                if (index != -1) {
                    menuSections.set(index, temp);
                    m.setMenuSections(menuSections);
                    menuRepository.save(m);
                }
            }

            // re setting menu to owner
            Owner o = ownerRepository.findById(m.getOwner().getUserId()).orElse(null);
            List<Menu> menuTemplates = o.getMenuTemplates();
            if (menuTemplates != null) {
                int index = menuTemplates.indexOf(m);
                if (index != -1) {
                    menuTemplates.set(index, m);
                    o.setMenuTemplates(menuTemplates);
                    ownerRepository.save(o);
                }
            }

            return temp;
        }
        return null;
    }

    public MenuItem updateMenuItem(MenuItem menuItem) {
        MenuItem temp = menuItemRepository.findById(menuItem.getMenuItemId()).orElse(null);
        if (temp != null) {
            temp.setMenuItemName(menuItem.getMenuItemName());
            temp.setMenuItemDescription(menuItem.getMenuItemDescription());
            temp.setSellingPrice(menuItem.getSellingPrice());
            temp.setCostPrice(menuItem.getCostPrice());
            temp.setImageURL(menuItem.getImageURL());
            menuItemRepository.save(temp);

            //re setting the menu item back to menu section
            MenuSection ms = menuSectionRepository.findById(temp.getMenuSection().getMenuSectionId()).orElse(null);
            List<MenuItem> menuItems = ms.getMenuItems();
            if (menuItems != null) {
                int index = menuItems.indexOf(temp);
                if (index != -1) {
                    menuItems.set(index, temp);
                    ms.setMenuItems(menuItems);
                    menuSectionRepository.save(ms);
                }
            }

            //re setting the menu section back to menu
            Menu m = menuRepository.findById(ms.getMenu().getMenuId()).orElse(null);
            List<MenuSection> menuSections = m.getMenuSections();
            if (menuSections != null) {
                int index = menuSections.indexOf(ms);
                if (index != -1) {
                    menuSections.set(index, ms);
                    m.setMenuSections(menuSections);
                    menuRepository.save(m);
                }
            }

            // re setting menu to owner
            Owner o = ownerRepository.findById(m.getOwner().getUserId()).orElse(null);
            List<Menu> menuTemplates = o.getMenuTemplates();
            if (menuTemplates != null) {
                int index = menuTemplates.indexOf(m);
                if (index != -1) {
                    menuTemplates.set(index, m);
                    o.setMenuTemplates(menuTemplates);
                    ownerRepository.save(o);
                }
            }

            return temp;
        }
        return null;
    }

}
