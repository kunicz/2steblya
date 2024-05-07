/**
 * инициализация товаров и каталогов
 */
function product() {
	var int = setInterval(function () {
		if (!tovarsFromDBReady) return;
		if (window.location.pathname.includes('/tproduct/')) {
			/* страница продукта /tproduct/... */
			productLogoInHeader();
			var tovar = $('.js-store-product:not(.loaded)');
			if (!tovar) return;
			if (!$('.t-slds__item-loaded').length) return;
			setTimeout(function () {
				productTovarFunctions(tovar);
			}, 1000);
			clearInterval(int);
		} else {
			/* если на странице есть каталог */
			var catalogs = $('.js-store');
			if (!catalogs.length) return;
			catalogs.each(function () {
				var catalog = $(this);
				productCatalogFunctions(catalog);
				//иногда по непонятным причинам не отрабатывает мутатор при загрузке каталогке, из-за чего товары находятся визуально в чечной загрузке (скрыты с прелоадером)
				//все-таки принудительно надо пробежаться по товарам, и накатить на них все наши функции
				setTimeout(function () {
					$.each(catalogs, function () {
						var catalog = $(this);
						var tovars = catalog.find('.js-store-grid-cont .js-product');
						if (!tovars.length) return;
						tovars.each(function () {
							productCatalogTovarFunctions($(this), catalog);
						});
						window.dispatchEvent(new Event('resize'));
					});
				}, 1000);
			});
			clearInterval(int);
		}
	}, 50);
}

/**
 * функции для товаров в попапе и на отдельной странице
 */
function productTovarFunctions(tovar) {
	productReplaceCardImgWithText(tovar);
	productVyebriKartochku(tovar);
	productOptionsReadMore(tovar);
	productHtmlInDescription(tovar);
	productHideEmptyText(tovar);
	productAddAdditionalText(tovar);
	productFlowersSeason(tovar);
	productFlowersMono(tovar);
	productPodpiska(tovar);
	productCharcs(tovar);
	productBlackFriday(tovar);
	productSoldOut(tovar);
	//productBomjPlashka(tovar);
	productButton(tovar);
	productOnPhoto(tovar);
	productCartDisabled(tovar);
	productHideDisabledFormatOption(tovar);
	productShow(tovar);
}

/**
 * функции для товаров в каталоге
 */
function productCatalogTovarFunctions(tovar, catalog) {
	productPrices(tovar, catalog);
	productReplaceCardImgWithText(tovar, catalog);
	productBlackFriday(tovar);
	productSoldOut(tovar, catalog);
	productPlashka(tovar);
	productBomjPlashka(tovar, catalog);
	productHideVitrinaDuplicate(tovar, catalog);
	productsTotHide(tovar);
	productShow(tovar);
}

/**
 * функции для каталога 
 */
function productCatalogFunctions(catalog) {
	productPopupOpen(catalog);
	productPopupClose();
	productCatalogMenu(catalog);
	productCatalogMutationObserver(catalog);
}

/**
 * определяем попап или страница
 */
function productIsPopup() {
	if ($('#allrecords > *').length <= 4) return false;
	return true;
}

/**
 * открытие попапа товара
 */
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

/**
 * закрытие попапа
 */
function productPopupClose() {
	$('body').on('click', '.t-popup__close,.t-store__prod-popup__close-txt-wr,.t-store__prod-popup__btn', function () {
		var tovar = $(this).parents('.t-popup').find('.js-product');
		productHide(tovar);
	});
}

/**
 * проявляем товар из невидимости
 */
function productShow(tovar) {
	tovar.addClass('loaded');
	tovar.children().animate({ opacity: 1 }, 250);
}

/**
 * скрываем товар
 */
function productHide(tovar) {
	tovar.removeClass('loaded multiplePrices bomj noCard');
	setTimeout(function () {
		tovar.children().css('opacity', 0);
	}, 300);
}

/**
 * меню каталога
 */
