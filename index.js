const express = require('express')
const app = express()
/*app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})*/
app.get('/arBook/:id', async (req, res) => {
	console.log("productURLs", getData());
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
		console.log(url);
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
	const bookTitle = $("#ctl00_ContentPlaceHolder1_ucBookDetail_lblBookTitle").text();
	const bookAuthor = $("#ctl00_ContentPlaceHolder1_ucBookDetail_lblAuthor").text();
	const bookLevel = $("#ctl00_ContentPlaceHolder1_ucBookDetail_lblBookLevel").text();
	const bookWordCount = $("#ctl00_ContentPlaceHolder1_ucBookDetail_lblWordCount").text();
	
	let obj = {
		title: bookTitle,
		author: bookAuthor,
		level: bookLevel,
		wordCount: bookWordCount,
	};
	return {  data: errorBook ? "fail" : obj };
}
app.listen(process.env.PORT || 3000)