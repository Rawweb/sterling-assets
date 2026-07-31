import 'server-only';
import { prisma } from './db';

export async function getAuditLogs() {
  // AuditLog has no User relation in the schema, so we fetch admin
  // names in a second query and join in memory. There are very few
  // admins so this is always a tiny query.
  const [logs, admins] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        adminId: true,
        action: true,
        targetId: true,
        createdAt: true,
      },
    }),
    prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, fullName: true },
    }),
  ]);

  const adminMap = Object.fromEntries(admins.map((a) => [a.id, a.fullName]));

  return logs.map((log) => ({
    ...log,
    adminName: adminMap[log.adminId] ?? 'Unknown',
  }));
}

export type AuditLogRow = Awaited<ReturnType<typeof getAuditLogs>>[number];