function productCatalogMenu(catalog) {
	setTimeout(function () {
		var catalogMenuItems = catalog.find('.js-store-parts-switcher');
		if (!catalogMenuItems.length) return;
		//addLinks();
		//renameAll();
		//linkOnClick();

		/**
		 * делаем кликабельные ссылки
		 */
		function addLinks() {
			var catalogId = catalogMenuItems.parents('.uc-catalog').attr('id').replace('rec');
			catalogMenuItems.each(function () {
				$(this).contents().wrap('<a href="/?tfc_storepartuid[' + catalogId + ']=' + $(this).text() + '&tfc_div=:::#shop"></a>');
			});
		}

		/**
		 * переименовываем пункт "все"
		 */
		function renameAll() {
			var data = {
				'2steblya': 'ALL',
				'gvozdisco': 'ВСЕ',
				'staytrueflowers': 'ВСЕ'
			}
			$('.t-store__parts-switch-btn-all').text(data[site]);
		}

		/**
		 * меняем адресную строку и пишем историю переходов при клике на пункт меню каталога
		 */
		function linkOnClick() {
			catalogMenuItems.on('click', function (e) {
				e.preventDefault();
				var href = window.location.href;
				href = href.slice(0, href.indexOf('#'));
				window.history.replaceState(null, '', href + '#shop');
			});
		}
	}, 1000);
}

/**
 * обновление каталога
 */
function productCatalogMutationObserver(catalog) {
	var observer = new MutationObserver(observerCallback);
	observer.observe(catalog.children('.js-store-grid-cont').get(0), { attributes: false, childList: true, subtree: false });
	function observerCallback(mutationList, observer) {
		if (!mutationList.length) return;
		var tovars = catalog.find('.js-store-grid-cont .js-product:not(.loaded)');
		if (!tovars.length) return;
		setTimeout(function () {
			tovars.each(function () {
				productCatalogTovarFunctions($(this), catalog);
			});
			window.dispatchEvent(new Event('resize'));

			//каталог с фильтром
			if (typeof reorderTovarsByCardWrapper == 'function') reorderTovarsByCardWrapper();
		}, 1000);
	}
}

/**
 * скрываем товары из витрины в других каталогах
 */
function productHideVitrinaDuplicate(tovar, catalog) {
	if (isVitrina(catalog)) return;
	$.each(tovarsFromDB['vitrina'], function (i, id) {
		if (getTovarId(tovar) != id) return;
		tovar.hide();
	});
}

/**
 * цена товара
 */
function productPrices(tovar, catalog) {
	multiplePrices();
	if (isVitrina(catalog)) return;
	minPriceCheck();

	/**
	 * добавляем товарам класс, который отвечает за "цена от"
	 */
	function multiplePrices() {
		if (tovarsFromDB['fixed_price'].includes(getTovarId(tovar))) return; //если товар в бд помечен как товар с фиксированной ценой
		if (tovar.find('[data-edition-option-id="' + productFormat[site] + '"] select option').length < 2) return; //если формат остался только один, например, остальное раскупили
		//также класс не применяется к тем товарам, у которых изначально в тильде нет ценовых вариантов
		tovar.addClass('multiplePrices');
	}

	/**
	 * обрабатываем товар в случае, если его цена меньше минимально дозволенной
	 */
	function minPriceCheck() {
		var edited = false;
		$.each(productPriceLevels[site], function (price, titles) {
			if (price >= minPrice[site]) return;
			edited = true;
			tovar.removeClass('bomj');
			$.each(titles, function (j, title) {
				tovar.find('[data-edition-option-id="' + productFormat[site] + '"] select option[value="' + title + '"]').remove();
			});
		});
		if (!edited) return;
		var optLength = tovar.find('[data-edition-option-id="' + productFormat[site] + '"] select option').length;
		if (!optLength) tovar.hide();
		if (optLength == 1) tovar.removeClass('multiplePrices');
		if (getTovarPrice(tovar) < minPrice[site]) tovar.find('.js-product-price').text(minPrice[site].toString().replace(/(\d{3})$/, ' $1'));
	}
}

/**
 * если корзина отключена
 */
