-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthday" TIMESTAMP(3),
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT DEFAULT 'Cambodia',
ADD COLUMN     "facebookLink" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "professions" TEXT[],
ADD COLUMN     "telegramLink" TEXT;
