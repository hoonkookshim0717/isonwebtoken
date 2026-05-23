# 

## Structure of Key

All elements which is to be stored in the token, like signature, expiration time or actual payload, is managed by the class named Key.

Every Key object have 3 properties: keyName, setter function and getter function.

### keyName

keyName can be null, which means the contents of this key exists in the token, but not in the payload.

The signature key is the good example.
Thh signature part of the token is used to verify the token, and not to be shown in the payload extracted from it.

Another example is expiration time.
If token expiration date is set, there should a need to check the timestamp, but it's not gonna be included in the payload.

Or, keyName should be a string, and it will be the name of the property of the payload extracted from the token.
setter function described below determines the way what data can be stored in the token,
and getter function describe below determines the way to interpret the data stored in the token and produce the property of the payload.

### setter function

```js
(value) => {
	...
	return isonStr;
}
```
value
The value of the property from the payload is to be delivered to it, when trying to sign a token.

return:
Should be one of the 2, integer or string.
This goes into the token after base64url-like conversion.

### getter function

## How to create a custom key.

## Create a 

```js

```