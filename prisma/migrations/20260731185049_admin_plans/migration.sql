-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuditAction" ADD VALUE 'PLAN_CREATED';
ALTER TYPE "AuditAction" ADD VALUE 'PLAN_UPDATED';
ALTER TYPE "AuditAction" ADD VALUE 'PLAN_ACTIVATED';
ALTER TYPE "AuditAction" ADD VALUE 'PLAN_DEACTIVATED';
ALTER TYPE "AuditAction" ADD VALUE 'USER_PLAN_CANCELLED';

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PLAN_CANCELLED';

-- AlterEnum
ALTER TYPE "UserPlanStatus" ADD VALUE 'CANCELLED';
