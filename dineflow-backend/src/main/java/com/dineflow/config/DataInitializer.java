package com.dineflow.config;

import com.dineflow.entity.*;
import com.dineflow.repository.AdminRepository;
import com.dineflow.repository.CategoryRepository;
import com.dineflow.repository.DishRepository;
import com.dineflow.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final CategoryRepository categoryRepository;
    private final DishRepository dishRepository;
    private final TableRepository tableRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        initAdmin();
        initCategoriesAndDishes();
        initTables();
    }

    private void initAdmin() {
        if (adminRepository.count() == 0) {
            Admin superAdmin = Admin.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@dineflow.com")
                    .fullName("Super Admin")
                    .role(AdminRole.SUPER_ADMIN)
                    .active(true)
                    .build();

            adminRepository.save(superAdmin);
            log.info("Default SUPER_ADMIN created: username=admin, password=admin123");
        }
    }

    private void initTables() {
        if (tableRepository.count() == 0) {
            log.info("Initializing restaurant tables...");
            List<RestaurantTable> tables = List.of(
                    RestaurantTable.builder().tableNumber("T-01").capacity(2).qrCodeToken(UUID.randomUUID().toString()).status(TableStatus.AVAILABLE).active(true).build(),
                    RestaurantTable.builder().tableNumber("T-02").capacity(2).qrCodeToken(UUID.randomUUID().toString()).status(TableStatus.AVAILABLE).active(true).build(),
                    RestaurantTable.builder().tableNumber("T-03").capacity(4).qrCodeToken(UUID.randomUUID().toString()).status(TableStatus.AVAILABLE).active(true).build(),
                    RestaurantTable.builder().tableNumber("T-04").capacity(4).qrCodeToken(UUID.randomUUID().toString()).status(TableStatus.AVAILABLE).active(true).build(),
                    RestaurantTable.builder().tableNumber("T-05").capacity(4).qrCodeToken(UUID.randomUUID().toString()).status(TableStatus.AVAILABLE).active(true).build(),
                    RestaurantTable.builder().tableNumber("T-06").capacity(6).qrCodeToken(UUID.randomUUID().toString()).status(TableStatus.AVAILABLE).active(true).build(),
                    RestaurantTable.builder().tableNumber("T-07").capacity(6).qrCodeToken(UUID.randomUUID().toString()).status(TableStatus.AVAILABLE).active(true).build(),
                    RestaurantTable.builder().tableNumber("T-08").capacity(8).qrCodeToken(UUID.randomUUID().toString()).status(TableStatus.AVAILABLE).active(true).build()
            );
            tableRepository.saveAll(tables);
            log.info("Seeded {} restaurant dining tables with QR tokens", tables.size());
        }
    }

    private void initCategoriesAndDishes() {
        if (categoryRepository.count() > 0) {
            return;
        }

        log.info("Initializing restaurant categories and menu dishes...");

        // 1. Starters
        Category starters = categoryRepository.save(Category.builder()
                .name("Starters")
                .description("Crispy, sizzling appetizers to kickstart your feast")
                .imageUrl("https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80")
                .displayOrder(1)
                .active(true)
                .build());

        // 2. Main Course
        Category mainCourse = categoryRepository.save(Category.builder()
                .name("Main Course")
                .description("Hearty, aromatic curries, breads and biryanis")
                .imageUrl("https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80")
                .displayOrder(2)
                .active(true)
                .build());

        // 3. Desserts
        Category desserts = categoryRepository.save(Category.builder()
                .name("Desserts")
                .description("Decadent traditional sweets and baked delights")
                .imageUrl("https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80")
                .displayOrder(3)
                .active(true)
                .build());

        // 4. Ice Cream
        Category iceCream = categoryRepository.save(Category.builder()
                .name("Ice Cream")
                .description("Artisanal scoops, sundaes and refreshing gelatos")
                .imageUrl("https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80")
                .displayOrder(4)
                .active(true)
                .build());

        // 5. Beverages
        Category beverages = categoryRepository.save(Category.builder()
                .name("Beverages")
                .description("Coolers, mocktails, fresh shakes and brewed teas")
                .imageUrl("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80")
                .displayOrder(5)
                .active(true)
                .build());

        List<Dish> dishes = new ArrayList<>();

        // Starters
        dishes.add(Dish.builder()
                .name("Paneer Tikka Angara")
                .description("Smoky cottage cheese cubes marinated in spiced tandoori yogurt with bell peppers")
                .price(new BigDecimal("280.00"))
                .imageUrl("https://images.unsplash.com/photo-1567184109191-3783b3218ce7?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(15)
                .spicyLevel(2)
                .featured(true)
                .category(starters)
                .build());

        dishes.add(Dish.builder()
                .name("Crispy Corn Salt & Pepper")
                .description("Golden fried sweet corn tossed with spring onion, crushed black pepper and cilantro")
                .price(new BigDecimal("220.00"))
                .imageUrl("https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(12)
                .spicyLevel(1)
                .featured(false)
                .category(starters)
                .build());

        dishes.add(Dish.builder()
                .name("Murgh Malai Tikka")
                .description("Tender chicken morsels steeped in cream, cardamom and mild cheese, grilled on skewers")
                .price(new BigDecimal("340.00"))
                .imageUrl("https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.NON_VEG)
                .available(true)
                .prepTimeMinutes(18)
                .spicyLevel(1)
                .featured(true)
                .category(starters)
                .build());

        dishes.add(Dish.builder()
                .name("Amritsari Fish Fry")
                .description("Crisp batter-fried fish fillets dusted with ajwain carom and chaat masala, served with mint chutney")
                .price(new BigDecimal("390.00"))
                .imageUrl("https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.NON_VEG)
                .available(true)
                .prepTimeMinutes(15)
                .spicyLevel(2)
                .featured(false)
                .category(starters)
                .build());

        // Main Course
        dishes.add(Dish.builder()
                .name("Dal Makhani Royale")
                .description("Slow-simmered black lentils with butter, cream and sun-dried fenugreek leaves")
                .price(new BigDecimal("290.00"))
                .imageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(20)
                .spicyLevel(1)
                .featured(true)
                .category(mainCourse)
                .build());

        dishes.add(Dish.builder()
                .name("Paneer Butter Masala")
                .description("Soft cottage cheese simmered in a luscious cashew, tomato and makhani gravy")
                .price(new BigDecimal("320.00"))
                .imageUrl("https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(18)
                .spicyLevel(1)
                .featured(false)
                .category(mainCourse)
                .build());

        dishes.add(Dish.builder()
                .name("Old Delhi Butter Chicken")
                .description("Tandoori chicken pieces cooked in a rich, buttery tomato gravy with honey and fenugreek")
                .price(new BigDecimal("380.00"))
                .imageUrl("https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.NON_VEG)
                .available(true)
                .prepTimeMinutes(22)
                .spicyLevel(2)
                .featured(true)
                .category(mainCourse)
                .build());

        dishes.add(Dish.builder()
                .name("Hyderabadi Dum Biryani (Chicken)")
                .description("Aromatic long-grain basmati rice layered with spiced chicken, saffron and mint, slow cooked in a sealed handi")
                .price(new BigDecimal("410.00"))
                .imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.NON_VEG)
                .available(true)
                .prepTimeMinutes(25)
                .spicyLevel(2)
                .featured(true)
                .category(mainCourse)
                .build());

        // Desserts
        dishes.add(Dish.builder()
                .name("Hot Gulab Jamun with Rabri")
                .description("Golden fried milk-solid dumplings dipped in rose-cardamom syrup topped with thick reduced milk rabri")
                .price(new BigDecimal("160.00"))
                .imageUrl("https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(10)
                .spicyLevel(0)
                .featured(true)
                .category(desserts)
                .build());

        dishes.add(Dish.builder()
                .name("Kesar Rasmalai (2 Pcs)")
                .description("Delicate chenna discs soaked in saffron-infused chilled milk with crushed pistachios")
                .price(new BigDecimal("180.00"))
                .imageUrl("https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(5)
                .spicyLevel(0)
                .featured(false)
                .category(desserts)
                .build());

        // Ice Cream
        dishes.add(Dish.builder()
                .name("Belgian Dark Chocolate Crunch")
                .description("Rich 70% dark Belgian cocoa gelato served with roasted almond flakes and hot fudge swirl")
                .price(new BigDecimal("190.00"))
                .imageUrl("https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(5)
                .spicyLevel(0)
                .featured(true)
                .category(iceCream)
                .build());

        dishes.add(Dish.builder()
                .name("Alphanso Mango Kulfi Sundae")
                .description("Traditional hand-churned Ratnagiri mango kulfi slices dressed with falooda and basil seeds")
                .price(new BigDecimal("170.00"))
                .imageUrl("https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(5)
                .spicyLevel(0)
                .featured(false)
                .category(iceCream)
                .build());

        // Beverages
        dishes.add(Dish.builder()
                .name("Virgin Mojito Royale")
                .description("Crushed mint leaves, fresh lime wedges and cane syrup topped with sparkling soda and ice")
                .price(new BigDecimal("150.00"))
                .imageUrl("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(8)
                .spicyLevel(0)
                .featured(false)
                .category(beverages)
                .build());

        dishes.add(Dish.builder()
                .name("Mango Lassi Special")
                .description("Thick hung curd blended with sweet mango pulp, saffron strands and chopped dry fruits")
                .price(new BigDecimal("140.00"))
                .imageUrl("https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80")
                .dietaryType(DietaryType.VEG)
                .available(true)
                .prepTimeMinutes(6)
                .spicyLevel(0)
                .featured(false)
                .category(beverages)
                .build());

        dishRepository.saveAll(dishes);
        log.info("Seeded {} categories and {} dishes successfully", categoryRepository.count(), dishes.size());
    }
}
