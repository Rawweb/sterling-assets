-- AlterEnum
ALTER TYPE "LedgerType" ADD VALUE 'PRINCIPAL_RETURN';

-- AlterTable
ALTER TABLE "UserPlan" ADD COLUMN     "lastPaidAt" TIMESTAMP(3);
