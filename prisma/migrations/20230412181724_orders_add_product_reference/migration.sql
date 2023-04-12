-- AlterTable
ALTER TABLE `Orders` MODIFY `product_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `Orders_product_id_idx` ON `Orders`(`product_id`);
