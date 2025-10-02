/*
  Warnings:

  - The primary key for the `Submissions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."Submissions" DROP CONSTRAINT "Submissions_pkey",
ALTER COLUMN "userId" DROP DEFAULT,
ADD CONSTRAINT "Submissions_pkey" PRIMARY KEY ("userId", "createdAt");
DROP SEQUENCE "Submissions_userId_seq";

-- CreateTable
CREATE TABLE "public"."User" (
    "userId" SERIAL NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."userCodes" (
    "userId" INTEGER NOT NULL,
    "codeUUID" TEXT NOT NULL,

    CONSTRAINT "userCodes_pkey" PRIMARY KEY ("userId","codeUUID")
);

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."userCodes" ADD CONSTRAINT "userCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
