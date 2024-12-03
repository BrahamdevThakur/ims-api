/*
  Warnings:

  - The primary key for the `items_organizations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "items_organizations" DROP CONSTRAINT "items_organizations_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "items_organizations_pkey" PRIMARY KEY ("id");
