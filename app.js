const express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
/*app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})*/
// Add headers before the routes are defined
app.use(function (req, res, next) {

    // // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
	
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Pass to next layer of middleware
    next();
});
app.get('/arBook/:id', async (req, res) => {
	//console.log("productURLs", getData());
	//res.cookie('BFUserType', 'Librarian');
	const param = req.params.id;
	let mData = await getData(param);
	res.send(mData);
});
async function getData(id) {
	let productURLs = [];
	let data;
	const url = "https://www.arbookfind.com/bookdetail.aspx?q="+id+"&l=EN&client=WKAR";//"https://scrapeme.live/shop";
	await axios.get(url).then(response => {
		//cheerio.load(response.data);
		//console.log(url);
		data = response.data;

	})
	.catch(error => {
		error.status = (error.response && error.response.status) || 500;
		throw error;
	});
	//console.log("productURLs", data);

	const $ = cheerio.load(data);
	// $(".UserTypeOptions label").each((index, element) => {
	// 	const productURL = $(element).text();
	// 	productURLs.push(productURL);
	// });
	const errorBook = $("#lblErrorOccured").text();
	// const bookTitle = $("#ctl00_ContentPlaceHolder1_ucBookDetail_lblBookTitle").text();
	// const bookAuthor = $("#ctl00_ContentPlaceHolder1_ucBookDetail_lblAuthor").text();
	// const bookLevel = $("#ctl00_ContentPlaceHolder1_ucBookDetail_lblBookLevel").text();
	// const bookWordCount = $("#ctl00_ContentPlaceHolder1_ucBookDetail_lblWordCount").text();
	
	const bookTitle = $("[id$='_lblBookTitle']").text();
	const bookAuthor = $("[id$='_lblAuthor']").text();
	const bookLevel = $("[id$='_lblBookLevel']").text();
	const bookWordCount = $("[id$='_lblWordCount']").text();
	
	let obj = {
		title: bookTitle,
		author: bookAuthor,
		atosBookLevel: bookLevel,
		wordCount: bookWordCount,
	};
	return {  data: obj };
}
app.listen(process.env.PORT || 3000)