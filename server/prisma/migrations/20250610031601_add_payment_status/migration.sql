-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID');

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "payment" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
