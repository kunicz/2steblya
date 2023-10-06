/**
 * корзина включена/выключена
 */
var cartEnabled = {
	'2steblya': true,
	'staytrueflowers': true
}

/**
 * форма заказа в корзине сокращенная/полная
 */
var cartExpanded = {
	'2steblya': false,
	'staytrueflowers': true
}

/**
 * уровни цен товаров
 */
var productPriceLevels = {
	'2steblya': {
		6000: ['букетусик', 'сердечко', 'кастрюлька', 'ящичек', 'яичко'],
		10000: ['букетик', 'сердце', 'кастрюля', 'ящик', 'яйцо'],
		15000: ['букет', 'кастрюлища', 'корзиночка', 'горшок'],
		20000: ['букетище'],
		25000: ['коробка', 'корзинка'],
		35000: ['корзина'],
		50000: ['букет-гигант', 'корзинища'],
		100000: ['корзилла']
	},
	'staytrueflowers': {
		6000: ['букет S'],
		10000: ['букет M'],
		15000: ['букет L'],
		20000: ['букет XL'],
		25000: ['коробка XL', 'корзина XL'],
		35000: ['корзина XXL'],
		50000: ['корзина XXXL'],
		50000: ['корзина ГУЛЯТЬ ТАК ГУЛЯТЬ']
	}
};

/**
 * опция торгового предложения
 */
var productFormat = {
	'2steblya': 'фор мат',
	'staytrueflowers': 'формат'
}

/**
 * мимимальная цена на сайте
 */
var minPrice = {
	'2steblya': 0,
	'staytrueflowers': 0
}

/**
 * нитакой как все
 */
var nitakoi = {
	'2steblya': '105671635591',
	'staytrueflowers': '400814140661'
}

/**
 * товары доступные сегодня
 */
var allowedTodayProducts = {
	'2steblya': [
		[105671635591, 3] //нитакой как все, 3 часа на сборку
	],
	'staytrueflowers': [
		[400814140661, 3], //нитакой как все, 3 часа на сборку
	]
}

/**
 * праздничные даты
 */
var specialDatesList = [
	{
		'd': 14,
		'm': 2,
		'2steblya': {
			'minPrice': 10000,
			'exclude': []
		},
		'staytrueflowers': {
			'minPrice': 7500,
			'exclude': []
		}
	},
	{
		'd': 7,
		'm': 3,
		'2steblya': {
			'minPrice': 15000,
			'exclude': [969888387731, 690076603321, 663441383001, 561739979091], //лучшей женщине, лучший весенний суп, пупырка, простата,
		},
		'staytrueflowers': {
			'minPrice': 10000,
			'exclude': []
		}
	},
	{
		'd': 8,
		'm': 3,
		'2steblya': {
			'minPrice': 15000,
			'exclude': [969888387731, 690076603321, 663441383001, 561739979091], //лучшей женщине, лучший весенний суп, пупырка, простата,
		},
		'staytrueflowers': {
			'minPrice': 10000,
			'exclude': []
		}
	}
];

/**
 * промокоды общие "all" или штучные "individual" (только на конкретный товар)
 */
var promocodeType = {
	'2steblya': 'individual',
	'staytrueflowers': 'individual'
}

/**
 * товары по промокоду
 */
var promocodeTovars = {
	'2steblya': [],
	'staytrueflowers': []
}