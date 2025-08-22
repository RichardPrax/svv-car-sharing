-- CreateEnum
CREATE TYPE "public"."VolleyballPosition" AS ENUM ('MB', 'AA', 'L', 'Z', 'D');

-- CreateTable
CREATE TABLE "public"."user_positions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "position" "public"."VolleyballPosition" NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_positions_user_id_position_key" ON "public"."user_positions"("user_id", "position");

-- AddForeignKey
ALTER TABLE "public"."user_positions" ADD CONSTRAINT "user_positions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
