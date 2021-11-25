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
    navigation: {
        nextEl: ".subscription__cards .swiper-button-next",
        prevEl: ".subscription__cards .swiper-button-prev",
    },
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