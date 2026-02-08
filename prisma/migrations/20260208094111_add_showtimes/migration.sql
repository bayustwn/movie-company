-- CreateTable
CREATE TABLE "Showtime" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Showtime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Showtime_movieId_idx" ON "Showtime"("movieId");

-- CreateIndex
CREATE INDEX "Showtime_studioId_idx" ON "Showtime"("studioId");

-- CreateIndex
CREATE INDEX "Showtime_startTime_idx" ON "Showtime"("startTime");

-- CreateIndex
CREATE INDEX "Showtime_studioId_startTime_idx" ON "Showtime"("studioId", "startTime");

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
