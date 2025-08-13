-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'TRAINER', 'PENALTY_MASTER', 'PLAYER');

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
