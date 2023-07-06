$(document).ready(function () {
	redirectHome();
	headerMenu();
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
 * заменяем дефолтные опсания ошибок валидации на свои тексты
 * в функцию передаются объект формы и массив текстов (идентификаторы текстов должны соответствовать порядковым номерам полей формы)
 */
function formValidationTexts(form, texts = []) {
	if (!form.length) return;
	form.find('.t-submit').on('click', function () {
		var data = {
			'2steblya': 'укажи по брацки',
			'staytrueflowers': 'Данное поле должно быть заполнено'
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
		'staytrueflowers': ''
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
			menu.find('.t-menu__link-item').each(function () {
				var href = $(this).attr('href');
				if (Array.from(href)[0] == '#') {
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
 * оптимизируем ссылки на якорь
 */
function anchorLinks() {
	if (site == '2steblya') return;
	$('a[href*="#"]').on('click', function (e) {
		var name = anchorName($(this).attr('href'));
		if (anchorExists(name)) {
			e.preventDefault();
			smoothScroll(name);
			window.location = '#' + name;
		}
		if (name == 'chat' && $('.t825__btn').length) { //#chat
			e.preventDefault();
			$('.t825__btn').trigger('click');
		}
		if (name == 'submenu:info' || name == 'submenu:catalog') { // #submenu
			e.preventDefault();
		}
	});

	/**
	 * загрузка страницы с #
	 */
	if (window.location.hash) {
		setTimeout(function () {
			var name = anchorName(window.location.hash);
			if (anchorExists(name)) smoothScroll(name);
		}, 1000);
	}

	/**
	 * имя скорной ссылки
	 */
	function anchorName(name) {
		return name.split('#')[1];
	}

	/**
	 * существует ли якорь по ссылке
	 */
	function anchorExists(name) {
		return $('[name="' + name + '"]').length;
	}

	/**
	 * плавный скролл к якорю
	 */
	function smoothScroll(name) {
		$([document.documentElement, document.body]).animate({
			scrollTop: $('a[name=' + name + ']').offset().top - 100
		}, 1000);
	}
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
		if (site == '2steblya') return;
		var f = $('.uc-footerCopyright [field="text"]');
		var currentYear = new Date().getFullYear();
		f.text(f.text().replace('2021', '2021-' + currentYear));
	}
}