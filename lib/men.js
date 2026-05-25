/*
	men.js - 'MEN' stands for Miniwebtoken Element Notation.
		Provides functions to convert property values to token elements, and vice versa.
*/

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const addon = require('../src/build/Release/addon.node');

const MEN = {
	POSITIVE_MARKER: '.',
	STRING_MARKER: '~',
	NEGATIVE_MARKER: '!',
	FLOAT64_MARKER: '(',

	errMsgs: {
		INVALID_ARGS_FOR_SET: 'Arguments for set() function should be either a string, a Key object or functions which return a key object.',
	},

	splitTokenStr: (tokenStr) => {
		const elements = [];
		let curIndex = 0, nextIndex = 0;

		while(nextIndex < tokenStr.length) {
			if(tokenStr[nextIndex] === MEN.POSITIVE_MARKER
				|| tokenStr[nextIndex] === MEN.STRING_MARKER
				|| tokenStr[nextIndex] === MEN.NEGATIVE_MARKER
				|| tokenStr[nextIndex] === MEN.FLOAT64_MARKER) {
				elements.push(tokenStr.slice(curIndex, nextIndex));
				curIndex = nextIndex;
			}
			nextIndex++;
		}
		elements.push(tokenStr.slice(curIndex, nextIndex));

		return elements;
	},
	
	valueToMen: (value) => {
		if(!value) return;
		if(Number.isFinite(value)) return addon.encode(value);
		else if(typeof value === 'string') return MEN.STRING_MARKER + Buffer.from(value).toString("base64url");
		else throw new Error("Only integer, string and number(64bit double) are allowed in miniwebtoken. Given value is: ", value);
	},

	menToValue: (menStr) => {
		const marker = menStr[0];
		if(marker === MEN.POSITIVE_MARKER || marker === MEN.NEGATIVE_MARKER || marker === MEN.FLOAT64_MARKER) return addon.decode(menStr);
		else if(marker === MEN.STRING_MARKER) return Buffer.from(menStr.slice(1, menStr.length), 'base64url').toString();
		else return menStr;			// Mean this is a signature.
	}
}

export default MEN;
