const express = require('express');
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
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
app.post('/postEMS', async (req, res) => {
	//console.log("productURLs", getData());
	//res.cookie('BFUserType', 'Librarian');
	//const param = req.params.id;
	//let mData = await getData(param);let data;
	let params = req.body;
	const url = "https://ems.polyvietnam.edu.vn/rest/v11_3/get_api_access_token?key=apps_admin&secret=@lead_push4422";
	const urlPost = "https://ems.polyvietnam.edu.vn/rest/v11_3/cap_lead_v2";
	let access_token;
	let data;
	await axios.get(url).then(response => {
		//cheerio.load(response.data);
		//console.log(url);
		access_token = response.data.access_token;
		//data = { data : 'success'}

	})
	.catch(error => {
		// error.status = (error.response && error.response.status) || 500;
		// throw error;
		data = { data : 'fail'}
	});
	/*var data = {
		'name': f_fullname,
		'email': '',
		'phone': f_mobile,
		'parent_name1': '',
		'parent_name2': '',
		'center': center,
		'lead_source': 'Digital',
		'description': 'Center: ' + f_center,
		'utm_source': 'Google Forms',
		'utm_medium': '',
		'utm_agent': '',
		'source_description': '',
		'campaign_name': 'Summer',
		'type': 'lead',
		'prefer_level': '',
		'access_token': access_token
	  };*/
	let options = params;
	if(access_token){
		options.access_token = access_token;
		await axios.post(urlPost, options).then(response => {
			//cheerio.load(response.data);
			//console.log(url);
			//data = response.data;
			data = { data : 'success'}

		})
		.catch(error => {
			// error.status = (error.response && error.response.status) || 500;
			// throw error;
			data = { data : 'fail'}
		});
		//console.log(data);
	}
	//res.send(options);
	
	return res.status(200).json(data);
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