import { useState } from 'react';
import { Sidebar } from './components/layout/sidebar';
import { Topbar } from './components/layout/topbar';
import { Dashboard } from './components/pages/dashboard';
import { NewProject } from './components/pages/new-project';
import { ProjectBuilder } from './components/pages/project-builder';
import { ProjectView } from './components/pages/project-view';
import { Templates } from './components/pages/templates';
import { Library } from './components/pages/library';
import { Integrations } from './components/pages/integrations';
import { Audit } from './components/pages/audit';

type View = 
  | 'dashboard' 
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectData, setProjectData] = useState<any>(null);

  const handleViewProject = (projectId: number) => {
    setSelectedProjectId(projectId);
    setCurrentView('project-view');
  };

  const handleCreateProject = (data: any) => {
    setProjectData(data);
    setCurrentView('project-builder');
  };

  const handleFinishProject = () => {
    // Ao finalizar o Project Builder, define um ID especial (999) para o novo projeto
    setSelectedProjectId(999);
    setCurrentView('project-view');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} onViewProject={handleViewProject} />;
      case 'new-project':
        return <NewProject onNavigate={setCurrentView} onCreate={handleCreateProject} />;
      case 'project-builder':
        return <ProjectBuilder onNavigate={setCurrentView} projectData={projectData} onFinish={handleFinishProject} />;
      case 'project-view':
        return <ProjectView onNavigate={setCurrentView} projectId={selectedProjectId} />;
      case 'templates':
        return <Templates onNavigate={setCurrentView} />;
      case 'library':
        return <Library onNavigate={setCurrentView} />;
      case 'integrations':
        return <Integrations onNavigate={setCurrentView} />;
      case 'audit':
        return <Audit onNavigate={setCurrentView} />;
      default:
        return <Dashboard onNavigate={setCurrentView} onViewProject={handleViewProject} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Fixed Sidebar */}
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar onNavigate={setCurrentView} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}