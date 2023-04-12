/*
  Warnings:

  - Made the column `order_status` on table `Orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Orders` MODIFY `order_status` VARCHAR(191) NOT NULL;
