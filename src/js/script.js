--include("_webpsup.js");
    
--include("_globals.js")

--include("_modal.js")
--include("_burger.js")
//-include("_slider.js")
--include("_scroll.js")

--include("_passwordSwitcher.js")
--include("_customSelect.js")
--include("_details.js")
--include("_dropdown.js")

--include("_adaptImg.js")
--include("_intersection.js")

--include("_contentSelect.js")
--include("_swiper.js")

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
        productMenuSwiper.slideTo(id, 300, true)
    })
});