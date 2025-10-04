/*
  Warnings:

  - The primary key for the `Submissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `userCodes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Submissions" DROP CONSTRAINT "Submissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."userCodes" DROP CONSTRAINT "userCodes_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Submissions" DROP CONSTRAINT "Submissions_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Submissions_pkey" PRIMARY KEY ("userId", "createdAt");

-- AlterTable
ALTER TABLE "public"."User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "userId" DROP DEFAULT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");
DROP SEQUENCE "User_userId_seq";

-- AlterTable
ALTER TABLE "public"."userCodes" DROP CONSTRAINT "userCodes_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "userCodes_pkey" PRIMARY KEY ("userId", "codeUUID");

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userCodes" ADD CONSTRAINT "userCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
