/**
 * инициализация корзины
 */
function cart() {
	var int = setInterval(function () {
		if (!isTovarsFromDBLoaded()) return;
		if (!$('.t706__cartwin-content').length) return;
		if (!cartEnabled[site]) {
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

/**
 * фукнции корзины при инициализации
 */
function cartFunctions() {
	cartIconUponHeader();
	cartOpen();
	cartClose();
	cartInputContainersClasses();
	cartPromocode();
	cartDelivery();
	cartDeliveryZazhopinsk();
	cartZakazchikNoTelegramNick();
	cartZakazchikPoluchatel();
	cartFormValidationTexts();
	cartAdresPoluchatelya();
	cartHerZnaetPoluchatelya();
	cartCountItems();
	cartPlusMinusItems();
	cartDopsReminder();
	cartPreventCloseOnOverlayClick();
	cartErrorsMessageOnClick();
	cartImportantFields();
	cartRequiredFields();
	cartYaCounterId();
	cartSetCookies();
	cartUseCookies();
	cartHideOtkudaUznal();
	cartHtmlEntities();
	cartLovixlube();
	cartSuccess();
}

/**
 * функции корзины при изменении корзины 
 */
function cartDynamicFunctions() {
	cartProductOptionsInOneLine();
	cartOtsluniavit();
	cartOnlyOneTovar();
	cartPayedDeliveryForOnlyDops();
	cartDonat();
	cartPromocodeTovars();
	cartShow();
}

/**
 * открытие попапа товара
 */
function cartOpen() {
	$('body').on('click', '.t706__carticon-wrapper,.t-store__prod-popup__btn', function () {
		setTimeout(function () {
			cartDynamicFunctions();
		}, 250);
	});
}

/**
 * закрытие корзины
 */
function cartClose() {
	$('body').on('click', '.t706__close', function () {
		cartHide();
	});
}

/**
 * показать контент корзины
 */
function cartShow() {
	$('.t706__cartwin-content').fadeIn();
}

/**
 * скрыть контент корзины
 */
function cartHide() {
	$('.t706__cartwin-content').hide();
}

/**
 * классы для контейнеров инпутов формы
 */
function cartInputContainersClasses() {
	$('.t706 .t-input-group').find('input,textarea,select').each(function () {
		var name = $(this).attr('name');
		$(this).parents('.t-input-group').attr('id', name.replace('tildaspec-mask-', ''));
	});
}

/**
 * отслеживание изменения количества товаров в корзине
 */
function cartCountItems() {
	var oldVal;
	setInterval(function () {
		var products = $('.t706__cartwin-products').children();
		if (oldVal == products.length) return;
		cartDynamicFunctions();
		oldVal = products.length;
	}, 1);
}

/**
 * количество штук одного товара
 */
function cartPlusMinusItems() {
	$('.t706').on('click', '.t706__product-plus,.t706__product-minus', function () {
		cartDynamicFunctions();
	});
}

/**
 * напоминалка о допах после товаров
 */
function cartDopsReminder() {
	var data = {
		'2steblya': 'хош добавить <a href="/catalog?tfc_quantity[643365612]=y&tfc_storepartuid[643365612]=%D0%9F%D0%9E%D0%94%D0%90%D0%A0+%D0%9E%D0%A7%D0%9A%D0%98&tfc_div=:::">подар очек</a> к букету? а што насчёт <a href="https://2steblya.ru/catalog?tfc_quantity[643365612]=y&tfc_storepartuid[643365612]=%D0%92%D0%90%D0%97%D0%AB&tfc_div=:::">вазы</a>?',
		'staytrueflowers': ''
	}
	if (site != '2steblya') return;
	$('.t706__cartwin-products').after('<div class="t706__cartwin-dopsReminder">' + data[site] + '</div>');
}

/**
 * доставка
 */
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

	/**
	 * проверяем не наступило ли завтра (раз в минуту)
	 */
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

	/**
	 * смена даты
	 */
	function selectedDate() {
		setInterval(function () {
			if (!dateField.val()) return;
			if (dateField.val() == '____-__-__') return;
			if (dateField.val() == dates['selected-yyyy'] + '-' + (dates['selected-m'] < 10 ? '0' : '') + dates['selected-m'] + '-' + (dates['selected-d'] < 10 ? '0' : '') + dates['selected-d']) return;
			var dateParts = dateField.val().split('-');
			dates['selected-0'] = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
			dates['selected-d'] = parseInt(dateParts[2].replace(/^0/, ''));
			dates['selected-m'] = parseInt(dateParts[1].replace(/^0/, ''));
			dates['selected-yyyy'] = parseInt(dateParts[0]);
		}, 50);
	}

	/** 
	 * календарь 
	 */
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
			addDisclaimer();
			dateToOpen();
			daysToClose();
			specialDates();
			allowToday();
			vitrinaOnlyTwoDays();
			dateField.attr('disabled', true);
			executed = true;
		}, 50);

		/** 
		 * клик на дате в календаре
		 */
		$('body').on('click', '.t706 .t_datepicker__day-cell:not(.t_datepicker__past)', function () {
			setTimeout(function () {
				dateField.change();
			}, 100);
		});

		/** 
		 * календарь должен быть обработан, если сменился месяц или год
		 */
		$('body').on('click', '.t706 .t_datepicker__arrow', function () {
			executed = false;
		});
		$('body').on('change', '.t706 .t_datepicker__header select', function () {
			executed = false;
		});

		/**
		 * обнуляем дату доставки: если корзина закрывается
		 */
		$('body').on('click', '.t706__close-button,.t706__product-del', function () {
			dateField.val('');
		});

		/**
		 * устанавливаем корректную выбранную дату
		 */
		function selectedDay() {
			datePicker.find('.t_datepicker__selected-day').removeClass('t_datepicker__selected-day');
			if (dateField.val()) datePicker.find('[data-picker="' + dates['selected-yyyy'] + '-' + dates['selected-m'] + '-' + dates['selected-d'] + '"]').addClass('t_datepicker__selected-day');
		}

		/**
		 * добавим пояснение по закрытым датам календаря
		 */
		function addDisclaimer() {
			$('.t_datepicker__disclaimer').remove();
			var body = $('.t706 .t_datepicker__body');
			$('<div class="t_datepicker__disclaimer" style="width:' + body.width() + 'px"></div>').insertAfter(body);
		}

		/**
		 * закрываем дни до даты, указанной в товаре (в бд)
		 */
		function dateToOpen() {
			if (isTovarsFromDBEmpty('date_to_open')) return;
			var tovars = $('.t706__product');
			if (!tovars.length) return;
			var dateOpen = dates['tomorrow-0'];
			$.each(tovars, function () {
				var tovar = $(this);
				$.each(tovarsFromDB['date_to_open'], function (id, tovarDate) {
					if (getTovarInCartId(tovar) != id) return;
					tovarDate = new Date(tovarDate);
					tovarDate.setDate(tovarDate.getDate() - 1); //последний закрытый в каледнаре день - это день, предшествующий date_to_open из бд
					if (dateOpen < tovarDate) {
						datesDiff = Math.floor((tovarDate - dates['today-0']) / (1000 * 60 * 60 * 24));
						dateOpen = tovarDate;
						var disclaimerData = {
							'2steblya': 'штоб смастерить ' + getTovarInCartTitle(tovar) + ', нам надо как минимум ' + datesDiff + ' ' + getRussianDaysWord(datesDiff),
							'staytrueflowers': 'чтобы подготовить ' + getTovarInCartTitle(tovar) + ', нам надо как минимум ' + datesDiff + ' ' + getRussianDaysWord(datesDiff)
						}
						$('.t_datepicker__disclaimer').text(disclaimerData[site]);
					}
				});
			});
			if (dateOpen <= dates['tomorrow-0']) return;
			var dateList = [];
			var currentDate = new Date(dates['tomorrow-0']);
			while (currentDate <= dateOpen) {
				var formattedDate = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
				dateList.push(formattedDate);
				currentDate.setDate(currentDate.getDate() + 1);
			}
			disableDates(dateList);
		}

		/**
		 * закрываем количество дней, указанное в товаре (в бд) от сегодняшней
		 */
		function daysToClose() {
			if (isTovarsFromDBEmpty('days_to_close')) return;
			var tovars = $('.t706__product');
			if (!tovars.length) return;
			var daysClosed = 0;
			$.each(tovars, function () {
				var tovar = $(this);
				$.each(tovarsFromDB['days_to_close'], function (id, tovarDays) {
					if (getTovarInCartId(tovar) != id) return;
					if (daysClosed < tovarDays) {
						daysClosed = tovarDays;
						var disclaimerData = {
							'2steblya': 'штоб смастерить ' + getTovarInCartTitle(tovar) + ', нам надо как минимум ' + daysClosed + ' ' + getRussianDaysWord(daysClosed),
							'staytrueflowers': 'чтобы подготовить ' + getTovarInCartTitle(tovar) + ', нам надо как минимум ' + daysClosed + ' ' + getRussianDaysWord(daysClosed)
						}
						$('.t_datepicker__disclaimer').text(disclaimerData[site]);
					}
				});
			});
			if (!daysClosed) return;
			var dateList = [];
			for (var i = 0; i < daysClosed; i++) {
				var futureDate = new Date(dates['today']);
				futureDate.setDate(dates['today'].getDate() + i);
				dateList.push(futureDate.getFullYear() + '-' + (futureDate.getMonth() + 1) + '-' + futureDate.getDate());
			}
			disableDates(dateList);
		}
		/**
		 * закрываем дату в каледнаре
		 */
		function disableDates(dateList) {
			if (!dateList.length) return;
			$.each(dateList, function (i, date) {
				$('.t706 .t_datepicker__day-cell[data-picker="' + date + '"]').addClass('t_datepicker__day-cell--disabled');
			});
		}

		/* перебираем все ячейки календаря в поисках особенных дат */
		function specialDates() {
			$('.t706 .t_datepicker__day-cell').each(function () {
				var cell = $(this);
				var date = cell.attr('data-picker').match(/\d{4}\-(\d{1,})\-(\d{1,})/);
				var faded = (cell.is('.t_datepicker__next-month') || cell.is('.t_datepicker__previous-month') || cell.is('.t_datepicker__day-cell--disabled'));
				$.each(specialDatesList, function (i, specialDate) {
					if (specialDate['d'] == date[2] && specialDate['m'] == date[1]) applySpecialDate(specialDate, faded);
				});
			});
		}

		/**
		 * изменяем ячейки со специальной датой на закглушку
		 */
		function applySpecialDate(specialDate, faded) {
			var allow = false;
			var hasAllowedTovar = false;
			var allowedTovars = [];
			var tovars = $('.t706__product');
			if (!tovars.length) return;
			//первичный цикл по товарам : ищем товары, которые не разрешены
			//если такие товары есть в корзине,
			tovars.each(function () {
				var allowedTovar = isAllowed($(this));
				if (allowedTovar) hasAllowedTovar = true;
				allowedTovars.push(allowedTovar);
			});
			if (!hasAllowedTovar) return;
			//вторичный цикл, если товаров в корзине больше одного
			//проверяем, есть ли помимо разрешенного(ых) еще и допники
			allow = true;
			if (tovars.length > 1) {
				tovars.each(function () {
					var id = getTovarInCartId($(this));
					if (allowedTovars.includes(id)) return;
					if (isDopnik(id)) return;
					allow = false;
				});
			}
			if (allow) return;
			if (!specialDate[site]['minPrice']) return;
			var minPriceK = specialDate[site]['minPrice'].toString().replace(/0{3}$/, 'к');
			var zaglushka = '';
			zaglushka += specialDate[site]['exclude'].length ? 'только товары из праздничной коллекции и ' : '';
			zaglushka += 'товары от ' + minPriceK;
			zaglushka = $('<div class="t_datepicker__specialDate" title="' + zaglushka + '">от<br>' + minPriceK + '</div>');
			if (faded) zaglushka.css('opacity', .4);
			datePicker.find('[data-picker$="-' + specialDate['m'] + '-' + specialDate['d'] + '"]').hide().after(zaglushka);

			//проверяем, находится ли товар в массиве товаров специальной даты
			//пока что этот массив объявляется в globals.js, но надо переработать его в БД
			function isAllowed(tovar) {
				var id = getTovarInCartId(tovar);
				// исключения (exclude)
				if (specialDate[site]['exclude'].includes(id)) return id;
				// цены (minPrice)
				if (getTovarInCartPrice(tovar) >= specialDate[site]['minPrice']) return id;
				return false;
			}
			//проверяем, может ли этот товар быть сопуткой
			function isDopnik(id) {
				if (isTovarsFromDBEmpty('dopnik')) return false;
				return tovarsFromDB['dopnik'].includes(id);
			}
		}

		/**
		 * открываем продажу на сегодня
		 */
		function allowToday() {
			if (isTovarsFromDBEmpty('allowed_today')) return;
			var allow = false;
			var tovars = $('.t706__product');
			if (!tovars.length) return;
			tovars.each(function () {
				allow = [...tovarsFromDB['allowed_today'], ...tovarsFromDB['vitrina']].includes(getTovarInCartId($(this))) ? true : false;
				if (!allow) return false;
			});
			if (todayUrl()) allow = true;
			if (!allow) return;
			//if (dates['today'].getHours() >= 22) return;
			$('.t706 .t_datepicker__today').removeClass('t_datepicker__day-cell--disabled');

			function todayUrl() {
				var cookie = Cookies.get('buytoday');
				if (!cookie) return false;
				var date = new Date();
				var currentDay = String(date.getDate()).padStart(2, '0');
				var currentMonth = String(date.getMonth() + 1).padStart(2, '0');
				var currentYear = date.getFullYear();
				var hash = CryptoJS.MD5(currentDay + '' + currentMonth + '' + currentYear).toString();
				if (cookie != hash) return false;
				return true;
			}
		}
		/**
		 * витрина только на сегодня и завтра
		 */
		function vitrinaOnlyTwoDays() {
			if (isTovarsFromDBEmpty('vitrina')) return;
			var onlyToday = false;
			var tovars = $('.t706__product');
			if (!tovars.length) return;
			tovars.each(function () {
				onlyToday = tovarsFromDB['vitrina'].includes(getTovarInCartId($(this))) ? true : false;
				if (!onlyToday) return false;
			});
			if (!onlyToday) return;
			var data = {
				'2steblya': 'с ветрины только щас или завтро',
				'staytrueflowers': 'с витрины только на сегодня или на завтра'
			};
			$('.t706 .t_datepicker__day-cell').addClass('t_datepicker__day-cell--disabled');
			$('.t706 .t_datepicker__today').add($('.t706 .t_datepicker__today').next()).removeClass('t_datepicker__day-cell--disabled').attr('title', data[site]);
		}
	}

	/**
	 * интервал доставки
	 */
	function deliveryInterval() {
		setInterval(function () {
			$('#dostavka-interval').toggle(dateField.val() ? true : false);
		}, 100);

		/**
		 * если меняется дата или меняется интервал
		 */
		$('body').on('change', intervalField.selector + ',' + dateField.selector, function () {
			for (var i = 0; i < intervalField.length; i++) {
				$(intervalField[i]).attr('disabled', false).parent().css('opacity', 1);
			}
			if (!dates['selected-0']) return;
			if (dates['selected-0'].toDateString() == dates['tomorrow-0'].toDateString()) tomorrowDeliveryInterval();
			if (dates['selected-0'].toDateString() == dates['today-0'].toDateString()) todayDeliveryInterval();
		});

		/**
		 * доставка завтра
		 * утренняя доставка на завтра с вечера (после 18 часов) невозможна
		 */
		function tomorrowDeliveryInterval() {
			if (dates['today'].getHours() >= 18) disableOpt(1);
		}

		/**
		 * доставка сегодня
		 * на сегодня можно заказать только товары из tovarsFromDB['allowed_today']
		 * в этот массив собраны все товары с флагом allowed_today=1 и vitrina=1
		 */
		function todayDeliveryInterval() {
			if (isTovarsFromDBEmpty('allowed_today')) return;
			var hour = dates['today'].getHours();
			var tovars = $('.t706__product');
			var startHour = 6;
			tovars.each(function () {
				var tovarId = getTovarInCartId($(this));
				if (!tovarsFromDB['allowed_today'].includes(tovarId)) return;
				if (isTovarsFromDBEmpty('hours_to_produce')) return;
				if (!Object.keys(tovarsFromDB['hours_to_produce']).includes(tovarId)) return;
				startHour -= tovarsFromDB['hours_to_produce'][tovarId];
			});
			for (i = 1; i <= 4; i++) {
				if (hour >= startHour + 4 * i) disableOpt(i); //за два часа до истечения интервала
			}
			disableOpt(1);
		}
		function disableOpt(i) {
			i--;
			$(intervalField[i]).attr('disabled', true).parent().css('opacity', .3);
			if ($(intervalField[i]).is(':checked')) {
				$(intervalField[i + 1]).trigger('click');
			}
		}
	}

	/**
	 * ссылка на телегу в описании к полю "выбор даты"
	 */
	function telegramLinkInDateFieldDescription() {
		var data = {
			'2steblya': ['телегу', 'https://t.me/dva_steblya'],
			'staytrueflowers': ['телеграм', 'https://t.me/staytrueflowers']
		}
		var descr = $('#dostavka-date .t-input-subtitle');
		var html = descr.text().replace(data[site][0], '<a href="' + data[site][1] + '">' + data[site][0] + '</a>');
		descr.html(html);
	}
}
/**
 * обрабатываем галочку для доставки в зажопинск
 */
