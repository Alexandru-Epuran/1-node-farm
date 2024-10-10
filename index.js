const fs = require('fs');
const http = require('http');
const url = require('url');

///////////////////////////////////////////////////////////////////////////
//FILES
// Blocking synchronous way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreted on ${new Date(
// 	Date.now()
// ).toString()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File written');

//Mon-Blocking Asynchronous way
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
// 	if (err) return console.log('ERROR!', err);

// 	fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
// 		console.log(data2);
// 		fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data3) => {
// 			console.log(data3);

// 			fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
// 				console.log('Your file has been written!');
// 			});
// 		});
// 	});
// });
// console.log('Will read file!');

///////////////////////////////////////////////////////////////
//SERVER
const replacetemplate = (temp, product) => {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRINENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);

	output = output.replace(/{%NOT_ORGANIC%}/g, product.organic ? '' : 'not-organic');
	return output;
};

const templateOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);

	//Overview page
	if (pathname === '/' || pathname === '/overview') {
		res.writeHead(200, { 'Content-type': 'text/html' });

		const cardsHtml = dataObject.map(el => replacetemplate(templateCard, el)).join('');
		const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

		res.end(output);
		//Product page
	} else if (pathname === '/product') {
		res.writeHead(200, { 'Content-type': 'text/html' });
		const product = dataObject[query.id];
		const output = replacetemplate(templateProduct, product);

		res.end(output);
		//API
	} else if (pathname === '/api') {
		res.writeHead(200, {
			'Content-Type': 'application/json',
		});
		res.end(data);
		//Not Found 404
	} else {
		res.writeHead(404, {
			'Content-Type': 'text/html',
		});
		res.end('<h1>Page not found</h1>');
	}
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Server is listening on port 8000');
});
