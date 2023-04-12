-- DropIndex
DROP INDEX `Inventory_product_id_key` ON `Inventory`;

-- CreateIndex
CREATE INDEX `Inventory_product_id_idx` ON `Inventory`(`product_id`);
