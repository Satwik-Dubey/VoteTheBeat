/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,trackId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addedBy` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackId` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "addedBy" TEXT NOT NULL,
ADD COLUMN     "trackId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_songId_userId_key" ON "Vote"("songId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Song_sessionId_trackId_key" ON "Song"("sessionId", "trackId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
