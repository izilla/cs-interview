/*
  Warnings:

  - Added the required column `inventory_id` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Orders` ADD COLUMN `inventory_id` INTEGER NOT NULL,
    MODIFY `city` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Orders_inventory_id_idx` ON `Orders`(`inventory_id`);
