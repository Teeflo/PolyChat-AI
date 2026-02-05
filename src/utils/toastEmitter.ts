export type ToastType = 'success' | 'error' | 'warning' | 'info';

export const toast = {
  success: (title: string, message?: string) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'success', title, message } }));
  },
  error: (title: string, message?: string) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', title, message } }));
  },
  warning: (title: string, message?: string) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'warning', title, message } }));
  },
  info: (title: string, message?: string) => {
    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', title, message } }));
  },
};
