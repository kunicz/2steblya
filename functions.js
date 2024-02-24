$(document).ready(function () {
	redirectHome();
	headerMenu();
	buyToday();
	externalLinks();
	product();
	cart();
	spoilers();
	footer();
});

/**
 * редирект на главную
 */
function redirectHome() {
	var data = {
		'2steblya': ['page28196964'],
		'staytrueflowers': []
	}
	$.each(data[site], function (i, e) {
		if (document.location.href.indexOf(e) > -1) {

			document.location.href = '/';
		}
	});
}

/**
 * возможность покупать любой букет сегодня
 */
function buyToday() {
	var urlParams = new URLSearchParams(window.location.search);
	if (!urlParams.has('buytoday')) return;
	Cookies.set('buytoday', urlParams.get('buytoday'));
}

/**
 * заменяем дефолтные опсания ошибок валидации на свои тексты
 * в функцию передаются объект формы и массив текстов (идентификаторы текстов должны соответствовать порядковым номерам полей формы)
 */
function formValidationTexts(form, texts = []) {
	if (!form.length) return;
	form.find('.t-submit').on('click', function () {
		var data = {
			'2steblya': 'укажи по брацки',
			'staytrueflowers': 'данное поле должно быть заполнено'
		}
		var int = setInterval(function () {
			var inputErrors = form.find('[data-tilda-req="1"]').parents('.t-input-block').find('.t-input-error');
			if (!inputErrors.length) return;
			inputErrors.each(function (i, e) {
				var errorText = texts[i] ? texts[i] : data[site];
				inputErrors.eq(i).text(errorText);
			});
			clearInterval(int);
		}, 1);
	});
}

/* меню в шапке */
function headerMenu() {
	var data = {
		'2steblya': 'rec469639590',
		'staytrueflowers': 'rec496423452,#rec496387058'
	}
	var menu = $('#' + data[site]);
	if (!menu.length) return;
	removeLink();
	anchorLinks();
	closeMenu();

	/**
	 * убираем ссылки из меню
	 */
	function removeLink() {
		if (site != '2steblya') return;
		menu.find('.t-sociallinks .t-sociallinks__item:last a').contents().wrapAll('<div>').parent().unwrap(); //18+
	}

	/**
	 * ссылки якоря # на внутренних странцах становятся нормальными ссылками /#
	 */
	function anchorLinks() {
		if (window.location.pathname && window.location.pathname != '/') {
			menu.find('a').each(function () {
				var href = $(this).attr('href');
				if (Array.from(href)[0] == '#') {
					if (href == '#opensearch') return;
					$(this).attr('href', '/' + href);
				}
			});
		}
	}

	/**
	 * зыкрываем мобильное меню при клике на ссылку
	 */
	function closeMenu() {
		menu.find('.t-menu__link-item[href*="#"]').on('click', function () {
			$('.tmenu-mobile').trigger('click');
		});
	}
}

/**
 * блок спойлеров (аккордеонов)
 */
function spoilers() {
	$('.t668__title').removeClass('t-name').addClass('t-descr');
}

/**
 * открывать external ссылки в новой вкладке
 */
function externalLinks() {
	$('a').each(function () {
		if (!$(this).is('[href^="htt"]:not([href*="' + window.location.hostname + '"])')) return;
		$(this).attr('target', '_blank');
	});
}

/**
 * подвал
 */
function footer() {
	footerCopyrightYear();

	/**
	 * корректный год в подвале в копирайтах
	 */
	function footerCopyrightYear() {
		var startYear = {
			'2steblya': null,
			'staytrueflowers': 2021
		}
		if (!startYear[site]) return;
		var f = $('.uc-footerCopyright [field="text"]');
		var currentYear = new Date().getFullYear();
		f.text(f.text().replace(startYear[site], startYear[site] + '-' + currentYear));
	}
}




/**
 * РАБОТЫ С БД
 */
getTovarsFromDBPromise()
	.then(() => {
		tovarsFromDBReady = true;
		console.log(tovarsFromDB);
	})
	.catch(error => {
		console.error('Error:', error);
	});
/**
 * функция делает запрос к базе данных php.2steblya
 * и выполняет callback, после получения данных из базы
 */
function getFromDB(request, callback) {
	$.ajax({
		url: 'https://php.2steblya.ru/ajax.php?script=' + request,
		crossDomain: true,
		type: 'GET',
		success: function (data) {
			var first = data.slice(0, 1);
			if (first == '{' || first == '[') {
				callback(JSON.parse(data));
			} else {
				callback(data);
			}
		}
	});
}
/**
 * функция прогоняет массив данных из БД и формирует простой одномерный массив данных
 */
