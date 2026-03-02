/*
  Warnings:

  - You are about to drop the column `departament` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `departament_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_userId_fkey";

-- DropIndex
DROP INDEX "vehicle_userId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "departament",
ADD COLUMN     "departament_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vehicle" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT;

-- CreateTable
CREATE TABLE "brigade" (
    "id" TEXT NOT NULL,
    "departament_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "departament" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "foreman_id" TEXT NOT NULL,
    "brigader_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "warehouse" (
    "id" TEXT NOT NULL,
    "departament_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "brigade_id_key" ON "brigade"("id");

-- CreateIndex
CREATE UNIQUE INDEX "brigade_departament_id_key" ON "brigade"("departament_id");

-- CreateIndex
CREATE UNIQUE INDEX "departament_id_key" ON "departament"("id");

-- CreateIndex
CREATE UNIQUE INDEX "departament_foreman_id_key" ON "departament"("foreman_id");

-- CreateIndex
CREATE UNIQUE INDEX "departament_brigader_id_key" ON "departament"("brigader_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_id_key" ON "warehouse"("id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_departament_id_key" ON "warehouse"("departament_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_user_id_key" ON "vehicle"("user_id");

-- AddForeignKey
ALTER TABLE "brigade" ADD CONSTRAINT "brigade_departament_id_fkey" FOREIGN KEY ("departament_id") REFERENCES "departament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departament" ADD CONSTRAINT "departament_foreman_id_fkey" FOREIGN KEY ("foreman_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departament" ADD CONSTRAINT "departament_brigader_id_fkey" FOREIGN KEY ("brigader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departament_id_fkey" FOREIGN KEY ("departament_id") REFERENCES "departament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle" ADD CONSTRAINT "vehicle_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse" ADD CONSTRAINT "warehouse_departament_id_fkey" FOREIGN KEY ("departament_id") REFERENCES "departament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