function cartDeliveryZazhopinsk() {
	$('#adres-zazhopinsk').wrap('<div id="adres-zazhopinsk__cont"></div>');
	$('#adres-zazhopinsk input').on('change', function () {
		deliveryPriceInterval(!$(this).is(':checked')); //для зажопинцев доставка беслпатно на сайте (отдельно в переписке будет обозначена менеджером)
	});
}

/**
 * отслюнявить
 */
function cartOtsluniavit() {
	if (site != '2steblya') return;
	$('.t706__cartwin-prodamount-label').text('нужно отслюнявить ');
}

/**
 * донат 
 */
function cartDonat() {
	if (site != '2steblya') return;
	$('.t706__cartwin-content').removeClass('donat');
	var tovars = $('.t706__product');
	if (!tovars.length) return;
	if (tovars.length > 1) return;
	var data = {
		'2steblya': 857613433221,
		'staytrueflowers': ''
	}
	if (getTovarInCartId(tovars.eq(0)) != data[site]) return;
	$('.t706__cartwin-content').addClass('donat');
	cartIncompleteRemoveRequired();
	cartDonatComment();
	cartDonatDate();

	function cartDonatComment() {
		$('#florist-comment > label').text('восторги и благодарности');
		$('[name="florist-comment"]').attr('placeholder', 'мы готовы впитывать');
	}
	function cartDonatDate() {
		if ($('[name="dostavka-date"]').val()) return;
		var today = new Date();
		var day = {
			d: today.getDate() + 1,
			m: today.getMonth() + 1,
			y: today.getFullYear()
		};
		if (day['d'] < 10) day['d'] = '0' + day['d'];
		if (day['m'] < 10) day['m'] = '0' + day['m'];
		$('[name="dostavka-date"]').val(day['y'] + '-' + day['m'] + '-' + day['d']);
	}
}

