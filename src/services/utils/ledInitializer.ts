import * as _ from 'lodash';
import { onBoardReady } from '../init';
import { Led } from 'johnny-five';

const onLedCreated = _.memoize(async (pin: string) => {
	console.log('onLedCreated');
	await onBoardReady;
	// @ts-ignore
	return new Led({
		pin
	});
});

const onLedsReady = (...pins: string[]) => {
	return Promise.all(pins.map((ledPin: string) => onLedCreated(ledPin)));
};

export const onLedMapReady = async () => {
	const ledPins = ['13', '12', '11', '10', '9', '8'];
	const leds = await onLedsReady(...ledPins);
	return ledPins.reduce((acc, pin, idx) => {
		// @ts-ignore
		acc[pin] = leds[idx];
		return acc;
	}, {}) as { [key: string]: Led };
};
