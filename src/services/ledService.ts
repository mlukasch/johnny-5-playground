import { onBoardReady } from './init';
import { Led } from 'johnny-five';
import * as _ from 'lodash';
import { promisify } from 'util';
import Timer = NodeJS.Timer;

const onLedCreated = _.memoize(async (pin: string = 'a5') => {
	await onBoardReady;
	// @ts-ignore
	return new Led({
		pin
	});
});

export const toggleLed = async () => {
	const led = await onLedCreated();
	led.toggle();
};

// Wrap state in Closure to avoid glob vars:
const createPulseLed = () => {
	// State:
	let ledOn = false;
	return async () => {
		const led = await onLedCreated();
		ledOn = !ledOn;
		ledOn ? led.fadeIn(2000) : led.fadeOut(2000);
	};
};
export const pulseLed = createPulseLed();

const createSideBySide = () => {
	let ledSideBySideId: Timer | null = null;
	return () => {
		if (ledSideBySideId) {
			console.log('Turn Cycle off...');
			clearInterval(ledSideBySideId);
			ledSideBySideId = null;
		} else {
			console.log('Turn Cycle on...');
			ledSideBySideId = setInterval(createCycler(), 1000);
		}
	};
};

const createCycler = () => {
	let pinIdx = 0;
	let pinIdxInc = true;
	const ledPins = ['a7', 'a6', 'a5', 'a4', 'a3', 'a2'];
	return () => {
		console.log('Light up Led ' + ledPins[pinIdx]);
		lightUpLed(ledPins[pinIdx]);
		if (pinIdx === 5) {
			pinIdxInc = false;
		} else if (pinIdx === 0) {
			pinIdxInc = true;
		}
		pinIdxInc ? pinIdx++ : pinIdx--;
	};
};

export const sideBySide = createSideBySide();

const lightUpLed = async (pin: string) => {
	const led = await onLedCreated(pin);
	led.on();
	await promisify(setTimeout)(1000);
	led.off();
};