/**
 * если у заказчика нет телеграма
 */
function cartZakazchikNoTelegramNick() {
	var input = $('[name="messenger-zakazchika"]');
	var a = $('<div id="messenger-zakazchika-no-telegram">нет никнейма</div>');
	a.insertBefore(input);
	a.on('click', a.selector, function () {
		input.val($('[name="name-zakazchika"]').val() || 'нет никнейма');
	});
}

/**
 * если заказчик - это получатель
 */
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

/**
 * скрыть или показать все поля (.unimportant)
 */
function cartImportantFields() {
	if (cartExpanded[site]) return;
	var data = {
		'2steblya': [
			'чтобы не мурыжить тебя в телеге, лучше',
			'заполнить всю инфу сразу'
		],
		'staytrueflowers': [
			'чтобы нам не пришлось потревожить вас в телеграме, лучше',
			'указать дополнительные данные'
		]
	}
	var lastImportant = $('#dostavka-interval');
	lastImportant.nextAll().not(':last').hide().addClass('unimportantField');
	var parts = [
		'<div class="t-input-group t-input-group_cb" id="unimportantTrigger">',
		'<div class="t-input-title t-descr t-descr_md">' + data[site][0] + '</div>',
		'<label class="t-checkbox__control t-text t-text_xs" style="padding:10px 0">',
		'<input type="checkbox" class="t-checkbox js-tilda-rule">',
		'<div class="t-checkbox__indicator"></div>',
		data[site][1],
		'</label>',
		'</div>'
	];
	var btn = $(parts.join(''));
	btn.insertAfter(lastImportant);
	btn.on('change', 'input', function () {
		cartIncompleteRemoveRequired(); // удаляем атрибут "обязательное поле" у поля cartIncomplete 
		btn.nextAll().not(':last').toggle($(this).is(':checked'));
		$('#unimportantTrigger').remove();
	});
}

