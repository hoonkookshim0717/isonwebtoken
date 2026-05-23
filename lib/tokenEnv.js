import webSignature from './websignature.js';
import Key from './key.js';
import MEN from './men.js';

class TokenEnv {
	
	constructor(wsOptions) {
		if(!wsOptions) throw new Error("Signature Options must be provided.");

		wsOptions.payloadEncoding = 'utf8';
		wsOptions.signatureEncoding = 'base64url';

		this.ws = webSignature(wsOptions);

		this.signature = Key.signature(this.ws);
		this.metaKeys = [];
		this.objectKeys = [];
	}

	set(...keys) {
		for(const curKey of keys) {
			if(typeof curKey === 'object' && curKey.getter && curKey.setter) this.metaKeys.push(curKey);
			else if(typeof curKey === 'string') this.objectKeys.push(new Key(curKey));
			else throw new Error("Key should be function, which returns a Key object.");
		}
		return this;
	}

	sign(payload) {
		if(this.objectKeys.length === 0) this.#setKeysFromPayload(payload);
		
		let resultTokenStr = '';

		for(const curKey of this.metaKeys) resultTokenStr += MEN.valueToMen(curKey.setter());
		for(const curKey of this.objectKeys) {
			if(payload[curKey.keyName]) resultTokenStr += MEN.valueToMen(curKey.setter(payload[curKey.keyName]));
			else throw new Error("Property named ", curKey.keyName, " doesn't exist in the payload");
		}
		const signature = this.ws.sign(resultTokenStr);

		return signature + resultTokenStr;
	}

	verify(tokenStr) {
		const menStrs = MEN.splitTokenStr(tokenStr);
		const tokenBody = tokenStr.slice(menStrs.length, tokenStr.length);

		if(menStrs.length !== this.metaKeys.length + this.objectKeys.length + 1) throw new Error("Key count doesn't match.");

		const result = {};
		let keyIndex = 0;

		this.signature.getter(menStrs[keyIndex++], tokenBody);
		for(const curMetaKey of this.metaKeys) curMetaKey.getter(MEN.menToValue(menStrs[keyIndex++]));
		for(const curObjectKey of this.objectKeys) curObjectKey.getter(MEN.menToValue(menStrs[keyIndex++]), result);

		return result;
	}
	
	#setKeysFromPayload(payload) {
		for(const curKey of Object.keys(payload)) this.objectKeys.push(new Key(curKey));
	}
}

export default TokenEnv;
