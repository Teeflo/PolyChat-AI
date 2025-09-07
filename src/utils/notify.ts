export async function notify(title: string, body: string) {
  try {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch (e) { console.error('Notification permission request failed:', e); }
    }
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body });
  } catch (e) { console.error('Notification creation failed:', e); }
}
