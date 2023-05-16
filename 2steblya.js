/* корзина включена/выключена */
var cartEnabled = true;
/* форма заказа в корзине сокращенная/полная */
var cartExpanded = false;
/* уровни цен товаров */
var productPriceLevels = {
	6000: ['букетусик', 'сердечко', 'кастрюлька', 'ящичек'],
	10000: ['букетик', 'сердце', 'кастрюля', 'ящик'],
	15000: ['букет', 'кастрюлища', 'корзиночка'],
	20000: ['букетище'],
	25000: ['коробка', 'корзинка'],
	35000: ['корзина'],
	50000: ['букет-гигант', 'корзинища']
};
/* мимимальная цена на сайте */
var minPrice = 0;
/* праздничные даты */
var specialDatesList = [
	{ d: 14, m: 2, minPrice: 10000 },
	{ d: 7, m: 3, minPrice: 15000, exclude: [969888387731, 690076603321, 663441383001, 561739979091] }, //лучшей женщине, лучший весенний суп, пупырка, простата
	{ d: 8, m: 3, minPrice: 15000, exclude: [969888387731, 690076603321, 663441383001, 561739979091] } //лучшей женщине, лучший весенний суп, пупырка, простата
];

$(document).ready(function () {
	headerMenu();
	externalLinks();
	product();
	cart();
	spoilers();
});

/* 
КОРЗИНА
*/
function cart() {
	var int = setInterval(function () {
		if (!$('.t706__cartwin-content').length) return;
		if (!$('.t706 [name="otkuda-uznal-o-nas"]').length) return;
		if (!cartEnabled) {
			$('.t706').remove();
			clearInterval(int);
			return;
		}
		setTimeout(function () {
			cartFunctions();
		}, 1000);
		clearInterval(int);
	}, 50);
}

/* фукнции корзины при инициализации */
function cartFunctions() {
	cartIconUponHeader();
	cartOpen();
	cartClose();
	cartInputContainersClasses();
	cartDelivery();
	cartZakazchikPoluchatel();
	cartRemoveLinkFromTelegram();
	cartFormValidationTexts();
	cartAdresPoluchatelya();
	cartHerZnaetPoluchatelya();
	cartCountItems();
	cartCheckboxBooleanValue();
	cartPreventCloseOnOverlayClick();
	cartErrorsMessageOnClick();
	cartComment();
	cartImportantFields();
	cartRequiredFields();
	cartSetCookies();
	cartUseCookies();
}
/* функции корзины при изменении корзины */
function cartDynamicFunctions() {
	cartProductOptionsInOneLine();
	cartOtsluniavit();
	cartOnlyOneFromVitrina();
	cartDonat();
	cartShow();
}

/* открытие попапа товара */
function cartOpen() {
	$('body').on('click', '.t706__carticon-wrapper,.t-store__prod-popup__btn', function () {
		setTimeout(function () {
			cartDynamicFunctions();
		}, 250);
	});
}
/* закрытие корзины */
function cartClose() {
	$('body').on('click', '.t706__close', function () {
		cartHide();
	});
}
/* показать контент корзины */
function cartShow() {
	$('.t706__cartwin-content').fadeIn();
}
/* скрыть контент корзины */
function cartHide() {
	$('.t706__cartwin-content').hide();
}

