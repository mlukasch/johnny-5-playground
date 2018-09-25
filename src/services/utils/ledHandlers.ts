import { Led } from 'johnny-five';
import { promisify } from 'util';
import { onLedMapReady } from './ledInitializer';
import * as _ from 'lodash';
import { board } from '../init';

export const lightOnLed = (led: Led) => {
	led.on();
};

export const lightOffLed = (led: Led) => {
	console.log('lightOffLed');
	// @ts-ignore
	led.stop().off();
};

export const lightUpLed = async (led: Led) => {
	led.on();
	await promisify(setTimeout)(100);
	led.off();
};

export const toggleLed = async (led: Led) => {
	led.toggle();
};

export const pulseLed = async (led: Led) => {
	led.fadeIn(2000);
	await promisify(setTimeout)(100);
	led.fadeOut(2000);
};

export const ledsOff = async () => {
	console.log('ledsOff');
	const ledMap = await onLedMapReady();
	console.log('leds off : ' + _.keys(ledMap));

	for (const led of _.values(ledMap)) {
		led.off();
	}
};
