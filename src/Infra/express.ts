import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { loggingMiddleware, requestLogger } from './logging';

export const configureExpress = (app: express.Application): void => {
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggingMiddleware);
  app.use(requestLogger);

  app.set('trust proxy', 1);
  app.disable('x-powered-by');
};
