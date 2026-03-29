-- DropForeignKey
ALTER TABLE "departament" DROP CONSTRAINT "departament_brigader_id_fkey";

-- DropForeignKey
ALTER TABLE "departament" DROP CONSTRAINT "departament_foreman_id_fkey";

-- AlterTable
ALTER TABLE "departament" ALTER COLUMN "foreman_id" DROP NOT NULL,
ALTER COLUMN "brigader_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "departament" ADD CONSTRAINT "departament_foreman_id_fkey" FOREIGN KEY ("foreman_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departament" ADD CONSTRAINT "departament_brigader_id_fkey" FOREIGN KEY ("brigader_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
