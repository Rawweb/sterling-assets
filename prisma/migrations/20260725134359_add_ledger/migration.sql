-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'PROFIT', 'INVESTMENT', 'BONUS', 'REFERRAL_BONUS', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "LedgerType" NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ledger_userId_idx" ON "Ledger"("userId");

-- CreateIndex
CREATE INDEX "Ledger_userId_type_idx" ON "Ledger"("userId", "type");

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
