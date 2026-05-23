#include "./men.h"
#include <iostream>

int main() {
	double testValue = 0.9;

	char result_men[MAX_MEN_LENGTH];

	encode_float64(testValue, result_men);

	double revertedValue = decode_float64(result_men);

	std::cout << testValue << std::endl;
	std::cout << result_men << std::endl;
	std::cout << revertedValue << std::endl;

}
