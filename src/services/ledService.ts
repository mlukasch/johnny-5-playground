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
	const led = await onLedCreated('13');
	led.toggle();
};

// Wrap state in Closure to avoid glob vars:
const createPulseLed = () => {
	// State:
	let ledOn = false;
	return async () => {
		const led = await onLedCreated('11');
		ledOn = !ledOn;
		ledOn ? led.fadeIn(2000) : led.fadeOut(2000);
	};
};
export const pulseLed = createPulseLed();

const repeater = <T>(loopedFunction: () => T, interval: number) => {
	let intervalId: Timer | null = null;
	return () => {
		if (intervalId) {
			console.log('Turn Cycle off...');
			clearInterval(intervalId);
			intervalId = null;
		} else {
			console.log('Turn Cycle on...');
			loopedFunction();
			intervalId = setInterval(loopedFunction, interval);
		}
	};
};

const createCycler = (ledHandler: (led: Led) => void) => {
	let pinIdx = 0;
	let pinIdxInc = true;
	const ledPins = ['13', '12', '11', '10', '9', '8'];
	return async () => {
		console.log('Light up Led ' + ledPins[pinIdx]);
		onLedCreated(ledPins[pinIdx]).then(ledHandler);
		pinIdxInc ? pinIdx++ : pinIdx--;
		if (pinIdx === 5) {
			pinIdxInc = false;
		} else if (pinIdx === 0) {
			pinIdxInc = true;
		}
	};
};

const lightUpLed = async (led: Led) => {
	led.on();
	await promisify(setTimeout)(100);
	led.off();
};

export const sideBySide = repeater(createCycler(lightUpLed), 200);

const lightOnLed = (led: Led) => {
	led.on();
};

const cycleOnce = (ledHandler: (led: Led) => void) => {
	const ledPins = ['13', '12', '11', '10', '9', '8'];
	const onAllLedsReady = Promise.all(
		ledPins.map((ledPin: string) => onLedCreated(ledPin))
	);
	return async () => {
		const allLeds = await onAllLedsReady;
		for (const led of allLeds) {
			ledHandler(led);
			await promisify(setTimeout)(200);
		}
		allLeds.forEach(led => led.off());
	};
};
export const oneByOneOn = repeater(cycleOnce(lightOnLed), 2000);
