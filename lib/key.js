import MEN from "./men.js";

class Key {

	// ExpIn functions and constants.
	static expIn = expInKey;
	static TTL_HOUR = 3600;
	static TTL_DAY = 86400;
	static SINCE_EPOCH = 0;
	static SINCE_2000 = 946684800;
	static SINCE_2020 = 1577836800;
	static SINCE_2026 = 1767225600;

	
	constructor(keyName, setter, getter) {
		this.keyName = keyName;
		this.setter = setter ?? defaultSetter;
		this.getter = getter ?? defaultGetter;	
	}

}

/*
	Format of setter/getter functions.
	setter(value) 								- receives the value from payload, returns value to be stored in the token(not encoded yet);
	getter(value, targetObject, [tokenBody])	- receives the encoded value from token, and construting payload, and full tokenbody excluding signature.
*/

function expInKey(ttl = Key.TTL_DAY, baseTime = Key.SINCE_EPOCH) {
	return new Key(
		Symbol(),
		() => {
			return Math.floor(Date.now() / 1000) + ttl - baseTime;
		},
		(value) => {
			if(value + baseTime < Math.floor(Date.now() / 1000)) throw new Error("Token Expired");
		}
	)
}

function defaultSetter(value) { return value; }
function defaultGetter(value, target) { if(typeof this.keyName === 'string') target[this.keyName] = value; }

export default Key;
