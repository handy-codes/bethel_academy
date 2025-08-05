/*
  Warnings:

  - Added the required column `amount` to the `Purchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Purchase` ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'NGN',
    ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `transactionId` VARCHAR(191) NULL,
    ADD COLUMN `txRef` VARCHAR(191) NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE INDEX `Purchase_status_idx` ON `Purchase`(`status`);

-- CreateIndex
CREATE INDEX `Purchase_isActive_idx` ON `Purchase`(`isActive`);

-- CreateIndex
CREATE INDEX `Purchase_startDate_idx` ON `Purchase`(`startDate`);

-- CreateIndex
CREATE INDEX `Purchase_endDate_idx` ON `Purchase`(`endDate`);
