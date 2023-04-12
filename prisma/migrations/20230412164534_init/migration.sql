-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `password_plain` VARCHAR(191) NOT NULL,
    `superadmin` BOOLEAN NOT NULL DEFAULT false,
    `shop_name` VARCHAR(191) NOT NULL,
    `remember_token` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `card_brand` VARCHAR(191) NOT NULL,
    `card_last_four` VARCHAR(191) NOT NULL,
    `trial_ends_at` DATETIME(3) NOT NULL,
    `shop_domain` VARCHAR(191) NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `billing_plan` VARCHAR(191) NOT NULL,
    `trial_starts_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `style` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `product_type` VARCHAR(191) NOT NULL,
    `shipping_price` INTEGER NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `admin_id` INTEGER NOT NULL,

    UNIQUE INDEX `Products_admin_id_key`(`admin_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `weight` DECIMAL(65, 30) NOT NULL,
    `price_cents` INTEGER NOT NULL,
    `sale_price_cents` INTEGER NOT NULL,
    `const_cents` INTEGER NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `length` DECIMAL(65, 30) NOT NULL,
    `width` DECIMAL(65, 30) NOT NULL,
    `height` DECIMAL(65, 30) NOT NULL,
    `note` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Inventory_product_id_key`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `street_address` VARCHAR(191) NOT NULL,
    `apartment` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country_code` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order_status` VARCHAR(191) NOT NULL,
    `payment_ref` VARCHAR(191) NOT NULL,
    `transaction_id` VARCHAR(191) NOT NULL,
    `payment_amt_cents` INTEGER NOT NULL,
    `ship_charged_cents` INTEGER NOT NULL,
    `ship_cost_cents` INTEGER NOT NULL,
    `subtotal_cents` INTEGER NOT NULL,
    `total_cents` INTEGER NOT NULL,
    `shipper_name` VARCHAR(191) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL,
    `shipped_date` DATETIME(3) NOT NULL,
    `tracking_number` VARCHAR(191) NOT NULL,
    `tax_total_cents` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
