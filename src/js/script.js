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

const subscriptionBreakpoints = {
    100: {
        slidesPerView: 1
    },
    576: {
        slidesPerView: 2
    },
    768: {
        slidesPerView: 3
    }
}

let subscriptionSwiperOne = new Swiper(".subscription__cards--one .subscription__swiper", { // SUBSCRIPTION ONE
    slidesPerView: 3,
    spaceBetween: 28,
    grabCursor: true,

    pagination: {
        el: ".subscription__cards--one .swiper-pagination",
        clickable: true,
    },
    breakpoints: subscriptionBreakpoints
});

let subscriptionSwiperTwo = new Swiper(".subscription__cards--two .subscription__swiper", { // SUBSCRIPTION TWO
    slidesPerView: 3,
    spaceBetween: 28,
    grabCursor: true,

    pagination: {
        el: ".subscription__cards--two .swiper-pagination",
        clickable: true,
    },
    breakpoints: subscriptionBreakpoints
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

// radio элемент, который изначально чекнутый
let modalGameBuyRadioInitial = document.querySelector(".modal__gameRegion .daySelector--visible .daySelector__radio");

let modalGameContents = document.querySelectorAll(".modal__gameRegion .swiper-slide");
let modalGameBuyRadio = document.querySelectorAll(".modal__gameRegion .daySelector__radio");
let acceptOfferCheckboxes = document.querySelectorAll(".acceptOffer .c-checkbox__input");

let modalPricingCost = document.querySelector(".modal__footer .modal__cost");
let modalPricingDuration = document.querySelector(".modal__footer .modal__duration");
let modalBuyLink = document.querySelector(".modal__footer .modal__buySub");
let modalOfferCheckbox = document.querySelector(".modal__acceptOffer .c-checkbox__input");

modalGameContents.forEach((slide, slideID) => {
    let radioSelectors = slide.querySelectorAll(".regionSelector__radio");
    let contentGames = slide.querySelectorAll(".daySelector");

    radioSelectors.forEach((radio, id) => {
        radio.addEventListener("change", () => {
            let radioSelect = contentGames[id].querySelectorAll(".daySelector__radio")[0];
            if (radioSelect !== null) {
                radioSelect.checked = true;
                updateProductModalInfo(radioSelect);
            }

            contentGames.forEach(daySelector => {
                daySelector.classList.toggle("daySelector--visible");
            });
        });
    });
});

if (modalGameBuyRadioInitial !== null) { // стартовая инициализация данных в футере модалки
    updateProductModalInfo(modalGameBuyRadioInitial);
}

modalGameBuyRadio.forEach((radio, id) => { // вещаем событие на change с условием изменения данных в футере
    radio.addEventListener("change", () => {
        updateProductModalInfo(radio);
    });
});

// ---------------------- Переключаем слайд товара в модалке -------------------

const modalGamesSwiper = new Swiper('.modal__gameRegion .swiper', {
    allowTouchMove: false
});

let modalGamesContentSelect = document.querySelectorAll(".modal__gameVersion .contentSelect__radio");

modalGamesContentSelect.forEach((game, id) => {
    game.addEventListener("change", () => {
        modalGamesSwiper.slideTo(id, 0, true);

        modalGameContents[id].querySelectorAll(".daySelector").forEach((item, id) => { // перебираем оба региона
            if (item.classList.contains("daySelector--visible")) { // смотрим у кого активный класс (выбран регион RU или EU)
                let contentBaseRadio = item.querySelector(".daySelector__radio"); // получаем первое радио из списка текущей игры
                if (contentBaseRadio !== null) {
                    contentBaseRadio.checked = true; // выбираем его
                    updateProductModalInfo(contentBaseRadio); // переключаем инфо в контенте футера модалки
                }
            }
        });

    });
});

// -----------------------------------------------------------------------------

// ----------------------------- NOTIFY ----------------------------------------
// -------- Оживляем чекбокс agree в секции карточек подписки ------------------

let subscribeCardsBtns = document.querySelectorAll(".subscription__cards .baseCard__btn .btn");
let subscribeAgreeCheckbox = document.querySelector(".subscription__accept .c-checkbox__input");

let notifyData = document.querySelector(".notifyData");
let notifyDataContent = {
    label: notifyData.dataset.label || "Вы не приняли договор оферты",
    text: notifyData.dataset.text || "Ознакомьтесь с договором оферты и примите его пожалуйста.",
    img: notifyData.dataset.img || "./img/notify/notify_error.svg"
}

let notifier = new AWN({
    labels: {
        warning: notifyDataContent.label
    },
    icons: {
        prefix: "<img src='",
        warning: notifyDataContent.img,
        suffix: "'/>"
    }
});

modalBuyLink.addEventListener("click", (e) => {
    if (!modalOfferCheckbox.checked) {
        e.preventDefault();
        notifier.warning(notifyDataContent.text);
    }
});

subscribeCardsBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (subscribeAgreeCheckbox !== null) {
            if (!subscribeAgreeCheckbox.checked) {
                e.preventDefault();
                notifier.warning(notifyDataContent.text);
            }
        }
    });
});

// Проставить везде галочку Accept политику конфиденциальности
let acceptAgreeBtn = document.querySelectorAll(".modal--offer .modal__footer .btn");
acceptAgreeBtn.forEach(acceptBtn => {
    acceptBtn.addEventListener("click", () => {
        acceptOfferCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        })
    });
});

// -------------------------------------------------------------------------------
// Notification purple header (включение и выключение по ID из localStorage)

let notification = document.querySelector(".notification");
if (notification !== null) {
    notificationStorageID = localStorage.getItem("notificationID");
    if (notificationStorageID === null || Number(notification.dataset.id) > Number(localStorage.getItem("notificationID"))) { 
        // если сторейдж пустой, или если текущий notificationID больше пред. закрытого
        notification.classList.remove("hidden");
    }
}

document.querySelectorAll(".notification__close").forEach(notification_close => {
    let notification = document.querySelector(".notification");
    notification_close.addEventListener("click", () => {
        notification.classList.add("hidden");
        localStorage.setItem("notificationID", notification.dataset.id);
    });
});

// -------------------------------------------------------------------------------
// Rocket animation show before change language

document.querySelectorAll(".languages a").forEach(link => {
    let href = link.getAttribute("href");
    overlayAnimation = document.querySelector(".overlay--animation");
    link.addEventListener("click", (e) => {
        e.preventDefault();
        if (overlayAnimation !== null) {
            overlayAnimation.classList.add("visible");
            setTimeout(() => {
                overlayAnimation.classList.add("addCircle");
            }, 2500);

            setTimeout(() => {
                overlayAnimation.classList.add("startAnim");
            }, 2550);

            setTimeout(() => {
                window.location.href = href;
            }, 3200);
        }
    });
});