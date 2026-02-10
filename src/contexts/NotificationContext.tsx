import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { loadFromStorage, saveToStorage } from '@/lib/storage';
import type { Notification } from '@/types/domain';
import { initialNotifications } from '@/data/mock-notifications';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadFromStorage('notifications', initialNotifications)
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const persist = useCallback((updated: Notification[]) => {
    setNotifications(updated);
    saveToStorage('notifications', updated);
  }, []);

  const addNotification = useCallback(
    (data: Omit<Notification, 'id' | 'read'>) => {
      const newId = Math.max(0, ...notifications.map((n) => n.id)) + 1;
      persist([{ ...data, id: newId, read: false }, ...notifications]);
    },
    [notifications, persist]
  );

  const markAsRead = useCallback(
    (id: number) => {
      persist(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [notifications, persist]
  );

  const markAllAsRead = useCallback(() => {
    persist(notifications.map((n) => ({ ...n, read: true })));
  }, [notifications, persist]);

  const deleteNotification = useCallback(
    (id: number) => {
      persist(notifications.filter((n) => n.id !== id));
    },
    [notifications, persist]
  );

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
