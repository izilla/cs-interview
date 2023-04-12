-- DropIndex
DROP INDEX `Products_admin_id_key` ON `Products`;

-- CreateIndex
CREATE INDEX `Products_admin_id_idx` ON `Products`(`admin_id`);
