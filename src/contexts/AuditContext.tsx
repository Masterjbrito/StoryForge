import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import type { AuditLog, AuditActionType } from '@/types/domain';
import { initialAuditLogs } from '@/data/mock-audit';

interface AuditContextValue {
  auditLogs: AuditLog[];
  logAction: (entry: {
    action: string;
    actionType: AuditActionType;
    user: string;
    userInitials: string;
    project: string | null;
    projectName: string | null;
    details: string;
    status: 'success' | 'error' | 'warning';
  }) => void;
}

const AuditContext = createContext<AuditContextValue | null>(null);

export function AuditProvider({ children }: { children: ReactNode }) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadFromStorage('auditLogs', initialAuditLogs)
  );

  const logAction = useCallback(
    (entry: {
      action: string;
      actionType: AuditActionType;
      user: string;
      userInitials: string;
      project: string | null;
      projectName: string | null;
      details: string;
      status: 'success' | 'error' | 'warning';
    }) => {
      const newId = Math.max(0, ...auditLogs.map((l) => l.id)) + 1;
      const newLog: AuditLog = {
        id: newId,
        ...entry,
        timestamp: new Date(),
        ipAddress: '10.24.156.78',
        duration: '1s',
      };
      const updated = [newLog, ...auditLogs];
      setAuditLogs(updated);
      saveToStorage('auditLogs', updated);
    },
    [auditLogs]
  );

  return (
    <AuditContext.Provider value={{ auditLogs, logAction }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error('useAudit must be used within AuditProvider');
  return ctx;
}
