export const logger = {
  error: (...args: any[]) => {
    if (import.meta.env.DEV) console.error(...args);
  },
  info: (...args: any[]) => {
    if (import.meta.env.DEV) console.info(...args);
  },
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) console.debug(...args);
  },
};