/* классы для контейнеров инпутов формы */
function cartInputContainersClasses() {
	$('.t706 .t-input-group').find('input,textarea,select').each(function () {
		var name = $(this).attr('name');
		$(this).parents('.t-input-group').attr('id', name.replace('tildaspec-mask-', ''));
	});
}
/* добавление/удаление товара из корзины */
function cartCountItems() {
	var oldVal;
	setInterval(function () {
		var products = $('.t706__product');
		if (oldVal == products.length) return;
		cartDynamicFunctions();
		oldVal = products.length;
	}, 50);
}
/* доставка */
function cartDelivery() {
	var dates = {};
	var dateField = $('.t706 [name="dostavka-date"]');
	var intervalField = $('.t706 [name="dostavka-interval"]');

	dateField.prop('readonly', true);

	actualDate();
	selectedDate();
	datePicker();
	deliveryInterval();
	telegramLinkInDateFieldDescription();

	/* проверяем не наступило ли завтра (раз в минуту) */
	function actualDate() {
		execute();
		setInterval(function () {
			execute();
		}, 60000);
		function execute() {
			dates['today'] = new Date();
			dates['today-0'] = new Date(); dates['today-0'].setHours(0, 0, 0, 0);
			dates['tomorrow-0'] = new Date(); dates['tomorrow-0'].setDate(dates['today-0'].getDate() + 1); dates['tomorrow-0'].setHours(0, 0, 0, 0);
		}
	}
	/* смена даты */
	function selectedDate() {
		setInterval(function () {
			if (!dateField.val()) return;
			if (dateField.val() == '__-__-____') return;
			if (dateField.val() == (dates['selected-d'] < 10 ? '0' : '') + dates['selected-d'] + '-' + (dates['selected-m'] < 10 ? '0' : '') + dates['selected-m'] + '-' + dates['selected-yyyy']) return;
			var dateParts = dateField.val().split('-');
			dates['selected-0'] = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
			dates['selected-d'] = parseInt(dateParts[0].replace(/^0/, ''));
			dates['selected-m'] = parseInt(dateParts[1].replace(/^0/, ''));
			dates['selected-yyyy'] = parseInt(dateParts[2]);
		}, 50);
	}
	/* календарь */
	function datePicker() {
		var datePicker;
		var executed = false;
		setInterval(function () {
			datePicker = $('.t706 .t_datepicker__inner');
			if (!datePicker.length) return;
			if (datePicker.is(':hidden')) {
				dateField.attr('disabled', false);
				executed = false;
				return;
			}
			if (executed) return;
			selectedDay();
			specialDates();
			vitrinaTodayPurchase();
			dateField.attr('disabled', true);
			executed = true;
		}, 50);
		/* клик на дате */
		$('body').on('click', '.t706 .t_datepicker__day-cell:not(.t_datepicker__past)', function () {
			setTimeout(function () {
				dateField.change();
			}, 100);
		});
		/* календарь должен быть обработан, если сменился месяц или год */
		$('body').on('click', '.t706 .t_datepicker__arrow', function () {
			executed = false;
		});
		$('body').on('change', '.t706 .t_datepicker__header select', function () {
			executed = false;
		});
		/* обнуляем дату доставки: если корзина зхакрывается */
		$('body').on('click', '.t706__close-button,.t706__product-del', function () {
			dateField.val('');
		});
		/* устанавливаем корректную выбранную дату */
		function selectedDay() {
			datePicker.find('.t_datepicker__selected-day').removeClass('t_datepicker__selected-day');
			if (dateField.val()) datePicker.find('[data-picker="' + dates['selected-yyyy'] + '-' + dates['selected-m'] + '-' + dates['selected-d'] + '"]').addClass('t_datepicker__selected-day');
		}
		/* перебираем все ячейки календаря */
		function specialDates() {
			$('.t706 .t_datepicker__day-cell').each(function () {
				var cell = $(this);
				var date = cell.attr('data-picker').match(/\d{4}\-(\d{1,})\-(\d{1,})/);
				var faded = (cell.is('.t_datepicker__next-month') || cell.is('.t_datepicker__previous-month') || cell.is('.t_datepicker__day-cell--disabled'));
				/* ищем специальные даты */
				$.each(specialDatesList, function (i, specialDate) {
					if (specialDate['d'] == date[2] && specialDate['m'] == date[1]) applySpecialDate(specialDate, faded);
				});
			});
		}
		/* изменяем ячейки со специальной датой на закглушку */
		function applySpecialDate(specialDate, faded) {
			var allow = false;
			/* ищем товар с минимально разрешенной ценой */
			var tovars = $('.t706__product');
			if (tovars.length) {
				tovars.each(function () {
					/* исключения */
					var uid = parseInt($(this).find('.t706__product-title a').attr('href').match(/\d{12}/));
					if (specialDate['exclude'] && specialDate['exclude'].includes(uid)) {
						allow = true;
						return;
					}
					/* цены */
					var price = parseInt($(this).find('.t706__cartwin-prodamount-price').text().replace(/[^\d]/, ''));
					if (specialDate['minPrice'] && price >= specialDate['minPrice']) {
						allow = true;
						return;
					}
					allow = false;
					return false;
				});
			}
			if (allow) return;
			/* подменяем стандартную ячейку с датой на заглушку */
			if (!specialDate['minPrice']) return;
			var minPriceK = specialDate['minPrice'].toString().replace(/0{3}$/, 'к');
			var zaglushka = $('<div class="specialDate" title="' + (specialDate['exclude'] && specialDate['exclude'].length ? 'только товары из праздничной коллекции и ' : '') + 'товары от ' + minPriceK + '">от<br>' + minPriceK + '</div>');
			if (faded) zaglushka.css('opacity', .4);
			datePicker.find('[data-picker$="-' + specialDate['m'] + '-' + specialDate['d'] + '"]').hide().after(zaglushka);
		}
		/* открываем продажу на сегодня для корзины с товарами из витрины */
		function vitrinaTodayPurchase() {
			var vitrinaList = getVitrinaTovarsIds();
			if (!vitrinaList.length) return;
			var allow = true;
			var tovars = $('.t706__product');
			if (!tovars.length) return;
			tovars.each(function () {
				if (vitrinaList.includes(getTovarInCartId($(this)))) return;
				allow = false;
				return false;
			});
			if (!allow) return;
			if (dates['today'].getHours() >= 22) return;
			$('.t706 .t_datepicker__today').removeClass('t_datepicker__day-cell--disabled');
		}
	}
	/* интервал доставки */
	function deliveryInterval() {
		/* показать/скрыть */
		setInterval(function () {
			if (dateField.val()) {
				$('#dostavka-interval').show();
			} else {
				$('#dostavka-interval').hide();
			}
		}, 100);
		/* если меняется дата или меняется интервал */
		$('body').on('change', intervalField.selector + ',' + dateField.selector, function () {
			intervalField.children('option').attr('disabled', false);
			if (!dates['selected-0']) return;
			if (dates['selected-0'].toDateString() == dates['tomorrow-0'].toDateString()) tomorrowDeliveryInterval();
			if (dates['selected-0'].toDateString() == dates['today-0'].toDateString()) todayDeliveryInterval();
		});
		/* доставка завтра */
		function tomorrowDeliveryInterval() {
			/* утренняя доставка на завтра с вечера (после 18 часов) невозможна */
			if (dates['today'].getHours() < 18) return;
			disableOpt(1);
		}
		/* доставка сегодня */
		function todayDeliveryInterval() {
			/* на сегодня можно заказать либо с витрины, либо НИТАКОЙ */
			var hour = dates['today'].getHours();
			var isNitakoi = false;
			var tovars = $('.t706__product');
			tovars.each(function () {
				if (getTovarInCartId($(this)) != 105671635591) return;
				isNitakoi = true;
				return false;
			});
			var startHour = isNitakoi ? 3 : 6; //закладываем 3 часа на сборку НИТАКОГО
			for (i = 1; i <= 3; i++) {
				if (hour >= startHour + 4 * i) disableOpt(i); //за два часа до истечения интервала
			}
		}
		function disableOpt(i) {
			var opt = intervalField.children('option:nth-child(' + i + ')');
			opt.attr('disabled', true);
			if (opt.is(':selected')) {
				opt.removeAttr('selected');
				opt.next().attr('selected', true);
			}
		}
	}
	/* ссылка на телегу в описании к полю "выбор даты" */
	function telegramLinkInDateFieldDescription() {
		var descr = $('#dostavka-date .t-input-subtitle');
		var html = descr.text().replace('телегу', '<a href="https://t.me/dva_steblya">телегу</a>');
		descr.html(html);
	}
}
/* отслюнявить */
function cartOtsluniavit() {
	$('.t706__cartwin-prodamount-label').text('нужно отслюнявить ');
}
/* донат */
function cartDonat() {
	$('.t706__cartwin-content').removeClass('donat');
	var tovars = $('.t706__product');
	if (!tovars.length) return;
	if (tovars.length > 1) return;
	if (getTovarInCartId(tovars.eq(0)) != 857613433221) return;
	$('.t706__cartwin-content').addClass('donat');
	cartIncompleteRemoveRequired();
	if ($('[name="dostavka-date"]').val()) return;
	var today = new Date();
	var day = {
		d: today.getDate() + 1,
		m: today.getMonth() + 1,
		y: today.getFullYear()
	};
	if (day['d'] < 10) day['d'] = '0' + day['d'];
	if (day['m'] < 10) day['m'] = '0' + day['m'];
	$('[name="dostavka-date"]').val(day['d'] + '-' + day['m'] + '-' + day['y']);
}
/* если заказчик - это получатель */
function cartZakazchikPoluchatel() {
	var namePoluchatelya = $('.t706 [name="name-poluchatelya"]');
	var phonePoluchatelya = $('.t706 [name="phone-poluchatelya"]');
	$('#name-poluchatelya,#phone-poluchatelya,#phone-poluchatelya + div').wrapAll('<div />').wrapAll('<div id="poluchatelData" />');
	var nameZakazchika = $('.t706 [name="name-zakazchika"]');
	var phoneZakazchika = $('.t706 [name="phone-zakazchika"]');
	var parts = [
		'<div class="t-input-group t-input-group_cb unimportant">',
		'<label class="t-checkbox__control t-text t-text_xs">',
		'<input type="checkbox" class="t-checkbox js-tilda-rule">',
		'<div class="t-checkbox__indicator"></div>',
		'получать буду я',
		'</label>',
		'</div>'
	];
	var ZPButton = $(parts.join(''));
	var ZPInt;
	ZPButton.insertBefore('#poluchatelData');
	ZPButton.on('change', 'input', function () {
		$('#poluchatelData').toggle(!$(this).is(':checked'));
		if ($(this).is(':checked')) {
			ZPInt = setInterval(function () {
				namePoluchatelya.val(nameZakazchika.val());
				phonePoluchatelya.val(phoneZakazchika.val());
			}, 50);
		} else {
			namePoluchatelya.val('');
			phonePoluchatelya.val('');
			clearInterval(ZPInt);
		}
	});
}
/* скрыть или показать все поля (.unimportant) */
function cartImportantFields() {
	if (cartExpanded) return;
	var lastImportant = $('#dostavka-interval');
	lastImportant.nextAll().not(':last').hide();
	var parts = [
		'<div class="t-input-group t-input-group_cb" id="unimportantTrigger">',
		'<div class="t-input-title t-descr t-descr_md">чтобы не мурыжить тебя в телеге, лучше</div>',
		'<label class="t-checkbox__control t-text t-text_xs" style="padding:10px 0">',
		'<input type="checkbox" class="t-checkbox js-tilda-rule">',
		'<div class="t-checkbox__indicator"></div>',
		'заполнить всю инфу сразу',
		'</label>',
		'</div>'
	];
	var btn = $(parts.join(''));
	btn.insertAfter(lastImportant);
	btn.on('change', 'input', function () {
		cartIncompleteRemoveRequired(); // удаляем атрибут "обязательное поле" у поля cartIncomplete 
		btn.nextAll().not(':last').toggle($(this).is(':checked'));
	});
}
/* поля обязательные если cartExpanded */
function cartRequiredFields() {
	if (!cartExpanded) return;
	var fields = [
		'.t706 [name="dostavka-interval"]',
		'.t706 [name="name-poluchatelya"]',
		'.t706 [name="phone-poluchatelya"]',
		'.t706 [name="adres-poluchatelya-street"]',
		'.t706 [name="adres-poluchatelya-dom"]'
	];
	$(fields.join(',')).attr('data-tilda-req', 1);
	cartIncompleteRemoveRequired();
}
/* тексты валидационных ошибок корзины */
function cartFormValidationTexts() {
	var texts = [
		'ну не-е-е-е...',                       //name
		'скинь телефончик, а?',                 //phone
		'а куда фотку букета выслать?',         //telegram
		'ты календарь... переверни...',         //delivery date
		'а вдруг разбудим?'                     //delivery interval      
	];
	formValidationTexts($('.t706__orderform'), texts);
}
/* удаляем t.me из ник в телеграм */
function cartRemoveLinkFromTelegram() {
	$('body').on('change', '.t706 [name="messenger-zakazchika"]', function () {
		if (!$(this).val().includes('t.me/')) return;
		$(this).val($(this).val().replace(/^(?:https\:\/\/)*t\.me\//, ''));
	});
}
/* собираем адрес получателя из многих полей, в одно */
function cartAdresPoluchatelya() {
	var adresProps = ['city', 'street', 'dom', 'kvartira', 'korpus', 'stroenie', 'podezd', 'etazh', 'domofon'];
	var adresInputs = {};
	var adresSmall = [];
	$.each(adresProps, function (i, val) {
		adresInputs[val] = $('.t706 [name="adres-poluchatelya-' + val + '"]');
		if (['city', 'street'].includes(val)) return;
		adresSmall.push('#adres-poluchatelya-' + val);
	});
	$.each(adresInputs, function (i, input) {
		input.addClass('adresInput');
		input.on('change', function () {
			var adresValue = '';
			adresValue += 'г.' + (adresInputs.city.val() ? adresInputs.city.val() : 'Москва');
			if (adresInputs.street.val()) adresValue += ', ул.' + adresInputs.street.val().replace(/^[Уу]л\.*/, '').trim();
			if (adresInputs.dom.val()) adresValue += ' ' + adresInputs.dom.val();
			if (adresInputs.korpus.val()) adresValue += 'к' + adresInputs.korpus.val();
			if (adresInputs.stroenie.val()) adresValue += 'c' + adresInputs.stroenie.val();
			if (adresInputs.kvartira.val()) adresValue += ', кв.' + adresInputs.kvartira.val();
			if (adresInputs.podezd.val()) adresValue += ', подъезд ' + adresInputs.podezd.val();
			if (adresInputs.etazh.val()) adresValue += ', этаж ' + adresInputs.etazh.val();
			//if(adresInputs.domofon.val())    adresValue += ', домофон ' +adresInputs.domofon.val();

			$('[name="adres-poluchatelya"]').val(adresValue);
		});
	});

	/* разместим покомпактее */
	$(adresSmall.join(',')).wrapAll('<div id="adresDataSmall" />').wrapAll('<div />');
	/* обернем весь адрес в див */
	$('#adres-poluchatelya-street,#adresDataSmall,#courier-comment').wrapAll('<div />').wrapAll('<div id="adresData" />');
}
/* заказчик не знает адрес (хер знает получателя) */
function cartHerZnaetPoluchatelya() {
	var herZnaet = $('.t706 [name="uznat-adres-u-poluchatelya"]');
	if (cartExpanded) {
		$('#uznat-adres-u-poluchatelya').remove();
		return;
	}
	herZnaet.on('change', function () {
		$('#adresData').toggle(!$(this).is(':checked'));
		$('.t706 [name="adres-poluchatelya"]').val('');
		$('.t706 [name="courier-comment"]').val('').trigger('change');
		$('.t706 .adresInput').each(function () {
			$(this).val('');
		});
	});
}
/* опции товаров в одну строку */
function cartProductOptionsInOneLine() {
	var props = $('.t706__product-title__option div');
	props.each(function () {
		var text = $(this).text().split(/\s*:\s*/);
		switch (text[0]) {
			case 'накинуть косарь':
			case 'накинуть пятихатку':
			case 'накинуть сотен':
				$(this).hide();
				break;
			case 'выебри карточку':
				text[1] = text[1].replace('со своим', 'с твоим');
				break;
		}
		$(this).text(text[1]);
	});
}
/* заменяем дефолтные текстовые значения на булевы во всех полях чекбоксах */
function cartCheckboxBooleanValue() {
	$('.t706__orderform .t-input-group_cb input[type="checkbox"]').each(function () {
		$(this).val(true);
	});
}
/* не закрывать корзину при клике на пустое пространство по бокам */
function cartPreventCloseOnOverlayClick() {
	var e = $('.t706__cartwin');
	var overlay = $('<div style="display:block;width:100%;height:100%;position:absolute;top:0;left:0;z-index:2"></div>');
	e.append(overlay);
	e.on('scroll', function () {
		overlay.css('top', $(this).scrollTop() + 'px');
	});
}
/* сообщение об ошибке (с расшифровкой) в кнопке оформления заказа */
function cartErrorsMessageOnClick() {
	var tim1, tim2;
	var btn = $('.t706__cartwin .t-submit');
	var btnText = btn.text();
	btn.on('click', function () {
		clearTimeout(tim1);
		clearTimeout(tim2);
		btn.text('...');
		tim1 = setTimeout(function () {
			var errorFields = $('.t706 .js-error-control-box');
			var errorFieldsTitles = [];
			$.each(errorFields, function () {
				var errorTitle = $(this).find('.t-input-title').text().trim();
				if (!errorTitle) return;
				errorFieldsTitles.push(errorTitle);
			});
			if (!errorFieldsTitles.length && errorFields.length == 1 && !cartExpanded) { // cart Incomplete
				cartFormIncomplete();
				btn.text(btnText);
			} else {
				var errorTitle = 'ЧТО-ТО НЕ ТОГО. ПЕРЕПРОВЕРЬ!';
				var errorTime;
				if (cartExpanded) {
					errorTime = 3000;
					btn.text(errorTitle);
				} else {
					errorTime = 6000;
					btn.html(errorTitle + '<br><span style="font-size:.7em;font-weight:400;color:#000">' + errorFieldsTitles.join(' / ') + '</span>');
				}
				tim2 = setTimeout(function () {
					btn.text(btnText);
				}, errorTime);
			}
		}, 400);
	});
}
/* всплывашка, если форма не заполнена до конца */
function cartFormIncomplete() {
	/* удаляем атрибут "обязательное поле" */
	cartIncompleteRemoveRequired();
	/* открываем попап */
	var popup = $('[data-tooltip-hook="#popup:cartIncomplete"]');
	popup.show().animate({ 'opacity': 1 }, 'fast', function () {
		window.dispatchEvent(new Event('resize')); //нужно, чтоб загрузились картинки
	});
	popup.find('.t390__btn-wrapper a:nth-child(2)').on('click', function (e) {
		e.preventDefault();
		$('.t706__cartwin .t-submit').trigger('click'); // имитируем клик по оформлению формы заказа
	});
	popup.find('.t390__btn-wrapper a:nth-child(1)').on('click', function (e) {
		e.preventDefault();
		$('#unimportantTrigger input').trigger('click'); //открываем скрытые поля формы
		$('#unimportantTrigger').remove(); //удаляем чекбокс unimportantFields
		popup.find('.t-popup__close').trigger('click'); //имитируем клик по крестику
	});

}
/* удаляем атрибут "обязательное поле" у поля cartIncomplete */
function cartIncompleteRemoveRequired() {
	$('.t706 [data-input-lid="1675967313188"] input').removeAttr('data-tilda-req');
}
/* комментарий курьеру и флористу */
function cartComment() {
	var courier = $('.t706 [name="courier-comment"]');
	var florist = $('.t706 [name="florist-comment"]');
	var comment = $('.t706 [name="comment"]');
	var domofon = $('.t706 [name="adres-poluchatelya-domofon"]');
	$('body').on('change', courier.selector + ',' + florist.selector + ',' + domofon.selector, function () {
		makeComment();
	});
	function makeComment() {
		var text = '';
		text += '***курьер***\n';
		text += domofon.val() ? 'Код домофона: ' + domofon.val() + '\n' : '';
		text += courier.val() + '\n';
		text += '***флорист***\n';
		text += florist.val();
		comment.val(text);
	}
}
/* на средних экранах иконка корзины не наезжает на меню */
function cartIconUponHeader() {
	if ($(window).width() > 981 && $(window).width() < 1370) {
		var cartIcon = $('.t706__carticon');
		var headerHeight = 110;
		setInterval(function () {
			cartIcon.toggleClass('uponHeader', $(window).scrollTop() <= headerHeight);
		}, 50);
	}
}
/* убираем возможность менять количество в корзине для товаров с витрины */
function cartOnlyOneFromVitrina() {
	var vitrinaList = getVitrinaTovarsIds();
	if (!vitrinaList.length) return;
	var tovars = $('.t706__product');
	if (!tovars.length) return;
	tovars.each(function () {
		var id = getTovarInCartId($(this));
		if (!vitrinaList.includes(id)) return;
		if (id == 105671635591) return; //НИТАКОЙ
		$(this).children('.t706__product-plusminus').empty();
	});
}
/* пишем в куку данные заказчика и адрес */
function cartSetCookies() {
	cartCookie('zakazchik', ['name-zakazchika', 'phone-zakazchika', 'messenger-zakazchika']);
	cartCookie('adres-poluchatelya', ['adres-poluchatelya-street', 'adres-poluchatelya-dom', 'adres-poluchatelya-kvartira', 'adres-poluchatelya-korpus', 'adres-poluchatelya-stroenie', 'adres-poluchatelya-podezd', 'adres-poluchatelya-etazh', 'adres-poluchatelya-domofon', 'courier-comment', 'adres-poluchatelya-city']);
	function cartCookie(cookieName, fields) {
		var inputs = [];
		$.each(fields, function (i, id) {
			inputs.push('#' + id + ' input');
		});
		$('body').on('change', inputs.join(), function () {
			if (!$(this).val()) return;
			var cookie = {};
			$.each(fields, function (i, id) {
				cookie[id] = $(inputs[i]).val();
			});
			Cookies.set(cookieName, JSON.stringify(cookie), { expires: 365 });
		});
	};
}
/* заполняем поля данными из куки заказчика и адрес */
function cartUseCookies() {
	cartCookie('zakazchik', ['name-zakazchika', 'phone-zakazchika', 'messenger-zakazchika'], [0, 1], 'вспомнить меня');
	cartCookie('adres-poluchatelya', ['adres-poluchatelya-street', 'adres-poluchatelya-dom', 'adres-poluchatelya-kvartira', 'adres-poluchatelya-korpus', 'adres-poluchatelya-stroenie', 'adres-poluchatelya-podezd', 'adres-poluchatelya-etazh', 'adres-poluchatelya-domofon', 'courier-comment', 'adres-poluchatelya-city'], [0, 1], 'как в прошлый раз');
	function cartCookie(cookieName, fields, requiredFields, btnText) {
		var cookie = Cookies.get(cookieName);
		if (!cookie) return;
		cookie = JSON.parse(cookie);
		var cookieValues = Object.values(cookie);
		for (var i = 0; i < requiredFields.length; i++) {
			if (!cookieValues[requiredFields[i]]) return;
		}
		var btn = $('<a class="cartUseCookieBtn">' + btnText + '</a>');
		$('#' + fields[0]).append(btn);
		btn.on('click', function (e) {
			e.preventDefault();
			$(this).hide();
			$.each(fields, function (i, id) {
				$('#' + fields[i] + ' input').val(cookieValues[i]);
			});
		});
	}
}

/*
ТОВАР
*/
function product() {
	var int = setInterval(function () {
		if (window.location.pathname.includes('/tproduct/')) {
			/* страница продукта /tproduct/... */
			productLogoInHeader();
			var tovar = $('.js-store-product:not(.loaded)');
			if (!tovar) return;
			if (!getTovarPrice(tovar)) return;
			setTimeout(function () {
				productTovarFunctions(tovar);
			}, 1000);
			clearInterval(int);
		} else {
			/* если на странице есть каталог */
			var catalogs = $('.js-store');
			if (!catalogs.length) return;
			catalogs.each(function () {
				productCatalogFunctions($(this));
			});
			clearInterval(int);
		}
	}, 50);
}

/* функции для товаров в попапе и на отдельной странице */
function productTovarFunctions(tovar) {
	productOptionsWithPrices(tovar);
	productRemovePriceOptions(tovar, minPrice);
	productReplaceCardImgWithText(tovar);
	productVyebriKartochku(tovar);
	productOptionsReadMore(tovar);
	productHtmlInDescription(tovar);
	productHideEmptyText(tovar);
	productAddAdditionalText(tovar);
	productCharcs(tovar);
	productPriceInput(tovar);
	productBlackFriday(tovar);
	productSoldOut(tovar);
	productBomjPlashka(tovar);
	productButton(tovar);
	productCartDisabled(tovar);
	productShow(tovar);
}
/* функции для товаров в каталоге */
function productCatalogTovarFunctions(tovar, catalog) {
	productOptionsWithPrices(tovar);
	productRemovePriceOptions(tovar, minPrice);
	productReplaceCardImgWithText(tovar, catalog);
	productNitakoiKakVse(tovar);
	productBlackFriday(tovar);
	productSoldOut(tovar, catalog);
	productBomjPlashka(tovar, catalog);
	productHideVitrinaDuplicate(tovar, catalog);
	productShow(tovar);
}
/* функции для каталога */
function productCatalogFunctions(catalog) {
	if (isVitrina(catalog, true)) return;
	productPopupOpen(catalog);
	productPopupClose();
	productCatalogMenu(catalog);
	productCatalogMutationObserver(catalog);
}

/* открытие попапа товара */
function productPopupOpen(catalog) {
	var int = setInterval(function () {
		var popupTovar = catalog.find('.t-popup .js-product:not(.loaded)');
		if (!popupTovar.length) return;
		var observer = new MutationObserver(observerCallback);
		observer.observe(popupTovar.get(0), { attributes: true, attributeFilter: ['data-product-gen-uid'], attributeOldValue: true, childList: false, subtree: false });
		function observerCallback(mutationList, observer) {
			if (!mutationList.length) return;
			setTimeout(function () {
				productTovarFunctions(popupTovar);
			}, 1000);
		}
		clearInterval(int);
	}, 50);
}
/* закрытие попапа */
function productPopupClose() {
	$('body').on('click', '.t-popup__close,.t-store__prod-popup__close-txt-wr,.t-store__prod-popup__btn', function () {
		var tovar = $(this).parents('.t-popup').find('.js-product');
		productHide(tovar);
	});
}
/* проявляем товар из невидимости */
function productShow(tovar) {
	tovar.addClass('loaded');
	tovar.children().animate({ opacity: 1 }, 250);
}
/* скрываем товар */
function productHide(tovar) {
	tovar.removeClass('loaded multiplePrices bomj noCard');
	setTimeout(function () {
		tovar.children().css('opacity', 0);
	}, 300);
}
/* меню каталога */
function productCatalogMenu(catalog) {
	setTimeout(function () {
		var catalogMenuItems = catalog.find('.js-store-parts-switcher');
		if (!catalogMenuItems.length) return;
		/* делаем кликабельные ссылки */
		catalogMenuItems.each(function () {
			$(this).contents().wrap('<a href="/?tfc_storepartuid[457192487]=' + $(this).text() + '&tfc_div=:::#shop" style="color:#fff"></a>');
		});
		/* переименовываем пункт "все" */
		//$('.t-store__parts-switch-btn-all').text('ALL');
		/* клик */
		catalogMenuItems.on('click', function (e) {
			e.preventDefault();
			var href = window.location.href;
			href = href.slice(0, href.indexOf('#'));
			window.history.replaceState(null, '', href + '#shop');
		});
	}, 1000);
}
/* обновление каталога */
function productCatalogMutationObserver(catalog) {
	var observer = new MutationObserver(observerCallback);
	observer.observe(catalog.children('.js-store-grid-cont').get(0), { attributes: false, childList: true, subtree: false });
	function observerCallback(mutationList, observer) {
		if (!mutationList.length) return;
		var tovars = catalog.find('.js-store-grid-cont .js-product:not(.loaded)');
		if (!tovars.length) return;
		setTimeout(function () {
			tovars.each(function () {
				var tovar = $(this);
				productCatalogTovarFunctions(tovar, catalog);
			});
			window.dispatchEvent(new Event('resize'));
		}, 1000);
	}
}

/* скрываем товары из витрины в других каталогах */
function productHideVitrinaDuplicate(tovar, catalog) {
	if (isVitrina(catalog)) return;
	var vitrinaList = getVitrinaTovarsIds();
	if (!vitrinaList.length) return;
	$.each(vitrinaList, function (i, id) {
		if (getTovarId(tovar) != id) return;
		tovar.hide();
	});
}
/* цены в опциях формата */
function productOptionsWithPrices(tovar) {
	var options = tovar.find('[data-edition-option-id="фор мат"] select option');
	if (options.length > 1) tovar.addClass('multiplePrices');
	if (getTovarId(tovar) == 857613433221) tovar.addClass('multiplePrices'); //* донатошная */
	options.each(function () {
		var optionTitle = $(this).text();
		var price;
		$.each(productPriceLevels, function (p, levels) {
			if (!levels.includes(optionTitle)) return;
			price = p;
			return false;
		});
		$(this).attr('price', price);
	});
}
/* ограничение по цене */
function productRemovePriceOptions(tovar, minPrice) {
	var edited = false;
	/*удаляем опции*/
	$.each(productPriceLevels, function (price, titles) {
		if (price >= minPrice) return;
		edited = true;
		tovar.removeClass('bomj');
		$.each(titles, function (j, title) {
			tovar.find('[data-edition-option-id="фор мат"] select option[value="' + title + '"]').remove();
		});
	});
	if (!edited) return;
	var optLength = tovar.find('[data-edition-option-id="фор мат"] select option').length;
	if (!optLength) tovar.hide();
	if (optLength == 1) tovar.removeClass('multiplePrices');
	/*меняем цену*/
	if (getTovarPrice(tovar) < minPrice) tovar.find('.js-product-price').text(minPrice.toString().replace(/(\d{3})$/, ' $1'));
}
/* если корзина отключена */
function productCartDisabled(tovar) {
	if (cartEnabled) return;
	var cartDisabledParts = [
		'<p class="t-btn">а как купить?</p>',
		'<p class="t-text">сорян, мы зашиваемся и пока прием заказов заказан. но если у вас очень важное дело, то напишите нам в <a href="https://t.me/dva_steblya" target="blank">телегу</a>, че-нить придумаем</p>'
	];
	var cartDisabled = $('<div class="cartDisabled t-text"></div>');
	cartDisabled.html(cartDisabledParts.join(''));
	tovar.find('.js-product-controls-wrapper').hide().after(cartDisabled);
	tovar.find('.js-store-buttons-wrapper').remove();
}
/* бомжетность */
function productBomjPlashka(tovar, catalog) {
	if (getTovarPrice(tovar) > Object.keys(productPriceLevels)[0]) return;
	tovar.addClass('bomj');
	var plashka = $('<div class="bomjPlashka">бомжетный</div>');
	tovar.find(catalog ? '.js-product-img' : '.t-slds').append(plashka);
	if (catalog) return;
	setInterval(function () {
		plashka.toggle(!$('.t-slds__item[data-slide-index="2"]').is('.t-slds__item_active')); //скрываем бомж плашку на слайдах с карточкой
	}, 100);
}
/* кнопка "купить" */
function productButton(tovar) {
	/* донатошная */
	if (getTovarId(tovar) == 857613433221) {
		$('.js-store-prod-popup-buy-btn-txt').text('ЗАДОНАТИТЬ!');
	}
}
/* скрываем товар с произвольной ценой (НИ ТАКОЙ КАК ВСЕ) */
function productNitakoiKakVse(tovar) {
	if (getTovarId(tovar) != 105671635591) return;
	tovar.prev('.t-clear').addBack().hide();
}
/* заменяем картинку "наша карточка" на текстовый аналог */
function productReplaceCardImgWithText(tovar, catalog) {
	if (!isCardToBeReplaced(tovar)) {
		removeOption();
		removeSelect(catalog);
		return;
	}
	var card = tovar.find(catalog ? '.t-store__card__bgimg_second' : '.t-slds__item[data-slide-index="2"]');
	var cardContent = $('<div class="card__container t-text"></div>');
	var cardParts = [
		'<p class="card__buket">этот букет называется</p>',
		'<div class="card__title">' + getTovarTitle(tovar) + '</div>',
		'<div class="card__text">' + getTovarCardText(tovar) + '</div>',
		'<div class="card__your-text"><p>«здесь может быть ваша реклама»</p><p>или какой хочешь текст,</p><p>решать тебе</p></div>'
	]
	cardContent.append(cardParts.join(''));
	card.addClass('card').html(cardContent);
	if (!catalog) {
		setTimeout(function () {
			card.height(card.width());
		}, 500);
	}
	removeOption();
	removeSelect(catalog);

	/* удаляем опцию "с нашей карточкой", если нет текста */
	function removeOption() {
		if (getTovarCardText(tovar)) return;
		tovar.find('.js-product-option').find('select option[value="с нашей карточкой"]').remove();
		tovar.find('[data-slide-bullet-for="2"]').remove();
		tovar.addClass('noCard');
	}
	/* удаляем селект "выебри карточку", чтоб он не улетал в срм */
	function removeSelect(catalog) {
		if (catalog) return;
		tovar.find('.js-product-option:last').remove();
	}
	/* если товару не надо подменять карточку */
	function isCardToBeReplaced(tovar) {
		/* по разделам к сожалению, нельзя использовать атрибут data-product-part-uid (айдишники разделов), так как этот атрибут отсутствует на страницах товаров (только в попапе) */
		/* по айдишникам товаров (data-product-gen-uid) */
		var ids = [];
		/*14 фераля 2023 (love is)*/
		ids.push(896292515801);
		ids.push(103878497051);
		ids.push(448865187471);
		ids.push(260954710551);
		/*всрадость*/
		ids.push(953890300331);
		if (ids.includes(getTovarId(tovar))) return false;
		return true;
	}
}
/* скрываем текст с пустым #nbsp; */
function productHideEmptyText(tovar) {
	var e = tovar.find('.js-store-prod-all-text');
	if (!e.text().trim()) e.hide();
}
/* поле: выебри карточку */
function productVyebriKartochku(tovar) {
	var selectOptions = ['с нашей карточкой', 'со своим текстом', 'без айдентики'];
	tovar.find('.js-product-option:last select').on('change', function () {
		var bullets = $(this).parents('.t-store').find('.t-slds__thumbsbullet');
		if (!bullets.length) return;
		switch ($(this).val()) {
			case selectOptions[0]:
				bullets.eq(1).trigger('click');
				break;
			default:
				if (!bullets.eq(1).is('.t-slds__bullet_active')) break;
				bullets.eq(0).trigger('click');
				break;
		}
	});
}
/* добавить дополнительный текст под описание товара */
function productAddAdditionalText(tovar) {
	var div = $('<div class="js-store-prod-all-text-dop"></div>');
	div.html('к любому букету прилагается его состав и чудо-порошок для продления жизни цветов<br>к букетам с айдентикой также прилагается карт очка и сосабельный петушок');
	$('.js-store-prod-text').append(div);
}
/* характеристики товара */
function productCharcs(tovar) {
	tovar.find('.js-store-prod-charcs').each(function () {
		$(this).addClass('costumized');
		let [first, ...rest] = $(this).text().split(/:\s/);
		rest = rest.join(': ');
		$(this).html('<b>' + first + '</b> ' + rest);
	});
}
/* товар распродан */
function productSoldOut(tovar, catalog) {
	if (!catalog) {
		var btn = tovar.find('.t-store__prod-popup__btn');
		var selects = tovar.find('.js-product-controls-wrapper');
		btn.show();
		selects.show();
		if (!btn.is('.t-store__prod-popup__btn_disabled')) return;
		if (!['Нет в наличии', 'Out of stock'].includes(btn.text().trim())) return;
		selects.hide();
		btn.hide().after('<div id="productSoldout" class="t-descr" style="font-weight:600">нет в наличии</div>');
	} else {
		var e = tovar.find('.js-store-prod-sold-out');
		if (!e.length) return;
		e.removeClass('t-name').addClass('t-descr').css({ 'line-height': '31px', 'text-transform': 'lowercase' });
		e.siblings('.t-store__card__price').hide();
	}
}
/* логотип вместо "НА ЗАД" на страницах товаров (не попап) */
function productLogoInHeader() {
	$('.js-store-close-text').empty().addClass('logo'); //широкие экраны
	$('.t-popup__close').addClass('logo'); //мобилка
	$('a.t-store__prod-popup__close-txt').attr('href', '/');
}
/* добавляем скрытое поле: цена */
function productPriceInput(tovar) {
	var optionsCont = tovar.find('.js-product-controls-wrapper');
	var selGroup = optionsCont.children(':last').clone();
	selGroup.find('.js-product-option-name').text('цена');
	selGroup.find('select').empty().append('<option />');
	selGroup.hide().appendTo(optionsCont);
	setInterval(function () {
		var price = getTovarPrice(tovar);
		selGroup.find('option').val(price).text(price);
	}, 1000);
}
/* ссылки на объясняющие страницы рядом с полями опций товара */
function productOptionsReadMore(tovar) {
	var productOptionsHelpLinks = {
		'фор мат': '/format',
		'выебри карточку': '/card'
	}
	tovar.find('.t-product__option-select').each(function () {
		var href = productOptionsHelpLinks[$(this).parent().prev().text()];
		if (!href) return;
		$(this).after('<a class="product__optionReadMore" href="' + href + '" onclick="window.open(\'' + href + '\');return false;">?</a>');
	});
}
/* заменяем (&lt; &gt;) на нормальные символы (< >) в описании товара, чтоб отрабатывал html */
function productHtmlInDescription(tovar) {
	var text = tovar.find('.js-store-prod-all-text');
	if (!text.length) return;
	if (!text.html().includes('&lt;')) return;
	var html = text.html();
	html = html.replace('&lt;', '<');
	html = html.replace('&gt;', '>');
	text.html(html);
}
/* черная пятница */
function productBlackFriday(tovar) {
	return;
	var originalPriceCont = tovar.find('.js-store-prod-price');
	var originalPrice = tovar.find('.js-product-price');
	var fridayPrice = $('<div class="fridayPrice" />');
	var fridayOldprice = $('<div class="fridayOldprice" />');
	var fridayDiscont = $('<div class="fridayDiscont">90% sale</div>');
	fridayPrice.append(fridayOldprice).append(fridayDiscont).insertBefore(originalPrice);
	rePrice(getTovarPrice(tovar));
	tovar.find('[data-edition-option-id="фор мат"] select').on('change', function () {
		rePrice(getTovarPrice(tovar));
	});
	function rePrice(price) {
		originalPriceCont.css('visibility', 'hidden');
		setTimeout(function () {
			var priceVal = Math.round(price / 10) * 10;
			fridayOldprice.text(priceVal * 10);
			originalPrice.text((priceVal - 1).toString().replace(/9{3}$/, ' 999'));
			originalPriceCont.css('visibility', 'visible');
		}, 250);
	}
}
/* товар распродан */
function productSoldOut(tovar, catalog) {
	if (catalog) {
		var e = tovar.find('.js-store-prod-sold-out');
		e.removeClass('t-name').addClass('t-descr').css({ 'line-height': '31px', 'text-transform': 'lowercase' });
		e.siblings('.t-store__card__price').hide();
	} else {
		/* откатываем */
		var btn = $('.t-store__prod-popup__btn');
		btn.show();
		var selects = $('.js-product-controls-wrapper');
		selects.show();
		tovar.find('.productSoldout').remove();
		/* накатываем */
		if (!['Нет в наличии', 'Out of stock'].includes(btn.text().trim())) return;
		btn.hide().after('<div class="productSoldout t-btn">нет в наличии</div>');
		selects.hide();
	}
}

/* HELPERS */
/* получаем текст карточки из селекта "выебри карточку" и удаляем этот селект функцией удаления (выше) */
function getTovarCardText(tovar) {
	var val = tovar.find('.js-product-option:last').find('select').val();
	return val.split('*br*').join('<br>');
}
/* получаем название товара для карточки */
function getTovarTitle(tovar) {
	return tovar.find('.js-store-prod-name').text();
}
/* получаем id товара */
function getTovarId(tovar) {
	return parseInt(tovar.attr('data-product-gen-uid'));
}
/* получаем текущую цену товара */
function getTovarPrice(tovar) {
	var price = tovar.find('[data-product-price-def]');
	if (!price) return null;
	if (!price.text()) return null;
	return parseInt(price.text().replace(/[^\d]/g, ''));
}
/* получаем айдишники товаров с свитрины */
function getVitrinaTovarsIds() {
	var vitrinaList = [];
	var vitrinaTovars = $('.uc-vitrinaFooter .js-product.t-store__card');
	if (!vitrinaTovars.length) return vitrinaList;
	vitrinaTovars.each(function () {
		vitrinaList.push(getTovarId($(this)));
	});
	return vitrinaList;
}
/* если каталог - это витрина */
function isVitrina(catalog, inFooter = false) {
	var c = '.uc-' + (inFooter ? 'vitrinaFooter' : 'vitrinaCatalog');
	if (catalog.parents(c).length) return true;
	return false;
}
/* получаем айдишник товара в корзине */
function getTovarInCartId(tovar) {
	return parseInt(tovar.find('.t706__product-title a').attr('href').match(/\d{12}/));
}


/* заменяем дефолтные опсания ошибок валидации на свои тексты
в функцию передаются объект формы и массив текстов (идентификаторы текстов должны соответствовать порядковым номерам полей формы) */
function formValidationTexts(form, texts = []) {
	if (!form.length) return;
	form.find('.t-submit').on('click', function () {
		var int = setInterval(function () {
			var inputErrors = form.find('[data-tilda-req="1"]').parents('.t-input-block').find('.t-input-error');
			if (!inputErrors.length) return;
			inputErrors.each(function (i, e) {
				var errorText = texts[i] ? texts[i] : 'укажи по брацки';
				inputErrors.eq(i).text(errorText);
			});
			clearInterval(int);
		}, 1);
	});
}

/* меню в шапке */
function headerMenu() {
	var menu = $('#rec469639590');
	if (!menu.length) return;
	/* remove link from 18+ in header menu*/
	menu.find('.t-sociallinks .t-sociallinks__item:last a').contents().wrapAll('<div>').parent().unwrap();
	/* anchor links in menu on subpages (redirect to main page) */
	if (window.location.pathname && window.location.pathname != '/') {
		menu.find('.t-menu__link-item').each(function () {
			var href = $(this).attr('href');
			if (Array.from(href)[0] == '#') {
				$(this).attr('href', '/' + href);
			}
		});
	}
	/* close menu if link clicked */
	menu.find('.t-menu__link-item[href*="#"]').on('click', function () {
		$('.tmenu-mobile').trigger('click');
	});
}

/* блок спойлеров (аккордеонов) */
function spoilers() {
	$('.t668__title').removeClass('t-name').addClass('t-descr');
}

/* открывать external ссылки в новой вкладке */
function externalLinks() {
	$('a').each(function () {
		if (!$(this).is('[href^="htt"]:not([href*="' + window.location.hostname + '"])')) return;
		$(this).attr('target', '_blank');
	});
}