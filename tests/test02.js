import mwt from '../index.js';

const sampleObject = { bbsReadable: true, bbsWritable: true, bbsAccessible: false };
const originalPayload = { user_id: 12345, user_name: 'KilDong Hong', user_roles: 0, perm: sampleObject };

const tokenEnv = mwt({ alg: 'hs256', secretKey: 'testpass' });
tokenEnv.regUserObject('A', sampleObject);

const resultMwtStr = tokenEnv.sign(originalPayload);		
console.log("Resulting mwt: ", resultMwtStr);
console.log("Legnth of mwt: ", resultMwtStr.length);

const extractedPayload = tokenEnv.verify(resultMwtStr);

console.log("The extracted payload: ", extractedPayload);