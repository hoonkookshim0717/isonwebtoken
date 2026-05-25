import webSignature from './websignature.js';
import Key from './key.js';
import MEN from './men.js';

class TokenEnv {
	
	constructor(wsOptions) {
		if(!wsOptions) throw new Error("Signature Options must be provided.");

		wsOptions.payloadEncoding = 'utf8';
		wsOptions.signatureEncoding = 'base64url';

		this.ws = webSignature(wsOptions);
		this.keys = new Map();
		this.finalized = false;
	}

	set(...keys) {
		for(const curKey of keys) {
			if(typeof curKey === 'object' && curKey.keyName && curKey.getter && curKey.setter) this.keys.set(curKey.keyName, curKey);
			else if(typeof curKey === 'string') this.keys.set(curKey, new Key(curKey));
			else if(typeof curKey === 'function') {
				const createdKey = curKey();
				if(typeof createdKey === 'object' && curKey.keyName && curKey.getter && curKey.setter) this.keys.set(curKey.keyName, createdKey);
			}
			else {
				throw new TypeError(MEN.errMsgs.INVALID_ARGS_FOR_SET);
			}
		}
		return this;
	}

	sign(payload) {
		if(!this.finalized) {
			this.#setKeysFromPayload(payload);
			this.finalized = true;
		}

		let resultTokenStr = '';

		for(const [keyName, curKey] of this.keys) {
			const value = curKey.setter(payload[curKey.keyName]);
			if(!Number.isFinite(value) && !(typeof value === 'string')) throw new Error("setter function Must return a number or string, not even undefined.");
			resultTokenStr += MEN.valueToMen(value);
		}
		
		return this.ws.sign(resultTokenStr) + resultTokenStr;
	}

	verify(tokenStr) {
		const menStrs = MEN.splitTokenStr(tokenStr);
		const tokenBody = tokenStr.slice(menStrs[0].length, tokenStr.length);

		if(menStrs.length !== this.keys.size + 1) throw new Error("Key count doesn't match.");
		if(!this.ws.verify(tokenBody, menStrs[0])) throw new Error("signature not verified.");

		let keyIndex = 1;
		const result = {};

		for(const [keyName, curKey] of this.keys) curKey.getter(MEN.menToValue(menStrs[keyIndex++]), result, tokenBody);

		return result;
	}

	#setKeysFromPayload(payload) {
		for(const curKey of Object.keys(payload)) {
			if(!this.keys.has(curKey)) this.keys.set(curKey, new Key(curKey));
		}
	}
}

export default TokenEnv;
