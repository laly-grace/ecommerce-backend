import * as pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const createLogger = (pino as any).default ?? (pino as any);

export const logger = createLogger({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: { colorize: true },
      }
    : undefined,
});
