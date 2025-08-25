/*
  Warnings:

  - The values [TENTATIVE] on the enum `GameParticipationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameParticipationStatus_new" AS ENUM ('JOINING', 'DECLINING');
ALTER TABLE "game_participations" ALTER COLUMN "status" TYPE "GameParticipationStatus_new" USING ("status"::text::"GameParticipationStatus_new");
ALTER TYPE "GameParticipationStatus" RENAME TO "GameParticipationStatus_old";
ALTER TYPE "GameParticipationStatus_new" RENAME TO "GameParticipationStatus";
DROP TYPE "GameParticipationStatus_old";
COMMIT;
