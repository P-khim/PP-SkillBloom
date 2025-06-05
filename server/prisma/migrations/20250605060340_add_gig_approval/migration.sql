-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Gigs" ADD COLUMN     "approvalStatus" "Status" NOT NULL DEFAULT 'pending',
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;
