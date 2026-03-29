/*
  Warnings:

  - The `id` column on the `brigade` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id` column on the `departament` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `vehicle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `user_id` column on the `vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id` column on the `warehouse` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `departament_id` on the `brigade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `foreman_id` on the `departament` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `brigader_id` on the `departament` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departament_id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `departament_id` on the `warehouse` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "brigade" DROP CONSTRAINT "brigade_departament_id_fkey";

-- DropForeignKey
ALTER TABLE "departament" DROP CONSTRAINT "departament_brigader_id_fkey";

-- DropForeignKey
ALTER TABLE "departament" DROP CONSTRAINT "departament_foreman_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_departament_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_user_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse" DROP CONSTRAINT "warehouse_departament_id_fkey";

-- AlterTable
ALTER TABLE "brigade" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "departament_id",
ADD COLUMN     "departament_id" INTEGER NOT NULL,
ADD CONSTRAINT "brigade_id_check" CHECK (id >= 25 AND id <= 36);

-- AlterTable
ALTER TABLE "departament" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "foreman_id",
ADD COLUMN     "foreman_id" INTEGER NOT NULL,
DROP COLUMN "brigader_id",
ADD COLUMN     "brigader_id" INTEGER NOT NULL,
ADD CONSTRAINT "departament_id_check" CHECK (id >= 1 AND id <= 12);

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "departament_id",
ADD COLUMN     "departament_id" INTEGER NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "vehicle" DROP CONSTRAINT "vehicle_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER,
ADD CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id"),
ADD CONSTRAINT "vehicle_id_check" CHECK (id >= 50 AND id <= 99);;

-- AlterTable
ALTER TABLE "warehouse" DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "departament_id",
ADD COLUMN     "departament_id" INTEGER NOT NULL,
ADD CONSTRAINT "departament_id_check" CHECK (id >= 13 AND id <= 24);


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
CREATE UNIQUE INDEX "vehicle_user_id_key" ON "vehicle"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_id_key" ON "warehouse"("id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_departament_id_key" ON "warehouse"("departament_id");

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

ALTER SEQUENCE "users_id_seq" RESTART WITH 100;
ALTER SEQUENCE "vehicle_id_seq" RESTART WITH 50;
ALTER SEQUENCE "warehouse_id_seq" RESTART WITH 13;
ALTER SEQUENCE "brigade_id_seq" RESTART WITH 26;
