/*
  Warnings:

  - You are about to drop the column `status` on the `Submissions` table. All the data in the column will be lost.
  - Added the required column `code` to the `Submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Submissions" DROP COLUMN "status",
ADD COLUMN     "code" TEXT NOT NULL;