function cartHtmlEntities() {
	var fields = $('.t706 .unimportantField textarea, .t706 .unimportantField input');
	fields.on('blur', function () {
		$(this).val($(this).val().replaceAll('@', '&#64;'));
	});
}

/**
 * добавляем ссылку на страницу в поле Lovixlube
 */
function cartLovixlube() {
	$('#lovixlube[data-input-lid="1688065007506"] .t-input-block').append('<a href="/14feb" />');
}

/**
 * платная доставка, если в корзине только эти товары
 */
function cartPayedDeliveryForOnlyDops() {
	if (isTovarsFromDBEmpty('dopnik')) return;
	var onlyDops = false;
	var tovars = $('.t706__product');
	if (!tovars.length) return;
	tovars.each(function () {
		onlyDops = tovarsFromDB['dopnik'].includes(getTovarInCartId($(this))) ? true : false;
		if (!onlyDops) return false;
	});
	if (!onlyDops) {
		$('#adres-zazhopinsk input').prop('checked', false);
		$('#adres-zazhopinsk').hide();
		deliveryPriceInterval(false);
		return;
	}
	$('#adres-zazhopinsk').show();
	deliveryPriceInterval(true);
}
/**
 * платный/бесплатный интервад доставки
 * последний вариант игнорируется, так как он всегда платный (с 22 до 8)
 */
