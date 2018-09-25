import { Request, Response } from 'express';
import * as ledService from '../../services/ledService';

enum LedCommand {
	toggleLed = 'toggle',
	cycleLed = 'cycle',
	pulseLed = 'pulse',
	oneByOneOn = 'oneByOneOn',
	cycleMiddleOut = 'cycleMiddleOut'
}

export const handleLedCommand = async (req: Request, res: Response) => {
	const ledCommand = req.params['ledCommand'];
	console.log('handleLedCommand : ' + ledCommand);
	switch (ledCommand) {
		case LedCommand.cycleLed:
			await ledService.sideBySide();
			break;
		case LedCommand.oneByOneOn:
			await ledService.oneByOneOn();
			break;
		case LedCommand.cycleMiddleOut:
			ledService.middleOut();
			break;
	}
	return res.redirect('/');
};
