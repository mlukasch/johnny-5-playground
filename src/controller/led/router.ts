import express from 'express';
import * as ledController from './controller';

export const ledRouter = express.Router();
ledRouter.post('/', ledController.handleLedSideBySide);
