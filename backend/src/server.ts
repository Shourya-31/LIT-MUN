import 'dotenv/config';
import { env } from './config/env.js';
import { buildApp } from './app.js';

const app = await buildApp();

try {
  await app.listen({ host: '0.0.0.0', port: env.PORT });
} catch (error) {
  app.log.error({ err: error }, 'Server startup failed');
  await app.close();
  process.exitCode = 1;
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void app.close().then(
      () => process.exit(0),
      (error: unknown) => {
        app.log.error({ err: error }, 'Server shutdown failed');
        process.exit(1);
      },
    );
  });
}
