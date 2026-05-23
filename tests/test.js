import mwt from '../index.js';
import { TTL_HOUR, SINCE_2026 } from '../index.js';

const samplePayload = {
	user_id: 2583,
	user_nickname: 'KilDong Hong',
	user_group: -100,
	user_roles: 187,
	grade: 1.2,
}

const tokenEnv = mwt({
	alg: 'hs256',
	secretKey: 'testpass',
});

tokenEnv.set(mwt.expIn(TTL_HOUR, SINCE_2026));

// In a login router or refresh router.
const resultMwtStr = tokenEnv.sign(samplePayload);		
console.log("Resulting mwt: ", resultMwtStr);
console.log("Legnth of mwt: ", resultMwtStr.length);

// In a router.
const recoveredObj = tokenEnv.verify(resultMwtStr);
console.log("Recovered Object: ", recoveredObj);

