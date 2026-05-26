import MEN from "./men.js";

class Key {

	// ExpIn functions and constants.
	static expIn = expIn;
	static TTL_HOUR = 3600;
	static TTL_DAY = 86400;
	static SINCE_EPOCH = 0;
	static SINCE_2000 = 946684800;
	static SINCE_2020 = 1577836800;
	static SINCE_2026 = 1767225600;
	
	constructor(keyName, fnPair = {}) {
		if(typeof fnPair !== 'object') throw new TypeError("fnPair to Key() should be a object containing setter/getter function. Give fnPair is : ", fnPair);
		if(fnPair.setter && typeof fnPair.setter !== 'function') throw new TypeError('setter should be a function.');
		if(fnPair.getter && typeof fnPair.getter !== 'function') throw new TypeError('getter should be a function.');
		this.keyName = keyName;
		this.setter = fnPair.setter ?? defaultSetter;
		this.getter = fnPair.getter ?? defaultGetter;	
	}

	setPair(fnPair = {}) {
		if(typeof fnPair !== 'object') throw new TypeError("fnPair to set");
		if(fnPair.setter && typeof fnPair.setter === 'function') this.setter = fnPair.setter;
		if(fnPair.getter && typeof fnPair.getter === 'function') this.getter = fnPair.getter;
	}
}

/*
	Format of setter/getter functions.
	setter(value) 								- receives the value from payload, returns value to be stored in the token(not encoded yet);
	getter(value, targetObject, [tokenBody])	- receives the encoded value from token, and construting payload, and full tokenbody excluding signature.
*/

function expIn(ttl = Key.TTL_DAY, baseTime = Key.SINCE_EPOCH) {
	return {
		setter: () => {
				return Math.floor(Date.now() / 1000) + ttl - baseTime;
			},
		getter: (value) => {
				if(value + baseTime < Math.floor(Date.now() / 1000)) throw new Error("Token Expired");
			}
	}
}

function defaultSetter(value) { return value; }
function defaultGetter(value, target) {
	if(typeof this.keyName === 'string') target[this.keyName] = value; }

export default Key;
