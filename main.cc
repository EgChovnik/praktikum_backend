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
		std::cout << "requestBody is null!!\n";
		return;
	}

	if (!requestBody->isMember("num1") ||
		!requestBody->isMember("num2") ||
		!requestBody->isMember("oper")) {
		jsonBody["status"] = "error";
		jsonBody["message"] = "num1 num2 and oper fields are required";

		auto response = HttpResponse::newHttpJsonResponse(jsonBody);
		response->setStatusCode(HttpStatusCode::k400BadRequest);

		callback(response);
		std::cout << "requestBody is null!!\n";
		return;
	}
	auto num1 = requestBody->get("num1", "guest").asString();
    auto num2 = requestBody->get("num2", "guest").asString();
	auto oper = requestBody->get("oper", "guest").asString();
	
    auto X = BigInteger(num1);
    auto Y = BigInteger(num2);
    
    string RES = "";
    if (oper == "+") {
        RES = (X + Y).toString();
    } else if (oper == "-") {
        RES = (X - Y).toString();
    } else if (oper == "*") {
        RES = (X * Y).toString();
    } else if (oper == "/") {
        RES = (X / Y).toString();
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
