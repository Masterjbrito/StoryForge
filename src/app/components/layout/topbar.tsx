import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, Check, X, AlertTriangle, CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

type View =
  | 'dashboard'
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface TopbarProps {
  onNavigate?: (view: View) => void;
}

export function Topbar({ onNavigate }: TopbarProps) {
  const routerNavigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = (() => {
    try {
      return useNotifications();
    } catch {
      return {
        notifications: [],
        unreadCount: 0,
        markAsRead: (_id: number) => {},
        markAllAsRead: () => {},
        deleteNotification: (_id: number) => {},
        clearAll: () => {},
      };
    }
  })();

  const [legacyNotifications, setLegacyNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Exportacao Concluida',
      message: 'MBWAY-2024: 45 User Stories exportadas para Jira Cloud',
      timestamp: new Date('2026-01-09T10:30:00'),
      read: false,
      project: 'MBWAY-2024'
    },
  ]);

  const inLegacyMode = !!onNavigate;

  const effectiveNotifications = inLegacyMode ? legacyNotifications : notifications;
  const effectiveUnread = inLegacyMode ? legacyNotifications.filter(n => !n.read).length : unreadCount;
  const effectiveMarkRead = inLegacyMode
    ? (id: number) => setLegacyNotifications(legacyNotifications.map(n => n.id === id ? { ...n, read: true } : n))
    : markAsRead;
  const effectiveMarkAllRead = inLegacyMode
    ? () => setLegacyNotifications(legacyNotifications.map(n => ({ ...n, read: true })))
    : markAllAsRead;
  const effectiveDelete = inLegacyMode
    ? (id: number) => setLegacyNotifications(legacyNotifications.filter(n => n.id !== id))
    : deleteNotification;
  const effectiveClear = inLegacyMode
    ? () => setLegacyNotifications([])
    : clearAll;

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'info': return <Bell className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `Ha ${minutes}m`;
    if (hours < 24) return `Ha ${hours}h`;
    return `Ha ${days}d`;
  };

  const goNewProject = () => {
    if (onNavigate) {
      onNavigate('new-project');
    } else {
      routerNavigate('/new-project');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50">
          <Building2 className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-900">Ageas Portugal</span>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Pesquisar projetos, artefactos..."
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={goNewProject}
          className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Projeto
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2 rounded-md hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              {effectiveUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-medium">
                  {effectiveUnread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-96" align="end">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Notificacoes</h3>
                <p className="text-xs text-slate-500">{effectiveUnread} nao lidas</p>
              </div>
              {effectiveUnread > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={effectiveMarkAllRead}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Marcar tudo como lido
                </Button>
              )}
            </div>

            <ScrollArea className="h-[400px]">
              {effectiveNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Nenhuma notificacao</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {effectiveNotifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => effectiveMarkRead(n.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getNotificationBg(n.type)}`}>
                          {getNotificationIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-medium text-slate-900">{n.title}</p>
                            <button
                              className="p-1 hover:bg-slate-200 rounded transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                effectiveDelete(n.id);
                              }}
                            >
                              <X className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{n.message}</p>
                          <div className="flex items-center gap-2">
                            {n.project && (
                              <Badge variant="outline" className="text-xs font-mono">
                                {n.project}
                              </Badge>
                            )}
                            <span className="text-xs text-slate-400">{formatRelativeTime(n.timestamp)}</span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {effectiveNotifications.length > 0 && (
              <div className="p-3 border-t border-slate-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                  onClick={effectiveClear}
                >
                  Limpar todas as notificacoes
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-900">Susana Gamito</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Conta Verificada</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configuracoes de Seguranca</DropdownMenuItem>
            <DropdownMenuItem>Configuracoes de Conta</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
