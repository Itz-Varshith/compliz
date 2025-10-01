-- CreateTable
CREATE TABLE "public"."Question" (
    "questionUUID" TEXT NOT NULL,
    "questionId" SERIAL NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "public"."Language" (
    "langId" SERIAL NOT NULL,
    "langName" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("langId")
);

-- CreateTable
CREATE TABLE "public"."Submissions" (
    "userId" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "timeUsed" INTEGER NOT NULL,
    "memoryUsed" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "langId" INTEGER NOT NULL,

    CONSTRAINT "Submissions_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("questionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submissions" ADD CONSTRAINT "Submissions_langId_fkey" FOREIGN KEY ("langId") REFERENCES "public"."Language"("langId") ON DELETE RESTRICT ON UPDATE CASCADE;
