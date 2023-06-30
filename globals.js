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
		50000: ['букет-гигант', 'корзинища']
	},
	'staytrueflowers': {

	}
};

/**
 * опция торгового предложения
 */
var productFormat = {
	'2steblya': 'фор мат',
	'staytrueflowers': 'Размер'
}

/**
 * мимимальная цена на сайте
 */
var minPrice = {
	'2steblya': 0,
	'staytrueflowers': 0
}

/**
 * товары доступные сегодня
 */
var allowedTodayProducts = {
	'2steblya': [
		[105671635591, 3] //нитакой как все, 3 часа на сборку
	],
	'staytrueflowers': []
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

$(document).ready(function () {
});