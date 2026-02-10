import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/components/layout/AppLayout';
import { Dashboard } from '@/app/components/pages/dashboard';
import { NewProject } from '@/app/components/pages/new-project';
import { ProjectBuilder } from '@/app/components/pages/project-builder';
import { ProjectView } from '@/app/components/pages/project-view';
import { Templates } from '@/app/components/pages/templates';
import { Library } from '@/app/components/pages/library';
import { Integrations } from '@/app/components/pages/integrations';
import { Audit } from '@/app/components/pages/audit';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'new-project', element: <NewProject /> },
      { path: 'project-builder', element: <ProjectBuilder /> },
      { path: 'project-builder/:projectId', element: <ProjectBuilder /> },
      { path: 'project/:projectId', element: <ProjectView /> },
      { path: 'templates', element: <Templates /> },
      { path: 'library', element: <Library /> },
      { path: 'integrations', element: <Integrations /> },
      { path: 'audit', element: <Audit /> },
    ],
  },
]);
