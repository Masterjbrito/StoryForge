import type { ReactNode } from 'react';
import { ProjectProvider } from './ProjectContext';
import { LibraryProvider } from './LibraryContext';
import { NotificationProvider } from './NotificationContext';
import { AuditProvider } from './AuditContext';
import { AgentProvider } from './AgentContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AgentProvider>
      <AuditProvider>
        <NotificationProvider>
          <ProjectProvider>
            <LibraryProvider>
              {children}
            </LibraryProvider>
          </ProjectProvider>
        </NotificationProvider>
      </AuditProvider>
    </AgentProvider>
  );
}
