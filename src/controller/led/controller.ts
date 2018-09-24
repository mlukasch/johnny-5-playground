import { Request, Response } from 'express';
import * as ledService from '../../services/ledService';

enum LedCommand {
	toggleLed = 'toggle',
	cycleLed = 'cycle',
	pulseLed = 'pulse'
}

export const handleLedCommand = async (req: Request, res: Response) => {
	const ledCommand = req.params['ledCommand'];
	console.log('handleLedCommand : ' + ledCommand);
	switch (ledCommand) {
		case LedCommand.toggleLed:
			await ledService.toggleLed();
			break;
		case LedCommand.cycleLed:
			await ledService.sideBySide();
			break;
		case LedCommand.pulseLed:
			await ledService.pulseLed();
			break;
	}
	return res.redirect('/');
};
