-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ONGOING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "buyerAgreed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "buyerAgreedAt" TIMESTAMP(3),
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "sellerAgreed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sellerAgreedAt" TIMESTAMP(3),
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'ONGOING';