function productCartDisabled(tovar) {
	if (cartEnabled[site]) return;
	var data = {
		'2steblya': [
			'а как купить?',
			'сорян, мы зашиваемся и пока прием заказов заказан. но если у вас очень важное дело, то напишите нам в <a href="https://t.me/dva_steblya" target="blank">телегу</a>, че-нить придумаем<'
		],
		'gvozdisco': [
			'А как купить?',
			'К сожалению, в данный момент прием заказов закрыт. но ты всегда можешь <a href="https://t.me/gvozdisco">написать нам</a>, и мы обязательно постараемся тебе помочь.'
		],
		'staytrueflowers': [
			'А как купить?',
			'К сожалению, в данный момент прием заказов закрыт. Но вы всегда можете <a href="https://t.me/staytrueflowers">написать нам</a>, и мы обязательно постараемся вам помочь.'
		]
	}
	var cartDisabledParts = [
		'<p class="t-btn">' + data[site][0] + '</p>',
		'<p class="t-text">' + data[site][1] + '/p>'
	];
	var cartDisabled = $('<div class="cartDisabled t-text"></div>');
	cartDisabled.html(cartDisabledParts.join(''));
	tovar.find('.js-product-controls-wrapper').hide().after(cartDisabled);
	tovar.find('.js-store-buttons-wrapper').remove();
}

/** 
 * переносим плашку в первый слайд
 */
function productPlashka(tovar) {
	var plashka = tovar.find('.t-store__card__mark-wrapper');
	if (!plashka.length) {
		var text = [];
		var data = {
			'random_sostav': {
				'2steblya': 'букет, чтоб не париться с выбором',
				'staytruefloers': 'состав на вкус флориста'
			},
			'select_gamma': {
				'2steblya': 'можно выбрать гамму',
				'staytruefloers': 'можно выбрать гамму'
			},
			'select_color': {
				'2steblya': 'можно выбрать цвет',
				'staytruefloers': 'можно выбрать цвет'
			},
		}
		for (var key in data) {
			if (!data.hasOwnProperty(key)) continue;
			if (!tovarsFromDB[key].includes(getTovarId(tovar))) continue;
			text.push(data[key][site]);
		}
		if (text.length) plashka = $('<div class="t-store__card__mark-wrapper"><div class="t-store__card__mark">' + text.join(', ') + '</div></div>');
	}
	if (!plashka.length) return;
	plashka.appendTo(tovar.find('.t-store__card__bgimg'));
}

/**
 * бомжетность
 */
function productBomjPlashka(tovar, catalog) {
	if (site != '2steblya') return;
	if (getTovarPrice(tovar) > Object.keys(productPriceLevels[site])[0]) return;
	if (tovarsFromDB[888].includes(getTovarId(tovar))) return;
	tovar.addClass('bomj');
	var data = {
		'2steblya': 'бомжетный',
		'gvozdisco': 'бюджетный',
		'staytrueflowers': 'бюджетный'
	}
	var plashka = $('<div class="bomjPlashka">' + data[site] + '</div>');
	tovar.find(catalog ? '.js-product-img' : '.t-slds').append(plashka);
	if (catalog) return;
	setInterval(function () {
		plashka.toggle(!$('.t-slds__item[data-slide-index="2"]').is('.t-slds__item_active')); //скрываем бомж плашку на слайдах с карточкой
	}, 100);
}

/**
 * кнопка "купить"
 */
function productButton(tovar) {
	if (!tovarsFromDB[1111].includes(getTovarId(tovar))) return;
	$('.js-store-prod-popup-buy-btn-txt').text('ЗАДОНАТИТЬ!');
}

/**
 * характеристика "на фото" реально на фото
 */
