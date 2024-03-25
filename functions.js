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
tovarsFromDB = {
	'allowed_today': [],
	'card_type_image': [],
	'card_type_text': [],
	'card_type_no': [],
	'date_to_open': {},
	'days_to_close': {},
	'hours_to_produce': {},
	'dopnik': [],
	'fixed_price': [],
	'hidden': [],
	'paid_delivery': [],
	'random_sostav': [],
	'select_color': [],
	'select_gamma': [],
	'vitrina': []
}
/**
 * получаем все данные о товарах из БД, и обрабатываем эти данные, формируя массив всей нужной информации для использования на сайте
 */
getAllTovarsFromDB()
	.then(data => {
		data.forEach(tovar => {
			//id
			['allowed_today', 'dopnik', 'fixed_price', 'hidden', 'paid_delivery', 'random_sostav', 'select_color', 'select_gamma'].forEach(e => {
				if (!parseInt(tovar[e])) return;
				tovarsFromDB[e].push(parseInt(tovar.id));
			});
			//id+value
			['hours_to_produce', 'days_to_close', 'date_to_open'].forEach(e => {
				if (!parseInt(tovar[e])) return;
				tovarsFromDB[e][tovar.id] = ['date_to_open'].includes(e) ? tovar[e] : parseInt(tovar[e]);
			});
			//card_type
			tovarsFromDB['card_type_' + tovar.card_type].push(parseInt(tovar.id));
			//vitrina
			if (tovar.vitrina_id) {
				tovarsFromDB.vitrina.push(parseInt(tovar.vitrina_id));
				tovarsFromDB['card_type_' + tovar.card_type].push(parseInt(tovar.vitrina_id));
				if (parseInt(tovar.fixed_price)) tovarsFromDB.fixed_price.push(parseInt(tovar.vitrina_id));
			}
		});
		console.log(tovarsFromDB);
		tovarsFromDBReady = true;
	})
	.catch(error => {
		console.error('Error fetching data:', error);
	});

/**
 * функция обращется к БД и получает всю информацию о всех товарах сайта
 */
function getAllTovarsFromDB() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: 'https://php.2steblya.ru/ajax.php?script=Tilda_tovars_from_DB&tovars=all&site=' + site,
			crossDomain: true,
			type: 'GET',
			success: function (data) {
				var first = data.slice(0, 1);
				if (first == '{' || first == '[') {
					resolve(JSON.parse(data));
				} else {
					resolve(data);
				}
			},
			error: function (error) {
				reject(error);
			}
		});
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
