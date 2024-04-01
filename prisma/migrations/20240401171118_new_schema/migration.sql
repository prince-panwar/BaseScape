-- CreateTable
CREATE TABLE `User` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` TEXT NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_deposit` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `claim` BOOLEAN NOT NULL,
    `address` VARCHAR(42) NOT NULL,
    `userId` BIGINT NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_Stake` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `claim` BOOLEAN NOT NULL,
    `address` VARCHAR(42) NOT NULL,
    `userId` BIGINT NOT NULL,
    `startDate` TEXT NOT NULL,
    `duration` TEXT NOT NULL,
    `endDate` TEXT NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `candidate` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