function productOnPhoto(tovar) {
	if (productIsPopup()) {
		popup();
	} else {
		page();
	}
	function popup() {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", tovar.attr('data-product-url'), false);
		xmlhttp.send();
		var parser = new DOMParser();
		apply($(parser.parseFromString(xmlhttp.responseText, "text/html")).find('.t-rec:first > script'));
	}
	function page() {
		apply(tovar.parents('.t-rec').children('script'));
	}
	function apply(script) {
		var product = script.text().match(/var product = (.*)\n/);
		if (!product) return;
		if (product.length < 2) return;
		product = JSON.parse(product[1].slice(0, -1));
		if (product.editions.length < 2) return;
		var sizes = [];
		var photos = [];
		for (var i = 0; i < product.editions.length; i++) {
			if (!product.editions[i].img) continue;
			const match = product.editions[i][productFormat[site]].match(/(.+?)\sх\d+\sдоставки/);
			const m = match ? match[1] : product.editions[i][productFormat[site]];
			photos.push([m, product.editions[i].img]);
			sizes.push(product.editions[i][productFormat[site]]);
		}
		sizes = sizes.map(str => {
			var match = str.match(/(.+?)\sх\d+\sдоставки/);
			return match ? match[1] : str;
		});
		sizes = [...new Set(sizes)];
		if (!photos.length) return;
		var i = 0;
		tovar.find('.t-slds__main .t-slds__bgimg').each(function (j, e) {
			if (j < 2) return;
			if (typeof photos[i + 1] !== 'undefined') {
				if ($(this).attr('data-original') == photos[i + 1][1]) i++;
			}
			$(this).append('<div class="photoPlashka">' + photos[i][0] + '</div>');
		});
		if (site == '2steblya') {
			tovar.find('.t-typography__characteristics').each(function () {
				if (!$(this).find('b').text() != 'на фото') return;
				$(this).hide();
				return false;
			});
			var charc = $('<p class="t-typography__characteristics js-store-prod-charcs costumized"></p>');
			charc.html('<b>на фото</b> ' + sizes.join(', ')).prependTo(tovar.find('.js-store-prod-all-charcs'));
		}
	}
}

/**
 * если в товаре есть сезонные цветы
 */
function productFlowersSeason(tovar) {
	var flowers = Object.keys(flowersSeasons).join('|');
	var block = tovar.find('.js-store-prod-all-text');
	tovar.find('.js-store-prod-charcs').each(function () {
		if (!$(this).text().startsWith('состав')) return;
		var regex = new RegExp(`состав: с (${flowers})`);
		var flower = $(this).text().match(regex);
		if (!flower) return;
		if (flower.length < 2) return;
		var seasonMsg = {
			'2steblya': {
				'пион': 'если сезон пионов (' + flowersSeasons['пион'] + ') закончилса, то мы поставим вместо их кросивые пивоно видные розы',
				'георгина': 'если сезон георгин (' + flowersSeasons['георгина'] + ') закончилса, то мы поставим вместо их кросивые розы'
			},
			'gvozdisco': {
				'пион': '',
				'георгина': ''
			},
			'staytrueflowers': {
				'пион': '',
				'георгина': ''
			}
		}
		if (!seasonMsg[site][flower[1]]) return;
		var msg = '<br><br><strong>' + seasonMsg[site][flower[1]] + '</strong>';
		block.html(block.html() + msg);
	});
}

/**
 * текст для подписок
 */
function productPodpiska(tovar) {
	if (!tovarsFromDB['666'].includes(getTovarId(tovar))) return;
	//порядок торговых предложений
	var select = tovar.find('.js-product-edition-option[data-edition-option-id="фор мат"] select');
	var options = select.find('option');
	$(options).each(function (index) {
		// Индекс текущей опции в новом порядке
		var newIndex = [1, 0, 3, 2, 5, 4][index];
		// Ищем опцию с соответствующим значением и перемещаем её в конец списка
		$(this).insertAfter(select.children('option:eq(' + newIndex + ')'));
	});
	select.children('option:first').prop('selected', true);
	var changeEvent = new Event('change');
	select.get(0).dispatchEvent(changeEvent);

	//текст-описание
	$data = {
		'2steblya': 'подпис очка - это цветочеки для дома. каждую недельку разные! можно зоказать себе, можно в подарок<br><br>букептеки могут приезджать с тематической карт очкой, а могут просто сами по себе красивые без всего<br><br>карточки:<ul><li>от тайнова поклонника - будут любовные записки</li><li>мем недели - картинка для увеселения</li><li>без карточки - просто цветочки пришлем</li><li>без айдентики - даже о себе нигде не напишем</li></ul>',
		'gvozdisco': '',
		'staytrueflowers': ''
	}
	var block = tovar.find('.js-store-prod-all-text');
	block.html(block.html() + '<br><br>' + $data[site]);
}

/**
 * текст для моно букетов
 */
