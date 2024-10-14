const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// File paths
const TEMPLATE_DIR = `${__dirname}/starter/templates`;
const DATA_DIR = `${__dirname}/starter/dev-data`;

// Read templates and data files synchronously
const templateOverview = fs.readFileSync(`${TEMPLATE_DIR}/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${TEMPLATE_DIR}/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${TEMPLATE_DIR}/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${DATA_DIR}/data.json`, 'utf-8');
const products = JSON.parse(data);

// Create the server
const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);

	// Serve the overview page
	if (pathname === '/' || pathname === '/overview') {
		res.writeHead(200, { 'Content-Type': 'text/html' });

		// Generate product cards
		const cardsHtml = products.map(product => replaceTemplate(templateCard, product)).join('');
		const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

		res.end(output);

		// Serve individual product page
	} else if (pathname === '/product' && query.id < products.length) {
		res.writeHead(200, { 'Content-Type': 'text/html' });

		const product = products[query.id];
		const output = replaceTemplate(templateProduct, product);

		res.end(output);

		// Serve API data
	} else if (pathname === '/api') {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(products));

		// Handle 404 - Not Found
	} else {
		res.writeHead(404, { 'Content-Type': 'text/html' });
		res.end('<h1>Page not found</h1>');
	}
});

// Start the server
server.listen(8000, '127.0.0.1', () => {
	console.log('Server is listening on port 8000');
});
