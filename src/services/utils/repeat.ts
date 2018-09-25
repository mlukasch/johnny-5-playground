import { Led } from 'johnny-five';
import Timer = NodeJS.Timer;
import { ledsOff } from './ledHandlers';
import { promisify } from 'util';

export const repeat = (
	asyncGenerator: () => AsyncIterator<Led[]>,
	handleLed: (led: Led) => void,
	interval: number
) => {
	let intervalId: Timer | null = null;
	return async () => {
		if (intervalId) {
			console.log('Turn Cycle off... ');
			clearInterval(intervalId);
			await promisify(setTimeout)(1000);
			await ledsOff();
			intervalId = null;
		} else {
			console.log('Turn Cycle on...');
			const asyncIterator = asyncGenerator();
			intervalId = setInterval(async () => {
				console.log('setInterval');
				const next = await asyncIterator.next();
				if (!next.done) {
					const leds = next.value;
					leds.forEach(handleLed);
				}
			}, interval);
		}
	};
};
