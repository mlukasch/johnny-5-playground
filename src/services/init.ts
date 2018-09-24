import * as five from 'johnny-five';
import Tessel from 'tessel-io';

const board = new five.Board();
//{io: new Tessel()}
export const onBoardReady = new Promise<void>(resolve =>
	board.on('ready', resolve)
);
