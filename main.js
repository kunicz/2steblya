window.BUILD_VERSION = '1.0.0';

// Все ресурсы в одном объекте (порядок важен!)
var resources = {
	'css': `https://php.2steblya.ru/jscss/tilda_frontend/${site}.min.css?1`,
	'js.cookie': 'https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js',
	'crypto': 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js',
	'owl.carousel': 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js',
	'moment': 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.1/moment.min.js',
	'moment-tz': 'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.45/moment-timezone.min.js',
	'globals': 'https://php.2steblya.ru/jscss/tilda_frontend/globals.min.js?2',
	'product': 'https://php.2steblya.ru/jscss/tilda_frontend/functions-product.min.js?1',
	'cart': 'https://php.2steblya.ru/jscss/tilda_frontend/functions-cart.min.js?3',
	'functions': 'https://php.2steblya.ru/jscss/tilda_frontend/functions.min.js?1',
};

// Группы ресурсов
var groups = {
	'all': Object.keys(resources), // Все ресурсы
	'jscss': ['css', 'globals', 'functions', 'product', 'cart'], // CSS + JS
	'js': ['globals', 'functions', 'product', 'cart'] // Только JS
};

// Получаем отключённые ресурсы из query string
var queryParams = new URLSearchParams(window.location.search);
var disabled = queryParams.get('disable')
	? [...new Set(queryParams.get('disable').split(',').flatMap(group => groups[group] || [group]))]
	: [];

// Функция последовательной загрузки ресурсов с возвратом промиса
function loadScriptsSequentially(keys, index = 0) {
	if (index >= keys.length) return Promise.resolve();

	let key = keys[index];

	if (disabled.includes(key)) {
		console.warn(`Ресурс ${key} отключён через disable.`);
		return loadScriptsSequentially(keys, index + 1);
	}

	return new Promise((resolve, reject) => {
		let isCSS = key.startsWith('css');
		let element = isCSS ? document.createElement('link') : document.createElement('script');

		if (isCSS) {
			element.rel = 'stylesheet';
			element.href = resources[key];
			document.head.appendChild(element);
			resolve();
		} else {
			element.src = resources[key];
			element.onload = resolve;
			element.onerror = () => reject(new Error(`Ошибка загрузки ${key}`));
			document.head.appendChild(element);
		}
	}).then(() => loadScriptsSequentially(keys, index + 1));
}

// Сохраняем промис загрузки в глобальную переменную
window.jscss = loadScriptsSequentially(Object.keys(resources))
	.then(() => console.log('Все ресурсы загружены'))
	.catch(err => console.error(err));

