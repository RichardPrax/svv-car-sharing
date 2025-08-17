-- CreateEnum
CREATE TYPE "GameParticipationStatus" AS ENUM ('JOINING', 'DECLINING', 'TENTATIVE');

-- CreateTable
CREATE TABLE "game_participations" (
    "id" TEXT NOT NULL,
    "match_day_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "status" "GameParticipationStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_participations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_participations_match_day_id_player_id_key" ON "game_participations"("match_day_id", "player_id");

-- AddForeignKey
ALTER TABLE "game_participations" ADD CONSTRAINT "game_participations_match_day_id_fkey" FOREIGN KEY ("match_day_id") REFERENCES "match_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_participations" ADD CONSTRAINT "game_participations_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
