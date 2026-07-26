-- CreateTable
CREATE TABLE "KycSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentFrontUrl" TEXT NOT NULL,
    "documentBackUrl" TEXT,
    "dateOfBirth" TEXT NOT NULL,
    "addressLine" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "KycSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KycSubmission_userId_idx" ON "KycSubmission"("userId");

-- CreateIndex
CREATE INDEX "KycSubmission_status_idx" ON "KycSubmission"("status");

-- AddForeignKey
ALTER TABLE "KycSubmission" ADD CONSTRAINT "KycSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
