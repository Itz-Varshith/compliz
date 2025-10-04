-- DropForeignKey
ALTER TABLE "public"."Submissions" DROP CONSTRAINT "Submissions_langId_fkey";

-- AlterTable
ALTER TABLE "public"."Submissions" ALTER COLUMN "langId" SET DATA TYPE TEXT;
