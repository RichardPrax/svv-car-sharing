-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_days" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "opponent" TEXT NOT NULL,

    CONSTRAINT "match_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rides" (
    "id" TEXT NOT NULL,
    "match_day_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "departure_location" TEXT NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "additional_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ride_passengers" (
    "id" TEXT NOT NULL,
    "ride_id" TEXT NOT NULL,
    "passenger_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ride_passengers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ride_passengers_ride_id_passenger_id_key" ON "ride_passengers"("ride_id", "passenger_id");

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_match_day_id_fkey" FOREIGN KEY ("match_day_id") REFERENCES "match_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_passengers" ADD CONSTRAINT "ride_passengers_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ride_passengers" ADD CONSTRAINT "ride_passengers_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