function deliveryPriceInterval(action) {
	//action - true/false (increase/decrease)
	$('#dostavka-interval label:not(:last) input').attr('data-delivery-price', action ? $('.t706 [name="dostavka-price"]').val() : '');
	var selectedInterval = $('input[data-delivery-price]:checked');
	$('input[data-delivery-price]:last').trigger('click');
	selectedInterval.trigger('click');
}

/**
 * поля обязательные если cartExpanded
 */
function cartRequiredFields() {
	if (!cartExpanded[site]) return;
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

/**
 * тексты валидационных ошибок корзины
 */
function cartFormValidationTexts() {
	var texts = {
		'2steblya': [
			'ну не-е-е-е...',                       	//name
			'скинь телефончик, а?',                 	//phone
			//'судью на мыло. но на какое?',            //email
			'а куда фотку букета выслать?',         	//telegram
			'ты календарь... переверни...',         	//delivery date
			'а вдруг разбудим?',                     	//delivery interval
			//'применяй или удаляй'						//promocode
		],
		'staytrueflowers': [
			'пожалуйста, укажите ваше имя',				//name
			'пожалуйста, укажите ваш номер телефона',	//phone
			'пожалуйста, укажите ваш ник в телеграм',	//telegram
			'пожалуйста, укажите дату доставки',		//delivery date
			'пожалуйста, укажите интервал доставки'		//delivery interval 
		]
	}
	formValidationTexts($('.t706__orderform'), texts[site]);
}

/**
 * адрес получателя
 */
function cartAdresPoluchatelya() {
	var adresProps = ['city', 'street', 'dom', 'kvartira', 'korpus', 'stroenie', 'podezd', 'etazh', 'domofon'];
	var adresInputs = {};
	var adresSmall = [];
	collectAdresFields();
	wrapAdresFields();

	/**
	 * собираем все поля адреса в массив
	 */
	function collectAdresFields() {
		$.each(adresProps, function (i, val) {
			adresInputs[val] = $('.t706 [name="adres-poluchatelya-' + val + '"]');
			if (['city', 'street'].includes(val)) return;
			adresSmall.push('#adres-poluchatelya-' + val);
		});
	}

	/**
	 * оборачиваем поля адреса в контейнер
	 */
	function wrapAdresFields() {
		$(adresSmall.join(',')).wrapAll('<div id="adresDataSmall" />').wrapAll('<div />'); //разместим покомпактее
		$('#adres-poluchatelya-street,#adresDataSmall,#courier-comment').wrapAll('<div />').wrapAll('<div id="adresData" />'); //обернем весь адрес в див 
	}
}

/**
 * заказчик не знает адрес (хер знает получателя)
 */
function cartHerZnaetPoluchatelya() {
	var herZnaet = $('.t706 [name="uznat-adres-u-poluchatelya"]');
	if (cartExpanded[site]) {
		$('#uznat-adres-u-poluchatelya').remove();
		return;
	}
	herZnaet.on('change', function () {
		$('#adresData').toggle(!$(this).is(':checked'));
		$('.t706 [name="courier-comment"]').val('').trigger('change');
		$('.t706 .adresInput').each(function () {
			$(this).val('');
		});
	});
}

/**
 * опции товаров в одну строку
 */
function cartProductOptionsInOneLine() {
	var props = $('.t706__product-title__option div');
	props.each(function () {
		var text = $(this).text().split(/\s*:\s*/);
		switch (text[0]) {
			case 'накинуть косарь':
			case 'накинуть пятихатку':
			case 'накинуть сотен':
			case 'эвкалипт ннада':
			case 'добавить 1000':
			case 'добавить 500':
			case 'добавить 100':
				$(this).hide();
				break;
			case 'выебри карточку':
			case 'карточка':
				text[1] = text[1].replace('со своим', 'с вашим');
				break;
		}
		$(this).text(text[1]);
	});
}

/**
 * не закрывать корзину при клике на пустое пространство по бокам
 */
function cartPreventCloseOnOverlayClick() {
	var e = $('.t706__cartwin');
	var overlay = $('<div class="t706__cartwin-overlay"></div>');
	e.append(overlay);
	e.on('scroll', function () {
		overlay.css('top', $(this).scrollTop() + 'px');
	});
}

/**
 * сообщение об ошибке (с расшифровкой) в кнопке оформления заказа
 */
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
			if (!errorFieldsTitles.length && errorFields.length == 1 && !cartExpanded[site]) { // cart Incomplete
				cartFormIncomplete();
				btn.text(btnText);
			} else {
				var errorTitle = {
					'2steblya': 'ЧТО-ТО НЕ ТОГО. ПЕРЕПРОВЕРЬ!',
					'staytrueflowers': 'ФОРМА СОДЕРЖИТ ОШИБКИ'
				}
				var errorTime;
				if (cartExpanded[site]) {
					errorTime = 3000;
					btn.text(errorTitle[site]);
				} else {
					errorTime = 6000;
					btn.html(errorTitle[site] + '<br><span class="errorsDescription">' + errorFieldsTitles.join(' / ') + '</span>');
				}
				tim2 = setTimeout(function () {
					btn.text(btnText);
				}, errorTime);
			}
		}, 400);
	});
}

