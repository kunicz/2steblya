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
		'2steblya_white': [],
		'staytrueflowers': [],
		'gvozdisco': [],
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
			'gvozdisco': 'заполни поле',
			'gvozdisco': 'надо заполнить поле',
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
		'2steblya_white': 'rec856423841',
		'gvozdisco': 'rec736788412',
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
	writeMeButton();

	/**
	 * корректный год в подвале в копирайтах
	 */
	function footerCopyrightYear() {
		var startYear = {
			'2steblya': null,
			'2steblya_white': null,
			'gvozdisco': 2024,
			'staytrueflowers': 2021
		}
		if (!startYear[site]) return;
		var f = $('.uc-footerCopyright [field="text"]');
		var currentYear = new Date().getFullYear();
		f.text(f.text().replace(startYear[site], startYear[site] + '-' + currentYear));
	}

	function writeMeButton() {
		const href = 'href^="https://t.me"';
		const $btn = $(`.t393__submit[${href}]`);
		if (!$btn.length) return;

		const $originalParent = $btn.parent();
		const $menuParent = $('.t228__centerside');

		let $svg = $(`.t228 a[${href}] svg`);
		if ($svg.length) {
			$svg = $svg.clone().attr('class', '').css({ 'margin-right': '12px' }).prependTo($btn);
			if (site === '2steblya_white') {
				$svg.find('path').attr('fill', '#fff');
			}
		}

		placeButton();
		$(window).on('resize', placeButton);

		function placeButton() {
			const isMobile = $(window).width() < 981;
			$btn.appendTo(isMobile ? $menuParent : $originalParent);
		}
	}
}




/**
 * РАБОТЫ С БД
 */
tovarsFromDB = {
	'000': [],	//транспортирочное
	'666': [],	//подписка
	'777': [],	//исключительно витринный
	'888': [],	//допник
	'999': [],	//нитакой как все (букет со свободной ценой)
	'1000': [],	//индпошив (персональный букет)
	'1111': [],	//донат
	'allowed_today': [],
	'not_allowed': [],
	'card_type_image': [],
	'card_type_text': [],
	'card_type_no': [],
	'date_to_open': {},
	'days_to_close': {},
	'evkalipt': [],
	'painted': [],
	'fixed_price': [],
	'hidden': [],
	'paid_delivery': [],
	'random_sostav': [],
	'select_color': [],
	'select_gamma': [],
	'vitrina': [],
	'photos': {},
	'razdel': {},
	'video_preview': {}
}
/**
 * получаем все данные о товарах из БД, и обрабатываем эти данные, формируя массив всей нужной информации для использования на сайте
 */
getAllTovarsFromDB()
	.then(data => {
		data.forEach(tovar => {
			//id
			['dopnik', 'evkalipt', 'fixed_price', 'hidden', 'paid_delivery', 'random_sostav', 'select_color', 'select_gamma', 'painted'].forEach(e => {
				if (!parseInt(tovar[e])) return;
				tovarsFromDB[e].push(parseInt(tovar.id));
			});
			//id allowed
			if (tovar.allowed_today == 1) tovarsFromDB['allowed_today'].push(parseInt(tovar.id));
			if (tovar.allowed_today == -1) tovarsFromDB['not_allowed'].push(parseInt(tovar.id));
			//id+value (строковые)
			['date_to_open', 'video_preview'].forEach(e => {
				if (!tovar[e]) return;
				tovarsFromDB[e][tovar.id] = tovar[e];
			});
			//id+value (числовые)
			['days_to_close'].forEach(e => {
				if (!parseInt(tovar[e])) return;
				tovarsFromDB[e][tovar.id] = parseInt(tovar[e]);
			});
			//id+value (json)
			['photos', 'razdel'].forEach(e => {
				if (!tovar[e]) return;
				tovarsFromDB[e][tovar.id] = JSON.parse(tovar[e]);
			});
			//type
			if (tovar.type) {
				if (tovarsFromDB[tovar.type] == undefined) tovarsFromDB[tovar.type] = [];
				tovarsFromDB[tovar.type].push(parseInt(tovar.id));
			}
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
			url: 'https://php.2steblya.ru/ajax.php?script=Tilda_products_from_DB&products=all&site=' + site,
			crossDomain: true,
			type: 'GET',
			success: function (data) {
				data = JSON.parse(data);
				if (data.success) {
					resolve(data.fromDB);
				} else {
					reject();
				}
			},
			error: function (error) {
				reject(error);
			}
		});
	});
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
