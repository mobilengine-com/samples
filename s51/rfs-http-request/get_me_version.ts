//# server typescript program get_me_version for schedule * * * * * first run at 2100-01-01 10:00

export {};

const request = new HttpRequest();
request.url = 'https://login.bauapp.hu/services/comex/v1/version';
const response = request.getTextResponse();
if ('error' in response) {
	Log(response.error);
	throw new Error('The request failed');
}
Log("The version on login1.bauapp.hu is: " + response.text);