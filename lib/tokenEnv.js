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
		this.customKeys = new Map();

		this.userRegEncodeTable = new Map();
		this.userRegDecodeTable = new Map();

		this.finalized = false;
	}

	set(propertyName, customFns) {
		if(typeof propertyName === 'function') {
			const fnPair = customFns();
			if(!fnPair.setter && !fnPair.getter) throw new TypeError('Should be a function returning setter or getter function, or both.');
			const symbolKey = Symbol();
			this.keys.set(symbolKey, new Key(symbolKey, fnPair));
		} else if(typeof propertyName === 'object') {
			if(!propertyName.setter && !propertyName.getter) throw new TypeError('One of getter/setter function should be exist.');
			const symbolKey = Symbol();
			this.keys.set(symbolKey, new Key(symbolKey, propertyName));
		} else if(typeof propertyName === 'string') {
			if(typeof customFns !== 'object') throw new TypeError('customFns should be an object containing setter or getter function, or both.');
			this.customKeys.set(propertyName, new Key(propertyName, customFns));
		} else { throw new TypeError(MEN.errMsgs.INVALID_ARGS_FOR_SET); }

		return this;
	}

	setUserCode(code, thing) {
		// Type checking.
		if(typeof code !== 'string') throw new TypeError('Code for user registry should be a string');
		if(!MEN.isBase64UrlString.test(code)) throw new TypeError('User-defined code should A-Z, a-z, 0-9, "-" and "_".');
		if(this.userRegDecodeTable.has(code)) throw new Error('Already registered user code: ', code);

		this.userRegEncodeTable.set(thing, code);
		this.userRegDecodeTable.set(code, thing);

		return this;
	}

	sign(payload) {
		if(!this.finalized) this.#finalize(payload);

		let resultTokenStr = '';

		for(const [keyName, curKey] of this.keys) {
			const value = curKey.setter(payload[curKey.keyName]);
			resultTokenStr += this.#valueToMen(value);
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

		for(const [keyName, curKey] of this.keys) curKey.getter(this.#menToValue(menStrs[keyIndex++]), result, tokenBody);

		return result;
	}

	#finalize(payload) {
		for(const curKey of Object.keys(payload)) {
			if(this.customKeys.has(curKey)) this.keys.set(curKey, this.customKeys.get(curKey));
			else this.keys.set(curKey, new Key(curKey));
		}
		this.finalized = true;
	}
	
	#valueToMen (value) {
		if(Number.isFinite(value)) return MEN.encodeNumber(value);
		if(typeof value === 'string') return MEN.STRING_MARKER + Buffer.from(value).toString("base64url");
		if(value === false) return MEN.FALSE_NOTATION;
		if(value === true) return MEN.TRUE_NOTATION;
		if(value === null) return MEN.NULL_NOTATION;
		if(MEN.SP_ENCODE_TABLE.has(value)) return MEN.SP_MARKER + MEN.SP_ENCODE_TABLE.get(value);
		if(typeof value === 'object') return this.#encodeUserRegister(value);
		else throw new Error("Not a tokenizable value. Given value is: ", value);
	}

	#menToValue (menStr) {
		const marker = menStr[0];
		switch(marker) {
			case MEN.POSITIVE_MARKER:
				if(menStr === MEN.FALSE_NOTATION) return false;
				return MEN.decodeNumber(menStr);
			case MEN.NEGATIVE_MARKER:
				if(menStr === MEN.TRUE_NOTATION) return true;
				return MEN.decodeNumber(menStr);
			case MEN.STRING_MARKER:
				return Buffer.from(menStr.slice(1, menStr.length), 'base64url').toString();
			case MEN.FLOAT64_MARKER:
				if(menStr === MEN.NULL_NOTATION) return null;
				return MEN.decodeNumber(menStr);
			case MEN.SP_MARKER:
				return MEN.decodeSp(menStr);
			case MEN.USER_REG_MARKER:
				return this.#decodeUserRegister(menStr);
			case MEN.RESERVED_MARKER:
				throw new Error(`Marker '${MEN.RESERVED_MARKER}' is a reserved marker. Should not be appeared on the token.`);
			default:
				return menStr;			// Mean this is a signature.
		}
	}

	#encodeUserRegister(value) {
		if(this.userRegEncodeTable.has(value)) return MEN.USER_REG_MARKER + this.userRegEncodeTable.get(value);
		else throw new Error('Unregistered user object. The reference should match. Given object is: ', value);
	}

	#decodeUserRegister(menStr) {
		const userCode = menStr.slice(1, menStr.length);
		if(this.userRegDecodeTable.has(userCode)) return this.userRegDecodeTable.get(userCode);
		else throw new Error(`Unregistered user code: '${userCode}`);
	}
}

export default TokenEnv;
