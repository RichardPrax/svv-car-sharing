-- AlterTable
ALTER TABLE "game_participations" ADD COLUMN     "reason" TEXT;

-- CreateTable
CREATE TABLE "bring_items" (
    "id" TEXT NOT NULL,
    "match_day_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bring_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bring_items" ADD CONSTRAINT "bring_items_match_day_id_fkey" FOREIGN KEY ("match_day_id") REFERENCES "match_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bring_items" ADD CONSTRAINT "bring_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
