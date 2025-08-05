-- AlterTable
ALTER TABLE `Course` ADD COLUMN `liveCategoryId` VARCHAR(191) NULL,
    ADD COLUMN `liveSubCategoryId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `LiveClassPurchase` ADD COLUMN `currency` VARCHAR(191) NOT NULL DEFAULT 'NGN';

-- AlterTable
ALTER TABLE `MathsDemo` MODIFY `trainingDate` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `LiveCourseCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LiveCourseCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LiveCourseSubCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` VARCHAR(191) NOT NULL,

    INDEX `LiveCourseSubCategory_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Course_liveCategoryId_idx` ON `Course`(`liveCategoryId`);

-- CreateIndex
CREATE INDEX `Course_liveSubCategoryId_idx` ON `Course`(`liveSubCategoryId`);
