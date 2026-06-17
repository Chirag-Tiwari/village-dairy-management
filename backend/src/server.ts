import { app } from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`Village Dairy API listening on http://localhost:${env.port}`);
});
