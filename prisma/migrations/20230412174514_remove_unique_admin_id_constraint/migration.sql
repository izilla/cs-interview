/*
  Warnings:

  - You are about to drop the column `const_cents` on the `Inventory` table. All the data in the column will be lost.
  - Added the required column `cost_cents` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Inventory` DROP COLUMN `const_cents`,
    ADD COLUMN `cost_cents` INTEGER NOT NULL;