/**
 * всплывашка, если форма не заполнена до конца
 */
function cartFormIncomplete() {
	// удаляем атрибут "обязательное поле"
	cartIncompleteRemoveRequired();
	// открываем попап
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

/**
 * удаляем атрибут "обязательное поле" у поля cartIncomplete
 */
function cartIncompleteRemoveRequired() {
	var data = {
		'2steblya': '1675967313188',
		'staytrueflowers': ''
	}
	$('.t706 [data-input-lid="' + data[site] + '"] input').removeAttr('data-tilda-req');
}

/**
 * янедкс метрика cliendId
 */
function cartYaCounterId() {
	setTimeout(function () {
		var counter;
		switch (site) {
			case '2steblya':
				if (typeof yaCounter89315640 !== 'undefined') counter = yaCounter89315640;
				break;
			case 'staytrueflowers':
				if (typeof yaCounter85909890 !== 'undefined') counter = yaCounter85909890;
				break;
		}
		if (!counter) return;
		$('.t706 [name="ya-client-id"]').val(counter.getClientID());
	}, 3000);
}

/**
 * на средних экранах иконка корзины не наезжает на меню
 */
function cartIconUponHeader() {
	if (site != '2steblya') return;
	if (document.location.href.indexOf('tproduct') > -1) return;
	if ($(window).width() > 980 && $(window).width() < 1370) {
		var cartIcon = $('.t706__carticon');
		var headerHeight = 110;
		setInterval(function () {
			cartIcon.toggleClass('uponHeader', $(window).scrollTop() <= headerHeight);
		}, 50);
	}
}

/**
 * убираем возможность менять количество в корзине для товаров с витрины
 */
function cartOnlyOneTovar() {
	if (!tovarsFromDB['vitrina'].length) return;
	var tovars = $('.t706__product');
	if (!tovars.length) return;
	tovars.each(function () {
		var id = getTovarInCartId($(this));
		if (!isTovarsFromDBEmpty('vitrina') && !tovarsFromDB['vitrina'].includes(id)) return;
		if (id == nitakoi[site]) return; //НИТАКОЙ
		$(this).children('.t706__product-plusminus').empty();
	});
}

/**
 * промокод
 */
var promocodeApplied = [];
function cartPromocodeTovars() {
	if (promocodeType[site] == 'all') {
		$('#promocode > div').show();
	} else {
		/**
		 * прмокоды только на отдельные товары (promocodeType[site] == 'individual') 
		 */
		var exists = false;
		var tovars = $('.t706__product');
		tovars.each(function () {
			if (!promocodeTovars[site].includes(getTovarInCartId($(this)))) return;
			exists = true;
			return false;
		});
		$('#promocode > div').toggle(exists);
		/*if (!promocodeApplied.length) return;
		if (promocodeApplied.length && exists) {
			var price = $('.t706__cartwin-prodamount-wrap .t706__cartwin-prodamount-price');
			var currentPrice = parseInt(price.text().replace(' ', ''));
			price.text((currentPrice - promocodeApplied[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
			return;
		}*/
	}
}
function cartPromocode() {
	var wrapper = $('.t-inputpromocode__wrapper');
	wrapper.parents('.t-input-group').wrap('<div id="promocode"></div>');

	/**
	 * для Стеблей при клике на кнопку заказа подменяем текст ошибки промокода
	 */
	$('.t-form__submit button').on('click', function () {
		setTimeout(function () {
			if (wrapper.find('.t-text').length) return;
			if (wrapper.siblings('.t-input-error').length && site == '2steblya') {
				if (!wrapper.find('input').val()) return;
				wrapper.siblings('.t-input-error').text('применяй или удаляй').show();
			}
		}, 500);
	});

	/**
	 * при клике на кнопку промокода меняем общую сумму заказа с учетом суммы промокода
	 * для Стеблей менем текст применения промокода 
	 */
	$('.t706 .t-inputpromocode__btn').on('click', function () {
		setTimeout(function () {
			if ($('.t706 .t-inputpromocode__btn').length) return;
			/*var price = $('.t706__cartwin-prodamount-wrap .t706__cartwin-prodamount-price');
			var currentPrice = parseInt(price.text().replace(' ', ''));
			var skidka = parseInt(wrapper.find('.t706__cartwin-prodamount-price').text());
			price.text((currentPrice - skidka).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '));*/
			if (site == '2steblya') {
				wrapper.find('.t-text').addClass('showed').html($('.t-inputpromocode__wrapper .t-text').html().replace('Ваша', 'твоя').replace('Промокод', 'промокод').replace('.', ''));
			}
			//promocodeApplied.push(skidka);
		}, 500);
	});
}

/**
 * пишем в куку данные заказчика и адрес
 */
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

/**
 * заполняем поля данными из куки заказчика и адрес
 */
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
				$('#' + fields[i] + ' input').val(cookieValues[i]).change();
			});
		});
	}
}

