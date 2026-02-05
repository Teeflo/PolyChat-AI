export async function notify(title: string, body: string) {
  try {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body });
  } catch {
    // Silent fail for notifications
  }
}
