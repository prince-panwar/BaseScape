/*
  Warnings:

  - Added the required column `username` to the `tbl_deposit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_deposit` ADD COLUMN `username` TEXT NOT NULL;
