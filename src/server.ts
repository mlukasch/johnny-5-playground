import express from 'express';
import * as path from 'path';
import { ledRouter } from './controller/led/router';

(async () => {
	console.log('ready...');
	const app = express();

	app.use(express.static(path.join(__dirname, '..', 'public')));

	app.use('/', ledRouter);

	app.listen(80);
})();
