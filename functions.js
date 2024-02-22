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
 */
getTovarsFromDB();
function getTovarsFromDB() {
	var columnsFromDB = [];
	//получаем все возможные поля таблицы (allowed_today, vitrina и т.д.)
	getFromDB('TildaTovarsFromDB&site=&tovars=columns', function (data) {
		columnsFromDB = data;
	});
	//прогоняем цикл по всем полям и получаем айдишники товаров, которые относятся к этим категориям
	var int = setInterval(function () {
		if (!columnsFromDB.length) return;
		$.each(columnsFromDB, function (i, e) {
			getFromDB('TildaTovarsFromDB&tovars=' + e['COLUMN_NAME'] + '&site=' + site, function (data) {
				tovarsFromDB[e['COLUMN_NAME']] = arrayOfValuesFromDB(data, 'id');
			});
		});
		//карточки
		getFromDB('TildaTovarsFromDB&tovars=card_types&site=' + site, function (data) {
			var card_types = arrayOfValuesFromDB(data, 'card_type');
			$.each(card_types, function (i, e) {
				getFromDB('TildaTovarsFromDB&tovars=card_type&card_type=' + e + '&site=' + site, function (data) {
					tovarsFromDB['card_type_' + e] = arrayOfValuesFromDB(data, 'id');
				});
			});
		});
		clearInterval(int);
	}, 100);
	//время на производство
	getFromDB('TildaTovarsFromDB&tovars=hours_to_produce&site=' + site, function (data) {
		if (!Array.isArray(data)) return data;
		tovarsFromDB['hours_to_produce'] = {};
		$.each(data, function (i, e) {
			tovarsFromDB['hours_to_produce'][e['id']] = parseInt(e['hours_to_produce']);
		});
	});
	setTimeout(function () {
		//console.log(tovarsFromDB);
	}, 2000);
}
/**
 * проверка, загрузились ли все товары из БД
 */
function isTovarsFromDBLoaded() {
	/**
	 * allowed_today
	 * vitrina
	 * card_type
	 * card_type_no
	 * card_type_text
	 * card_type_image
	 * multiple_prices
	 * non_flowers
	 */
	var fieldsAmount = 8;
	if (Object.keys(tovarsFromDB).length < fieldsAmount) return false;
	return true;
}
/**
 * проверка на наличие товаров из бд по ключу
 */
function isTovarsFromDBEmpty(field) {
	if (tovarsFromDB[field] === undefined) return true;
	if (!tovarsFromDB[field].length) return true;
	return false;
}