function productFlowersMono(tovar) {
	if (!tovarsFromDB['mono'].includes(getTovarId(tovar))) return;
	$data = {
		'2steblya': 'цветочики вкуснее с эвкалиптом. мы рекомен дуем:<br>1 эвкалипт к букетусикам<br>2 эвкалипта к букетикам и букетам<br>3 эвкалипта к букетищам и прочим корзинам',
		'gvozdisco': 'цветочки лучше с эвкалиптом. мы рекомен дуем:<br>1 эвкалипт к букетусикам<br>2 эвкалипта к букетикам и букетам<br>3 эвкалипта к букетищам и прочим корзинам',
		'staytrueflowers': ''
	}
	var block = tovar.find('.js-store-prod-all-text');
	block.html(block.html() + '<br><br>' + $data[site]);
}

/**
 * скрываем товары, которые должны быть скрыты
 */
function productsTotHide(tovar) {
	if (!tovarsFromDB['hidden'].includes(getTovarId(tovar))) return;
	tovar.prev('.t-clear').addBack().hide();
}

/**
 * заменяем картинку "наша карточка" на текстовый аналог
 */
function productReplaceCardImgWithText(tovar, catalog) {
	if (tovarsFromDB['card_type_no'].includes(getTovarId(tovar))) {
		tovar.addClass('noCard');
		return;
	}
	if (!tovarsFromDB['card_type_text'].includes(getTovarId(tovar))) {
		removeSelect(catalog);
		return;
	}
	var data = {
		'2steblya': '<p>«здесь может быть ваша реклама»</p><p>или какой хочешь текст,</p><p>решать тебе</p>',
		'gvozdisco': '<p>здесь мы разместим твое пожелание или поздравление</p>',
		'staytrueflowers': '<p>здесь мы разместим ваше пожелание или поздравление</p>'
	}
	var card = tovar.find(catalog ? '.t-store__card__bgimg_second' : '.t-slds__item[data-slide-index="2"]');
	var cardContent = $('<div class="card__container t-text"></div>');
	var cardParts = [
		'<p class="card__buket">этот букет называется</p>',
		'<div class="card__title">' + getTovarTitle(tovar) + '</div>',
		'<div class="card__text">' + getTovarCardText(tovar) + '</div>',
	]
	if (site == '2steblya') cardParts.push('<div class="card__your-text">' + data[site] + '</div>');
	cardContent.append(cardParts.join(''));
	card.addClass('card').html(cardContent);
	if (!catalog) {
		setTimeout(function () {
			card.height(card.width());
		}, 500);
	}
	removeSelect(catalog);

	/**
	 * удаляем селект "выебри карточку", чтоб он не улетал в срм
	 */
	function removeSelect(catalog) {
		if (catalog) return;
		tovar.find('.js-product-option:last').remove();
	}
}

/**
 * скрываем текст с пустым #nbsp;
 */
function productHideEmptyText(tovar) {
	var e = tovar.find('.js-store-prod-all-text');
	if (!e.text().trim()) e.hide();
}

/**
 * поле: выебри карточку
 */
