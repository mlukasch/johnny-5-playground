import { Request, Response } from 'express';
import * as ledService from '../../services/ledService';

export const handleLedToggle = async (req: Request, res: Response) => {
	await ledService.toggleLed();
	return res.redirect('/');
};

export const handleLedPulse = async (req: Request, res: Response) => {
	await ledService.pulseLed();
	return res.redirect('/');
};

export const handleLedSideBySide = async (req: Request, res: Response) => {
	await ledService.sideBySide();
	return res.redirect('/');
};
