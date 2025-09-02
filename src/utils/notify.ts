export async function notify(title: string, body: string) {
  try {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch {}
    }
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body });
  } catch {}
}
