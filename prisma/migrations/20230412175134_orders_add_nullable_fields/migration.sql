-- AlterTable
ALTER TABLE `Orders` MODIFY `payment_ref` VARCHAR(191) NULL,
    MODIFY `transaction_id` VARCHAR(191) NULL,
    MODIFY `ship_cost_cents` INTEGER NULL;