/**
 * скрываем поле "откуда узнал", если не в первый раз
 */
function cartHideOtkudaUznal() {
	/**
	 * неоптимально, так как форму могли заполнить, но заказ не сделать
	 * по уму, надо проверять в срм количество заказов
	 */
	var cookie = Cookies.get('zakazchik');
	if (!cookie) return;
	$('#otkuda-uznal-o-nas').remove();
}

/**
 * добавляем текст в js-succesbox
 * этот текст виден только тем, у кого не сработала Юкасса
 */
function cartSuccess() {
	var succesbox = $('.t706 .js-successbox');
	var data = {
		'2steblya': 'заказ оформлен успешно, но похоже Юкасса тупит и не хочет, штоб твои денюжки потекли к нам рекой<br><br>напиши нам в <a href="https://t.me/dva_steblya">телегу</a>, расскажи, что вот такая оказия случилась, и мы скинем тебе новую нормальную ссыклу на оплат очку',
		'staytrueflowers': 'Ваш заказ оформлен, но мы не смогли перенаправить вас на оплату заказа в Юкассе.<br><br>Напишите нам в <a href="https://t.me/staytrueflowers">телеграм</a>, и мы вышлем вам новую рабочую ссылку на оплату.'
	}
	succesbox.addClass('hidden').attr('data-success-message', data[site]);
	$('.t706 form').on('tildaform:aftersuccess', function () {
		setTimeout(function () {
			succesbox.removeClass('hidden');
		}, 3000);
	});
}

/**
 * получаем айдишник товара в корзине
 */
function getTovarInCartId(tovar) {
	return parseInt(tovar.find('.t706__product-title a').attr('href').match(/\d{12}/));
}

/**
 * получаем цену товара в корзине
 */
function getTovarInCartPrice(tovar) {
	return parseInt(tovar.find('.t706__cartwin-prodamount-price').text().replace(/[^\d]/, ''));
}

/**
 * получаем название товара в корзине
 */
function getTovarInCartTitle(tovar) {
	return tovar.find('.t706__product-title a').text();
}