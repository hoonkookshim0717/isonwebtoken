// errors.js

const ERRORS = {
	apps: {
		// At tokenEnv constructor
		OPTION_NOT_PROVIDED: "Option object with 'alg' property and 'secretKey', or 'privateKey/publicKey' pair should be passed.",	// o
		
		// At tokenEnv.set()
		INVALID_RETURN_OBJ: "The function for set() should return object with 'setter' or 'getter' property, which is function.",
		INVALID_ARGS_FOR_SET: "Usage: .set(function), .set(object), .set(string, object)",

			// At Key constructor.
			INVALID_CUSTOM_FNS: 'Object with setter or getter property, which is function, should be provided. Given value is: ',
			SETTER_NOT_FUNCTION: "'setter' should be a 'function'.",
			GETTER_NOT_FUNCTION: "'getter' should be a 'function'.'",

		// At tokenEnv.setUserCode()
		INVALID_ARG_FOR_SET_USER_CODE: "A code for user registry should be a string, consists of characters A~Z, a~z, 0~9, '-' and '_'",
		USER_CODE_ALREADY_REGISTERED: "Already registered user code: ",
		
		INVALID_ARG_FOR_ISSUED_AT: "Property name shoud be provided in string.",
	},

	// At tokenEnv.sign()
	NOT_TOKENIZABLE: "Given value is not a tokenizable value. Given value is: ",

	// At tokenEnv.verify().
	INVALID_KEYCOUNT: "Malformed token. Number of keys registered and keys in the token does not match.",
	INVALID_SIGNATURE: "Signature verification failed.",
	
	RESERVED_MARKER: "Token has reserved marker, which should not have appeard.",
	UNREGISTERD_USER_CODE: "Unregistered user code exist in the token: ",

	// At decodeSp
	UNREGISTERED_SP_CODE: "Unregistered special character code exist in the token: ",

	// At built-in Keys.
	TOKEN_EXPIRED: "Expired token.",
	NOT_VALID_YET: "Token not valid yet.",

}

export default ERRORS;
