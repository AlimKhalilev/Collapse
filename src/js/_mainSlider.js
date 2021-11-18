class MainSlider {
    static fadeSpeed = 600;
    static slideDelay = 5000;
    static slideBar = document.querySelector(".main__top .main__timer");
    static radioSelector = document.querySelectorAll(".gameSelector .gameSelector__radio");

    static mainSlider;
    static mainGameSlider;
    static mainStatusSlider;

    static updateSlideBar(index, isFirst) {
        this.slideBar.innerHTML = "";

        let slideBarProgress = document.createElement("div");
        slideBarProgress.classList.add("main__timerBar");
        slideBarProgress.setAttribute("style", `transition: ${isFirst ? this.slideDelay : this.slideDelay + 500}ms linear`);
        this.slideBar.appendChild(slideBarProgress);

        this.radioSelector[index].checked = true; // переключить радио переключатель (под основным слайдером)

        setTimeout(() => {
            slideBarProgress.classList.add("main__timerBar--fill");
        }, 10);
    }

    static initRadioSelector() { // инициализируем радио кнопки игр под основным слайдером
        this.radioSelector.forEach((radio, id) => {
            radio.addEventListener("change", () => {
                this.mainSlider.slideTo(id, this.fadeSpeed, true)
            });
        })
    }

    static initEvents() {

        if (document.querySelector(".main__sliderContainer") !== null) {

            this.mainSlider = new Swiper('.main__sliderContainer .main__slider', {
                effect: "fade",
                speed: this.fadeSpeed,
                autoplay: {
                    delay: this.slideDelay,
                    disableOnInteraction: false,
                },
                on: {
                    slideChange: () => {
                        this.updateSlideBar(this.mainSlider.realIndex);
                    }
                },
            
                pagination: {
                    el: '.main__sliderControls .swiper__pagination',
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<span class="' + className + '">0' + (index + 1) + "</span>";
                    },
                },
            
                navigation: {
                    nextEl: '.main__sliderControls .swiper__btn--next',
                    prevEl: '.main__sliderControls .swiper__btn--prev',
                },
            });
            
            this.mainGameSlider = new Swiper('.main__sliderContainer .swiper__mainGame', {
                effect: "fade",
                speed: this.fadeSpeed,
                allowTouchMove: false
            });
            
            this.mainStatusSlider = new Swiper('.main__sliderContainer .swiper__mainStatus', {
                effect: "fade",
                speed: this.fadeSpeed,
                allowTouchMove: false
            });
            
            this.mainSlider.controller.control = this.mainGameSlider;
            this.mainGameSlider.controller.control = this.mainStatusSlider;
    
            this.updateSlideBar(0, true);
            this.initRadioSelector();
        }
    }
}

MainSlider.initEvents();