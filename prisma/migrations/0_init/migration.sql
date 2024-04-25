-- CreateTable
CREATE TABLE "client" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR(50) NOT NULL,
    "middle_name" VARCHAR(50),
    "first_surname" VARCHAR(50) NOT NULL,
    "second_surname" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "address" TEXT NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "country" VARCHAR(3) NOT NULL,
    "demonym" VARCHAR(20) NOT NULL,

    CONSTRAINT "client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "client_email_key" ON "client"("email");

