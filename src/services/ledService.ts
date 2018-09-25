import { Led } from 'johnny-five';
import { promisify } from 'util';
import { lightUpLed, toggleLed } from './utils/ledHandlers';
import { repeat } from './utils/repeat';
import { onLedMapReady } from './utils/ledInitializer';

// One-By-One
const genInfinitePinBatches: (
	...ledPinBatches: string[][]
) => () => AsyncIterator<Led[]> = (...ledPinBatches) =>
	async function*() {
		const sleep = () => promisify(setTimeout)(200);
		const ledMap = await onLedMapReady();

		while (true) {
			for (const batch of ledPinBatches) {
				yield batch.map(ledPin => ledMap[ledPin]);
				await sleep();
			}
		}
	};

export const sideBySide = repeat(
	genInfinitePinBatches(
		['13'],
		['12'],
		['11'],
		['10'],
		['9'],
		['8'],
		['9'],
		['10'],
		['11'],
		['12']
	),
	lightUpLed,
	200
);

// One by One on + One by One off
export const oneByOneOn = repeat(
	genInfinitePinBatches(
		['13'],
		['12'],
		['11'],
		['10'],
		['9'],
		['8'],
		['8'],
		['9'],
		['10'],
		['11'],
		['12'],
		['13']
	),
	toggleLed,
	200
);

// Middle -> Out
export const middleOut = repeat(
	genInfinitePinBatches(['11', '10'], ['12', '9'], ['13', '8'], ['12', '9']),
	toggleLed,
	200
);
