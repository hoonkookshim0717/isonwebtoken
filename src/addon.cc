#include <napi.h>
#include <cmath>

#include "./men.h"

Napi::Value encode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

	char result_men[MAX_MEN_LENGTH];

	// JS Number -> double.
	double input_double = info[0].As<Napi::Number>().DoubleValue();

	bool is_integer = std::floor(input_double) == input_double;

	if(is_integer) encode_int64(static_cast<int64_t>(input_double), result_men);
	else encode_float64(input_double, result_men);

    // Return as JS string.
    return Napi::String::New(env, result_men);
}

Napi::Value decode(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if(info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "String expected")
            .ThrowAsJavaScriptException();

        return env.Null();
    }

    try {
        std::string input = info[0].As<Napi::String>().Utf8Value();

		char men_str[MAX_MEN_LENGTH];
		std::strcpy(men_str, input.c_str());

		if(men_str[0] == FLOAT64_MARKER) {
			double decoded = decode_float64(men_str);
			return Napi::Number::New(env, decoded);
		}
		else if(men_str[0] == POSITIVE_MARKER || men_str[0] == NEGATIVE_MARKER) {
        	int64_t decoded = decode_int64(men_str);
	        return Napi::Number::New(env, decoded);
		}
		else {
			Napi::TypeError::New(env, "Not a number-type men string")
				.ThrowAsJavaScriptException();
			return env.Null();
		}
    }
    catch (const std::exception& e) {
        Napi::Error::New(env, e.what())
            .ThrowAsJavaScriptException();

        return env.Null();
    }
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set(
        Napi::String::New(env, "encode"),
        Napi::Function::New(env, encode)
    );
    exports.Set(
        Napi::String::New(env, "decode"),
        Napi::Function::New(env, decode)
    );
    return exports;
}

NODE_API_MODULE(addon, Init);

