//# server typescript program tech_news for schedule * * * * * first run at 2100-01-01 10:00

export {};

const request = new HttpRequest();
request.method = 'POST';
request.url = 'https://ok.surf/api/v1/news-section';
request.headers['Content-Type'] = 'application/json';
request.body = JSON.stringify({
	sections: ['Technology']
});
request.msTimeout = 10000;
const response = request.getTextResponse();
if ('error' in response) {
	Log(response.error);
	throw new Error('The request failed');
}

// the response is a JSON that should look like this: 
// {
//   "Technology": [
//     {
//       "link": "https://news.google.com/...",
//       "og": "https://lh3.googleusercontent...",
//       "title": "CES 2024: Rabbit r1 AI Assistant Wants to Do Tasks for You"
//     },
//     {
//       "link": "https://news.google.com/...",
//       "og": "https://lh3.googleusercontent...",
//       "title": "..."
//     },
//     ...
//   ]
// }
const news = JSON.parse(response.text);
const titles = news.Technology.map(article => article.title);
Log("Some tech news:");
Log(titles);