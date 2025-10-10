-- CreateTable
CREATE TABLE "public"."training_series" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "weekdays" INTEGER[],
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "start_week" TIMESTAMP(3) NOT NULL,
    "end_week" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trainings" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "series_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."training_participations" (
    "id" TEXT NOT NULL,
    "training_id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "status" "public"."GameParticipationStatus" NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_participations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "training_participations_training_id_player_id_key" ON "public"."training_participations"("training_id", "player_id");

-- AddForeignKey
ALTER TABLE "public"."trainings" ADD CONSTRAINT "trainings_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."training_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_participations" ADD CONSTRAINT "training_participations_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "public"."trainings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."training_participations" ADD CONSTRAINT "training_participations_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
