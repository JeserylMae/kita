import express from 'express';
import config from './config';
import { loader } from './loader/express';


const startServer = () => {
  const app = express();
  const port = config.port || 3000;

  loader({ app });

  app.listen(port, () => {
    // @TODO: Logger
    console.log(`Listening on http://localhost:${port}`);
  });
}
startServer();