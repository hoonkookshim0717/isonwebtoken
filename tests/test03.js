import mwt from '../index.js';

const samplePayload = {
	user_group: 50,
}

const tokenEnv = mwt({
	alg: 'hs256',
	secretKey: 'testpass',
});

tokenEnv.set("user_group", {
	getter: (value, targetObj) => {
		if(value > 0) targetObj.isWritable = false;
		else targetObj.isWritable = true;
	}
});

const resultMwtStr = tokenEnv.sign(samplePayload);		
console.log("Resulting mwt: ", resultMwtStr);
console.log("Legnth of mwt: ", resultMwtStr.length);

// In a router.
const recoveredObj = tokenEnv.verify(resultMwtStr);
console.log("Recovered Object: ", recoveredObj);
