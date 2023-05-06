#include <cstdlib>
#include <iostream>
#include <drogon/drogon.h>
#include <count.h>

using namespace drogon;

typedef std::function<void(const HttpResponsePtr &)> Callback;

void myHandler(const HttpRequestPtr &request, Callback &&callback) {
	Json::Value jsonBody;
	auto requestBody = request->getJsonObject();

	if (requestBody == nullptr) {
		jsonBody["status"] = "error";
		jsonBody["message"] = "body is required";

		auto response = HttpResponse::newHttpJsonResponse(jsonBody);
		response->setStatusCode(HttpStatusCode::k400BadRequest);

		callback(response);
		std::cout << "requestBody err: requestBody is null!\n";
		return;
	}

	if (!requestBody->isMember("num1") ||
		!requestBody->isMember("num2") ||
		!requestBody->isMember("mod") ||
		!requestBody->isMember("oper")) {
		jsonBody["status"] = "error";
		jsonBody["message"] = "num1, num2, mod and oper fields are required";

		auto response = HttpResponse::newHttpJsonResponse(jsonBody);
		response->setStatusCode(HttpStatusCode::k400BadRequest);

		callback(response);
		std::cout << "requestBody err: num1, num2, mod and oper fields are required!\n";
		return;
	}
	auto num1 = requestBody->get("num1", "guest").asString();
    auto num2 = requestBody->get("num2", "guest").asString();
    auto mod = requestBody->get("mod", "guest").asString();
	auto oper = requestBody->get("oper", "guest").asString();
	
	//TODO Validation (error handler is needed [/ by zero, Mod == 0] )
    auto X = BigInteger(num1);
    auto Y = BigInteger(num2);
    auto Mod = BigInteger(mod);
    
    string RES = "";
    if (oper == "+") {
        RES = ((X + Y) % Mod).toString();
    } else if (oper == "-") {
        RES = ((X - Y) % Mod).toString();
    } else if (oper == "*") {
        RES = ((X * Y) % Mod).toString();
    } else if (oper == "/") {
        RES = ((X / Y) % Mod).toString();
	} else if (oper == "^") {
		RES = binpow(X % Mod, Y, Mod).toString();
	} else if (oper == "f") {
		RES = factor(X);
	} else if (oper == "phi") {
		RES = phi(X).toString();
	} else {
        RES = "wtf... -_-";
    }
    jsonBody["message"] = RES;

	auto response = HttpResponse::newHttpJsonResponse(jsonBody);
	callback(response);
}

int main() {
	app().addListener("127.0.0.1", 8080);
	app().registerHandler("/count", &myHandler, {Post});
	app().run();

	return EXIT_SUCCESS;
}
