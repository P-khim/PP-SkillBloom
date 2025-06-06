-- CreateEnum
CREATE TYPE "DeleteStatus" AS ENUM ('none', 'requested', 'deleted');

-- AlterTable
ALTER TABLE "Gigs" ADD COLUMN     "deleteStatus" "DeleteStatus" NOT NULL DEFAULT 'none',
ADD COLUMN     "isDeletePending" BOOLEAN NOT NULL DEFAULT false;
