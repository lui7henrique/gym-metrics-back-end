-- CreateTable
CREATE TABLE "trainings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "days" ADD CONSTRAINT "days_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "days"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
