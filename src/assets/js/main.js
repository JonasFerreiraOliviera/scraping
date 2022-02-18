import CheerioScraping from './components/CheerioScraping.js';

const btn = document.querySelector('button');
var list = null;
btn.addEventListener('click', async () => {
	let tagType = document.querySelector('#tag_select');
	let url 	= document.querySelector('#site');

	let scraping = new CheerioScraping();

	scraping.tagType = tagType.value;

	//CheerioScraping.execScraping();

	scraping.site_url = url.value;
	let site_array = CheerioScraping.site_url.split('/');
	scraping.domain = site_array[0] + '//' + site_array[2];

	await scraping.getAllInternalLinks();
})


//const url = document.querySelector('#site_url');
//const tag_type = document.querySelector('#tag_selector');

/*async function puppeSite() {
	let tag = tag_type.value;
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url.value);

	var tagsValue = null;

	if (tag == 'a') {
		tagsValue = await page.evaluate(() => {
			var tagValueList = document.querySelectorAll('a');
			var arrayTags = [...tagValueList];
			var tagList = arrayTags.map(({ href, text }) => ({ href, text }))

			return tagValueList;
		});

		return tagsValue;
	}

	if (tag == 'img') {
		tagsValue = await page.evaluate(() => {
			var tagValueList = document.querySelectorAll('img');
			var arrayTags = [...tagValueList];
			var tagList = arrayTags.map(({ src, alt }) => ({ src, alt }))
			return tagList;
		});

		return tagsValue;
	}

	if (tag == 'h1') {
		tagsValue = await page.evaluate(() => {
			var tagValueList = document.querySelectorAll('h1');
			var arrayTags = [...tagValueList];
			var tagList = arrayTags.map(({ textContent }) => ({ textContent }))

			return arrayTags;
		});

		return tagsValue;
	}

	await browser.close();
}


async function verifySite() {
	console.log('Iniciando o processo de scraping site...');
	var teste = await puppeSite();

	if (tag_type.value == 'img') {

		let container = document.querySelector('#list-images');
		teste.forEach(image => {
			var img_element = document.createElement('img');
			var li_element = document.createElement('li');
			var img_alt = document.createElement('p');

			img_element.setAttribute('src', image.src);
			img_element.setAttribute('alt', image.alt);

			img_alt.textContent = image.alt;

			li_element.appendChild(img_element);
			li_element.appendChild(img_alt);

			container.appendChild(li_element);

		})
	}

	console.log(teste);
}*/