function arrayOfValuesFromDB(data, field) {
	if (!Array.isArray(data)) return data;
	var arrayOfValues = [];
	$.each(data, function (i, e) {
		var value = e[field];
		if (!['card_type'].includes(field)) value = parseInt(value);
		arrayOfValues.push(value);
	});
	return arrayOfValues;
}
/**
 * получаем из БД массив всех товаров по категориям (allowed_today, vitrina и т.д.)
 * каждый запрос запихиваем в промис, чтоб быть уверенными, что перед началом работы сайта все данные наверняка будут получены из бд
 */
function getTovarsFromDBPromise() {
	var promises = [];
	var queries = {
		'id': ['hidden', 'dopnik', 'paid_delivery', 'multiple_prices', 'allowed_today'],
		'idValue': ['hours_to_produce', 'date_to_open', 'days_to_close'],
		'card_type': ['no', 'text', 'image']
	};

	//получаем айдишники товаров по харакетристика (только id)
	queries['id'].forEach(e => {
		promises.push(getFromDBPromise('TildaTovarsFromDB&tovars=' + e + '&site=' + site).then(data => {
			tovarsFromDB[e] = arrayOfValuesFromDB(data, 'id');
		}));
	});

	//получаем айдишники витринных товаров и массив с парой ключ/значение (id витринного товара / id родительского товара)
	promises.push(getFromDBPromise('TildaTovarsFromDB&tovars=vitrina_id&site=' + site).then(data => {
		tovarsFromDB['vitrina'] = [];
		tovarsFromDB['vitrina_parents'] = {};

		if (Array.isArray(data)) {
			data.forEach(e => {
				if (e['vitrina_id'].includes(',')) {
					var idsSplit = e['vitrina_id'].split(',');
					tovarsFromDB['vitrina'].push(...idsSplit.map(id => parseInt(id)));
					idsSplit.forEach(id => { tovarsFromDB['vitrina_parents'][parseInt(id)] = parseInt(e['id']); });
				} else {
					tovarsFromDB['vitrina'].push(parseInt(e['vitrina_id']));
					tovarsFromDB['vitrina_parents'][parseInt(e['vitrina_id'])] = parseInt(e['id']);
				}
			});
		}
	}));

	//получаем айдишники товаров по типам карточек
	queries['card_type'].forEach(e => {
		promises.push(getFromDBPromise('TildaTovarsFromDB&tovars=card_type&card_type=' + e + '&site=' + site).then(data => {
			tovarsFromDB['card_type_' + e] = arrayOfValuesFromDB(data, 'id');
		}));
	});

	//получаем данные для которых требуется пара ключ/значение
	queries['idValue'].forEach(e => {
		promises.push(getFromDBPromise('TildaTovarsFromDB&tovars=' + e + '&site=' + site).then(data => {
			if (Array.isArray(data)) {
				tovarsFromDB[e] = {};
				data.forEach(j => {
					var value = j[e];
					if (e != 'date_to_open') value = parseInt(value);
					tovarsFromDB[e][j['id']] = value;
				});
			}
		}));
	});

	//когда все данные получены из бд, производим дополнительные операции в функции afterGetFromDB
	return Promise.all(promises).then(() => {
		return afterGetFromDB();
	});
}

//вспомогательная функция, оборачивающая запрос к бд в промис
function getFromDBPromise(request) {
	return new Promise((resolve, reject) => {
		getFromDB(request, data => {
			resolve(data);
		});
	});
}

//дополнительная логика после получения всех данных из бд.
//оборнул в промис на всякий случай, чтоб точно быть уверенным, что сайт не начнет обрабатывать товары, пока все логические операции не будут завершены
function afterGetFromDB() {
	return new Promise((resolve, reject) => {
		//витринные товары получают свойства своих родителей
		//добавляем витринные товары в массивы, где есть и родительские товары
		var vitrinaParams = ['multiple_prices', 'card_type_no', 'card_type_text', 'card_type_image'];
		for (var id in tovarsFromDB['vitrina_parents']) {
			vitrinaParams.forEach(param => {
				if (tovarsFromDB[param].includes(tovarsFromDB['vitrina_parents'][id])) tovarsFromDB[param].push(parseInt(id));
			});
		}
		resolve();
	});
}

/**
 * проверка на наличие товаров из бд по ключу
 */
function isTovarsFromDBEmpty(field) {
	if (tovarsFromDB[field] === undefined) return true;
	if (Array.isArray(tovarsFromDB[field]) && !tovarsFromDB[field].length) return true;
	if (typeof tovarsFromDB[field] === 'object' && !Object.keys(tovarsFromDB[field]).length) return true;
	return false;
}



/**
 * СЕРВИСНЫЕ
 */
/**
 * день,дня,дней
 */
function getRussianDaysWord(number) {
	if (typeof number !== 'number' || isNaN(number)) return 'дней';
	number = Math.abs(number); // Making sure the number is positive
	var lastDigit = number % 10; // Get the last digit of the number
	if (lastDigit === 0 || (lastDigit >= 5 && lastDigit <= 9) || (number >= 11 && number <= 19)) return 'дней';
	if (lastDigit === 1) return 'день';
	if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
	return 'Error';
}
