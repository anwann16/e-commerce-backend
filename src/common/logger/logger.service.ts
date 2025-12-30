import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  constructor(private readonly logger: PinoLogger) {}

  setContext(context: string) {
    this.logger.setContext(context);
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(meta ?? {}, message);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(meta ?? {}, message);
  }

  error(message: string, error?: unknown, meta?: Record<string, any>) {
    this.logger.error(
      {
        err: error,
        ...meta,
      },
      message,
    );
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(meta ?? {}, message);
  }
}
