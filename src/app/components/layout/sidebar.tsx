import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileStack,
  Library as LibraryIcon,
  Link2,
  FileSearch,
  Shield
} from 'lucide-react';

type View =
  | 'dashboard'
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface SidebarProps {
  currentView?: View;
  onNavigate?: (view: View) => void;
}

const menuItems = [
  { view: 'dashboard' as View, path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', section: 'main' },
  { view: 'templates' as View, path: '/templates', icon: FileStack, label: 'Templates', section: 'resources' },
  { view: 'library' as View, path: '/library', icon: LibraryIcon, label: 'Biblioteca', section: 'resources' },
  { view: 'integrations' as View, path: '/integrations', icon: Link2, label: 'Integracoes', section: 'admin' },
  { view: 'audit' as View, path: '/audit', icon: FileSearch, label: 'Auditoria & Logs', section: 'admin' },
];

const sections = [
  { id: 'main', label: null },
  { id: 'resources', label: 'Recursos' },
  { id: 'admin', label: 'Administracao' },
];

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const routerNavigate = useNavigate();
  const location = useLocation();

  const isLegacyMode = !!onNavigate;

  const goTo = (item: (typeof menuItems)[number]) => {
    if (onNavigate) {
      onNavigate(item.view);
      return;
    }
    routerNavigate(item.path);
  };

  const isActive = (item: (typeof menuItems)[number]) => {
    if (isLegacyMode && currentView) return currentView === item.view;
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => (onNavigate ? onNavigate('dashboard') : routerNavigate('/dashboard'))}>
          <div className="w-8 h-8 bg-slate-900 rounded-md flex items-center justify-center">
            <span className="text-white font-semibold text-sm">SF</span>
          </div>
          <div>
            <h1 className="font-semibold text-slate-900">StoryForge</h1>
            <p className="text-xs text-slate-500">Banking Requirements</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            {section.label && (
              <div className="px-6 mb-2">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {section.label}
                </p>
              </div>
            )}
            <div className="space-y-1 px-3">
              {menuItems
                .filter(item => item.section === section.id)
                .map((item) => (
                  <button
                    key={item.view}
                    onClick={() => goTo(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item)
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600">
          <Shield className="w-4 h-4 text-green-600" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 text-xs">PSD2 Compliant</p>
            <p className="text-xs text-slate-500 truncate">Auditoria ativa</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
