/**
 * Local push notifications for budget alerts and reminders.
 */

import * as Notifications from 'expo-notifications';
import type { BudgetStatus } from './budget';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function checkAndNotifyBudgetAlert(budget: BudgetStatus): Promise<void> {
  if (!budget.hasBudget) return;

  const pct = budget.percentUsed;
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  if (pct >= 100) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Budget Terlampaui!',
        body: `Pengeluaran kamu sudah ${pct}% dari budget bulan ini. Kurangi pengeluaran ya!`,
        data: { type: 'budget_over' },
      },
      trigger: null,
    });
  } else if (pct >= 80) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Budget Hampir Habis',
        body: `Pengeluaran sudah mencapai ${pct}% dari budget. Sisa ${formatCompact(budget.totalRemaining)}.`,
        data: { type: 'budget_warning' },
      },
      trigger: null,
    });
  }
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
}

export async function scheduleRecurringReminder(
  title: string,
  body: string,
  delaySeconds: number
): Promise<string> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return '';

  const id = await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { type: 'recurring_reminder' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySeconds, repeats: false },
  });
  return id;
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
