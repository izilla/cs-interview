-- AlterTable
ALTER TABLE `Orders` MODIFY `payment_amt_cents` INTEGER NULL,
    MODIFY `subtotal_cents` INTEGER NULL,
    MODIFY `total_cents` INTEGER NULL,
    MODIFY `tax_total_cents` INTEGER NULL;