function productVyebriKartochku(tovar) {
	var selectOptions = ['с нашей карточкой', 'со своим текстом', 'без карточки', 'без айдентики'];
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

/**
 * добавить дополнительный текст под описание товара
 */
function productAddAdditionalText(tovar) {
	var noTextProducts = {
		'2steblya': [
			857613433221 // донатошная
		],
		'gvozdisco': [],
		'staytrueflowers': []
	}
	if (noTextProducts[site].includes(getTovarId(tovar))) return;
	var data = {
		'2steblya': 'к любому букету прилагается его состав и чудо-порошок для продления жизни цветов<br>к букетам с айдентикой также прилагается карт очка и сосабельный петушок',
		'gvozdisco': 'к любому букету прилагается его состав и чудо-порошок для продления жизни цветов<br>к букетам с айдентикой также прилагается карточка и очечи',
		'staytrueflowers': 'к каждому букету прилагается карточка с его названием, состав, порошок для продления жизни цветов. и леденец для настроения :-)<br><br>ВАЖНО: про <a href="/substitute" target="_blank">замены в букетах</a>'
	}
	var div = $('<div class="t-store__prod-popup__text-dop"></div>');
	div.html(data[site]);
	$('.js-store-prod-text').append(div);
}

/**
 * характеристики товара
 */
function productCharcs(tovar) {
	tovar.find('.js-store-prod-charcs').each(function () {
		$(this).addClass('costumized');
		let [first, ...rest] = $(this).text().split(/:\s/);
		rest = rest.join(': ');
		$(this).html('<b>' + first + '</b> ' + rest);
		productRemoveCharcs($(this));
	});
}
function productRemoveCharcs(charcBlock) {
	var techCharcs = {
		'2steblya': ['гамма', 'цвет', 'состав'],
		'gvozdisco': [],
		'staytrueflowers': []
	}
	if (techCharcs[site].includes(charcBlock.children('b').text())) charcBlock.hide();
}

/**
 * логотип вместо "НА ЗАД" на страницах товаров (не попап)
 */
function productLogoInHeader() {
	$('.js-store-close-text').empty().addClass('logo'); //широкие экраны
	$('.t-popup__close').addClass('logo'); //мобилка
	$('a.t-store__prod-popup__close-txt').attr('href', '/');
}

/**
 * ссылки на объясняющие страницы рядом с полями опций товара
 */
function productOptionsReadMore(tovar) {
	var productOptionsHelpLinks = {
		'2steblya': {
			'фор мат': '/format',
			'выебри карточку': '/card'
		},
		'gvozdisco': {
			'формат': '/format',
			'карточка': '/card'
		},
		'staytrueflowers': {
			'формат': '/format',
			'карточка': '/card'
		}
	}
	tovar.find('.t-product__option-select').each(function () {
		var href = productOptionsHelpLinks[site][$(this).parent().prev().text()];
		if (!href) return;
		$(this).after('<a class="product__optionReadMore" href="' + href + '" onclick="window.open(\'' + href + '\');return false;">?</a>');
	});
}

/**
 * заменяем (&lt; &gt;) на нормальные символы (< >) в описании товара, чтоб отрабатывал html
 */
function productHtmlInDescription(tovar) {
	var text = tovar.find('.js-store-prod-all-text');
	if (!text.length) return;
	if (!text.html().includes('&lt;')) return;
	var html = text.html();
	html = html.replace('&lt;', '<');
	html = html.replace('&gt;', '>');
	text.html(html);
}

/**
 * черная пятница
 */
function productBlackFriday(tovar) {
	return;
	if (site != '2steblya') return;
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

/**
 * товар распродан
 */
function productSoldOut(tovar, catalog) {
	if (catalog) {
		var e = tovar.find('.js-store-prod-sold-out');
		e.removeClass('t-name').addClass('t-descr').css({ 'line-height': '31px', 'text-transform': 'lowercase' });
		e.siblings('.t-store__card__price').hide();
	} else {
		var btn = $('.t-store__prod-popup__btn');
		btn.show();
		var selects = $('.js-product-controls-wrapper');
		selects.show();
		tovar.find('.productSoldout').remove();
		if (!['Нет в наличии', 'Out of stock'].includes(btn.text().trim())) return;
		btn.hide().after('<div class="productSoldout t-btn">нет в наличии</div>');
		selects.hide();
	}
}

/**
 * скрываем недоступные к продаже форматы в выпадающем списке
 */
function productHideDisabledFormatOption(tovar) {
	tovar.find('[data-edition-option-id="' + productFormat[site] + '"] option[disabled]').hide();
}
/**
 * получаем текст карточки из селекта "текст карточки"
 */
function getTovarCardText(tovar) {
	var options = tovar.find('.js-product-option');
	if (!options.length) return '';
	var val = options.last().find('select').val();
	//перечеркнутый текст
	val = val.replace(/\*s\*(.*?)\*s\*/g, '<s>$1</s>');
	return val ? val.split('*br*').join('<br>') : '';
}

/**
 * получаем название товара для карточки
 */
function getTovarTitle(tovar) {
	return tovar.find('.js-store-prod-name').text();
}

/**
 * получаем id товара
 */
function getTovarId(tovar) {
	return parseInt(tovar.attr('data-product-gen-uid'));
}

/**
 * получаем текущую цену товара
 */
function getTovarPrice(tovar) {
	var price = tovar.find('[data-product-price-def]');
	if (!price) return null;
	if (!price.text()) return null;
	return parseInt(price.text().replace(/[^\d]/g, ''));
}

/**
 * если каталог - это витрина
 */
function isVitrina(catalog) {
	if (catalog.parents('.uc-vitrina__catalog').length) return true;
	return false;
}

/**
 * делаем каталог товаров каруселью
 */
function owlCatalog(catalog, className) {
	catalog.addClass('uc-' + className + '__catalog').addClass('owlCatalog');
	var tovars;
	var maxWaitTime = 10000;  // 10 секунд проверяем наличие товаров в каталоге
	var elapsedTime = 0;
	var intervalTime = 100;
	var int = setInterval(function () {
		elapsedTime += intervalTime;
		tovars = catalog.find('.js-store-grid-cont .js-product');
		if (tovars.length) {
			tovars = owlCatalogRemoveJunk();
			if (!tovars.length) return;
			clearInterval(int);
			owlCatalogCarousel();
			owlCatalogNavButtons();
			owlCatalogLazyLoadChanged();
			if (className != 'vitrina') return;
			$('[class*="vitrina"]').show();
		}
		if (elapsedTime >= maxWaitTime) clearInterval(int);
	}, intervalTime);

	/**
	 * удаляем все ненужное, возвращаем товары
	 */
	function owlCatalogRemoveJunk() {
		//удаляем сепараторы
		catalog.find('.t-store__grid-separator').remove();
		//если витрина, удаляем купленные
		if (className == 'vitrina') {
			tovars.each(function () {
				var tovar = $(this);
				if (!tovar.find('.js-store-prod-sold-out').length) return;
				tovar.remove();
			});
		}
		//вовращаем количество товаров
		return catalog.find('.js-store-grid-cont .js-product');
	}
	/**
	 * применяем owlCarousel
	 */
	function owlCatalogCarousel() {
		var onScreen = 1;
		if ($(window).width() > 550) onScreen++;
		if ($(window).width() > 850) onScreen++;
		if (onScreen > 1 && tovars.length == 2) catalog.addClass('twoItems');
		catalog.find('.js-store-grid-cont').owlCarousel({
			items: (tovars.length > onScreen ? onScreen : tovars.length),
			margin: 30,
			loop: className == 'vitrina' ? false : true,
			nav: tovars.length > onScreen,
			dots: false,
		});
	}
	/**
	 * кнопки навигации в карусели
	 */
	function owlCatalogNavButtons() {
		var navButtons = catalog.find('.owl-nav:not(.disabled)');
		if (!navButtons.length) return;
		setTimeout(function () {
			navButtons.show().css({ 'top': (catalog.find('.t-store__card__bgimg').height() / 2) + 'px' });
		}, 1000);
	}

	/**
	 * листание карусели и lazy load картинок
	 */
	function owlCatalogLazyLoadChanged() {
		catalog.find('.js-product-img').each(function () {
			$(this).css('background-image', 'url(' + $(this).data('original') + ')');
		});
	}
}

/**
 * каталог новинок
 * подгружаем из базы товары, которые считаются новыми и в каталоге удаляем всех, кроме них, а также расставляем их по дате создания
 */
function newCatalog(block) {
	$tovarsFromDbPromise = new Promise((resolve, reject) => {
		$.ajax({
			url: 'https://php.2steblya.ru/ajax.php?script=Tilda_products_from_DB&products=new&site=' + site,
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
	$tovarsFromDbPromise.
		then(idsFromDb => {
			var int = setInterval(function () {
				var products = block.find('.js-product.loaded');
				if (!products.length) return;
				clearInterval(int);
				var productsCont = products.parent();
				var productsMap = {};
				products.each(function () {
					productsMap[$(this).attr('data-product-gen-uid')] = $(this).clone();
				});
				productsCont.empty();
				for (var i = 0; i < idsFromDb.length; i++) {
					if (i == 15) break;
					if (!productsMap[idsFromDb[i].id]) continue;
					productsCont.append(productsMap[idsFromDb[i].id]);
				}
				block.find('.t-store__load-more-btn-wrap').remove();
				owlCatalog(block, 'new');
			}, 100);
		}).
		catch(error => {
			console.error('Error fetching data:', error);
		});
}