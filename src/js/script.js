--include("_webpsup.js");
    
--include("_globals.js")

--include("_modal.js")
--include("_burger.js")
//-include("_slider.js")
--include("_scroll.js")
--include("_range.js")
--include("_gui.js")

--include("_passwordSwitcher.js")
--include("_customSelect.js")
--include("_details.js")
--include("_dropdown.js")

--include("_adaptImg.js")
--include("_intersection.js")

--include("_contentSelect.js")
--include("_swiper.js")
--include("_mainSlider.js")

document.querySelectorAll(".toggle-menu").forEach(menuToggler => { // добавляем/убираем состояние у элемента с классом .toggle-menu (our products)
    let menuContainer = document.querySelector(".productMenu");

    menuToggler.addEventListener("click", () => {
        menuToggler.classList.toggle("active");
        if (menuContainer !== null) {
            menuContainer.classList.toggle("active");
        }
    });
});

const productMenuSwiper = new Swiper('.productMenu__swiper', {
    effect: "fade",
    allowTouchMove: false,
});

document.querySelectorAll(".productMenu__radio").forEach((menuRadio, id) => {
    if (menuRadio.checked) {
        productMenuSwiper.slideTo(id, 0, true);
    }

    menuRadio.addEventListener("change", () => {
        productMenuSwiper.slideTo(id, 500, true)
    })
});

document.querySelectorAll(".fastBuy a").forEach(elem => {
    elem.addEventListener("click", function(e) {
        e.preventDefault();
        Modal.show("modal_buysub");
    });
});

// -------------------------

const subscriptionSwiper = new Swiper('.subscription__swiper', { // SUBSCRIPTION
    slidesPerView: 3,
    spaceBetween: 28,
    grabCursor: true,

    pagination: {
        el: ".subscription__cards .swiper-pagination",
        clickable: true,
    },
    // navigation: {
    //     nextEl: ".subscription__cards .swiper-button-next",
    //     prevEl: ".subscription__cards .swiper-button-prev",
    // },
    breakpoints: {
        // when window width is >= 100px
        100: {
            slidesPerView: 1
        },
        // when window width is >= 576px
        576: {
            slidesPerView: 2
        },
        // when window width is >= 768px
        768: {
            slidesPerView: 3
        }
    }
});

// -------- Меняем блок карточек при изменении региона в подписке (продукт)

let subscribeRadios = document.querySelectorAll(".subscription__region .regionSelector__radio");
let subscribeCards = document.querySelectorAll(".subscription__cards");

subscribeRadios.forEach(subscribeRadio => {
    subscribeRadio.addEventListener("change", () => {
        subscribeCards.forEach(card => {
            card.classList.toggle("subscription__cards--visible");
        })
    });
});

// -----------------------------------------------------------------------------

// -------- Оживляем чекбокс agree в секции карточек подписки ------------------

let subscribeCardsBtns = document.querySelectorAll(".subscription__cards .baseCard__btn .btn");
let subscribeAgreeCheckbox = document.querySelectorAll(".subscription__accept .c-checkbox__input");

subscribeAgreeCheckbox.forEach(checkboxAgree => {
    checkboxAgree.addEventListener("change", () => {
        if (checkboxAgree.checked) {
            subscribeCardsBtns.forEach(item => item.removeAttribute("disabled"));
        }
        else {
            subscribeCardsBtns.forEach(item => item.setAttribute("disabled", ""));
        }
    });
});

// -----------------------------------------------------------------------------

// ---------------------- ПЕРЕКЛЮЧАТЕЛЬ ТОВАРОВ В МОДАЛКЕ ----------------------

function updateProductModalInfo(radio) { // функция переключения данных при изменении radio в футере модалки
    let itemCover = radio.nextElementSibling;
    let needHref = itemCover.dataset.link;

    let duration = itemCover.querySelector(".daySelector__duration").innerHTML;
    let cost = itemCover.querySelector(".daySelector__cost").innerHTML;

    modalPricingDuration.innerHTML = duration;
    modalPricingCost.innerHTML = cost;
    modalBuyLink.setAttribute("href", needHref);
}

let modalGameContents = document.querySelectorAll(".modal__gameRegion .swiper-slide");
let modalGameBuyRadio = document.querySelectorAll(".modal__gameRegion .daySelector__radio");

let modalPricingCost = document.querySelector(".modal__footer .modal__cost");
let modalPricingDuration = document.querySelector(".modal__footer .modal__duration");
let modalBuyLink = document.querySelector(".modal__footer .modal__buySub");

let modalOfferCheckbox = document.querySelector(".modal__acceptOffer .c-checkbox__input");

modalGameContents.forEach((slide, slideID) => {
    let radioSelectors = slide.querySelectorAll(".regionSelector__radio");
    let contentGames = slide.querySelectorAll(".daySelector");

    radioSelectors.forEach(radio => {
        radio.addEventListener("change", () => {
            //console.log(slideID);

            contentGames.forEach(daySelector => {
                daySelector.classList.toggle("daySelector--visible");
            });
        });
    });
});

modalGameBuyRadio.forEach((radio, id) => {
    if (id === 0) { // стартовая инициализация данных в футере модалки
        updateProductModalInfo(radio);
    }

    radio.addEventListener("change", () => {
        updateProductModalInfo(radio);
    });
});

modalOfferCheckbox.addEventListener("change", () => { // переключатель политики конфиденциальности
    if (modalOfferCheckbox.checked) {
        modalBuyLink.removeAttribute("disabled");
    }
    else {
        modalBuyLink.setAttribute("disabled", "");
    }
});

// ---------------------- Переключаем слайд товара в модалке -------------------

const modalGamesSwiper = new Swiper('.modal__gameRegion .swiper', {
    allowTouchMove: false
});

let modalGamesContentSelect = document.querySelectorAll(".modal__gameVersion .contentSelect__radio");

modalGamesContentSelect.forEach((game, id) => {
    game.addEventListener("change", () => {
        //console.log(id);
        modalGamesSwiper.slideTo(id, 0, true);

        let contentBaseRadio = modalGameContents[id].querySelector(".daySelector__radio"); // получаем первое радио из списка текущей игры
        if (contentBaseRadio !== null) {
            contentBaseRadio.setAttribute("checked", ""); // выбираем его
            updateProductModalInfo(contentBaseRadio); // переключаем инфо в контенте футера модалки
        }
    });
});

// -----------------------------------------------------------------------------