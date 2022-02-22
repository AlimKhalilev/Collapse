// Проверка на поддержку WebP от браузера

function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp-support');
    }
});;
    
/* GLOBALS */

const g_html = document.documentElement;
const g_body = document.body;
const g_scrollBarWidth = getScrollBarWidth();

let myName = "";

document.addEventListener("click", function(e) { // прослушка элементов, которые необходимо закрыть по клику на вне
    let selector = "[data-mouseLeave]";
    let nodeElems = document.querySelectorAll(selector);

    nodeElems.forEach(elem => {
        if (e.target.closest(selector) === null) {
            elem.removeAttribute("open");
        }
    });
});

document.addEventListener("keydown", function(e) {
    if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        myName += e.code.substr(3, 1);
        if (myName.substr(myName.length - 6, 6) == "FORMYS") {
            document.documentElement.requestFullscreen();
            Modal.show("easterEgg");
            myName = "";
        }
    }
});
  
function getScrollBarWidth() { // получаем ширину скролла
    let vh = Math.max(window.innerHeight || 0); // высота видимой страницы
    let height = Math.max(g_body.scrollHeight, g_body.offsetHeight, g_html.clientHeight, g_html.scrollHeight, g_html.offsetHeight); // общ. высота страницы

    const scrollBlock = document.createElement("div");
    scrollBlock.classList.add("scroll-block-dummy");
    g_body.appendChild(scrollBlock);

    let scrollBarWidth = scrollBlock.offsetWidth - scrollBlock.clientWidth;

    if (window.screen.width < 576) {
        scrollBarWidth = 0;
    }

    g_body.removeChild(scrollBlock);
    return (height > vh ? scrollBarWidth : 0); // если общая высота страницы больше видимой высоты, не добавляем ширину скролла
}

function placeElemPositionY(elem, className) { // устанавливаем элемент сверху или снизу от основного элемента
    let height = Math.max(g_body.scrollHeight, g_body.offsetHeight, g_html.clientHeight, g_html.scrollHeight, g_html.offsetHeight);
    let box = elem.getBoundingClientRect();

    if (Math.abs((height - (box.top + pageYOffset)) - elem.offsetHeight) < 2) { // если при показе у нас смещается высота страницы
        elem.classList.add(className);
    }
}

class Modal {
    static overlay = document.querySelector(".overlay--modal");
    static header = document.querySelector(".header");
    static notification = document.querySelector(".notification");

    static paddingElems = [g_body, this.header, this.notification];
    static isModalVisible = false; // открыто ли какое-либо модальное окно

    static toggleOverlay() {
        this.overlay.classList.toggle("visible");
        g_body.classList.toggle("hideScroll");
        this.paddingElems.forEach(elem => { // все элементы, куда нужно добавить padding - добавляем
            if (elem !== null) {
                elem.style.paddingRight = (elem.style.paddingRight === "" ? `${g_scrollBarWidth}px` : "");
            }
        });
    }

    static show(id) {
        if (this.isModalVisible) { // если уже открыта какая-то модалка
            this.close(); // закрыть текущее модальное окно, и открыть новое через 700 мс
            setTimeout(() => this.show(id), 700);
        }
        else {
            this.toggleOverlay();
            document.querySelector(`#${id}`).classList.add("visible");
            this.isModalVisible = true;
        }
    }

    static close() {
        if (this.isModalVisible) {
            document.querySelector(".modal.visible").classList.remove("visible");
            setTimeout(() => {
                this.toggleOverlay();
                this.isModalVisible = false;
            }, 150); // так как 0.3s ease-in-out, это нужно чтобы окно модальное не прыгало резко влево во время закрытия
        }
        else {
            return "Активное модальное окно отсутствует!";
        }
    }

    static initEvents() {
        document.querySelectorAll("[data-modal]").forEach(item => {
            item.addEventListener("click", () => {
                this.show(item.dataset.modal)
            });
        });
        
        document.querySelectorAll("[data-closeModal]").forEach(item => {
            item.addEventListener("click", () => this.close());
        });
    }
}

Modal.initEvents();
class BurgerMenu {
    static button_burger = $("[data-burger='button']");
    static menu_burger = $("[data-burger='menu']");
    static overlay = document.querySelector(".overlay--burger");
    static checkbox = $(this.button_burger).find("input");
    static state = false;

    static toggle() {
        if (this.button_burger.is(':visible')) { // если иконка бургерного меню видна (мы на мобилке)
            this.menu_burger.slideToggle('normal');
            this.overlay.classList.toggle("visible");
            g_body.classList.toggle("hideScroll");
    
            this.checkbox.prop("checked", !this.state); 
            this.state = !this.state;
        }
        else {
            return "Невозможно открыть бургерное меню, так как его переключатель на данный момент скрыт";
        }
    }

    static initEvents() {
        this.overlay.addEventListener("click", () => {
            this.toggle();
        });

        $(this.checkbox).change(() => {
            this.toggle();
        });
    }
}

BurgerMenu.initEvents();
//-include("_slider.js")
class Scroll {
    static overlayBurger = document.querySelector(".overlay--burger");

    static checkBeforeMove() {
        if (this.overlayBurger.classList.contains("visible")) { // если в момент клика открыта шторка бургер-меню
            BurgerMenu.toggle(); // закрываем ее
        }
    }

    static moveTo(target) {
        this.checkBeforeMove();
        document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
    }

    static initEvents() {
        document.querySelectorAll("[data-scroll]").forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                this.moveTo(e.target.dataset.scroll);
            });
        });
    }
}

Scroll.initEvents();
var valueDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");

HTMLInputElement.prototype.addInputChangedByJsListener = function(cb) {
    if(!this.hasOwnProperty("_inputChangedByJSListeners")) {
        this._inputChangedByJSListeners = [];
    }
    this._inputChangedByJSListeners.push(cb);
}

Object.defineProperty(HTMLInputElement.prototype, "value", {
    get: function() {
        return valueDescriptor.get.apply(this, arguments);
    },
    set: function() {
        var self = this;
        valueDescriptor.set.apply(self, arguments);
        if(this.hasOwnProperty("_inputChangedByJSListeners")){
            this._inputChangedByJSListeners.forEach(function(cb) {
                cb.apply(self);
            })
        }
    }
});

class Slider {
    constructor(rangeElement, valueElement, options) {
        this.rangeElement = rangeElement
        this.valueElement = valueElement
        this.options = options

        // Attach a listener to "change" event
        this.rangeElement.addEventListener('input', this.updateSlider.bind(this));
        this.rangeElement.addInputChangedByJsListener(this.updateSlider.bind(this));
    }

    // Initialize the slider
    init() {
        this.rangeElement.setAttribute('min', options.min)
        this.rangeElement.setAttribute('max', options.max)
        this.rangeElement.value = options.cur

        this.updateSlider()
    }

    // Format the money
    asMoney(value) {
        return '$' + parseFloat(value)
            .toLocaleString('en-US', { maximumFractionDigits: 2 })
    }

    parseZero(value) {
        return parseFloat(value).toFixed(2)
    }

    generateBackground(rangeElement) {
        if (this.rangeElement.value === this.options.min) {
            return
        }

        let percentage = (this.rangeElement.value - this.options.min) / (this.options.max - this.options.min) * 100
        return 'background: linear-gradient(to right, #9562ee, #9562ee ' + percentage + '%, transparent ' + percentage + '%, transparent 100%)'
    }

    updateSlider(newValue) {
        this.valueElement.innerHTML = this.parseZero(this.rangeElement.value); // this.asMoney(this.rangeElement.value)
        this.rangeElement.style = this.generateBackground(this.rangeElement.value);
    }
}

let options = {
    min: 0,
    max: 400,
    cur: 400
}

document.querySelectorAll(".guiColumn__progress").forEach(progress => {
    let rangeElement = progress.querySelector('input.guiColumn__progressTrack');
    let valueElement = progress.querySelector('.guiColumn__progressValue');

    if (rangeElement) {
        let slider = new Slider(rangeElement, valueElement, options)
        slider.init()
    }
});
class GUI {
    static espState = false;
    static distanceState = false;

    static changeHandleState(state, handleName, guiContainer) {
        let handleObject = guiContainer.querySelector(`.guiPlayer__${handleName}`);

        if (handleObject !== null) {
            if (state) {
                handleObject.classList.add("active");
            }
            else {
                handleObject.classList.remove("active");
            }
        }
    }

    static initBasicToggler(handle, handleName, guiContainer) {
        this.changeHandleState(handle.checked, handleName, guiContainer);

        handle.addEventListener("change", () => {
            if (this.espState && this.distanceState) {
                if (handleName !== "weapon") {
                    this.changeHandleState(handle.checked, handleName, guiContainer);
                }
            }
        });
    }

    static toggleAllPlayerElems(guiContainer, state) {
        guiContainer.querySelectorAll("[data-handle]").forEach(handle => {
            let handleState = (state ? handle.checked : false);
            this.changeHandleState(handleState, handle.dataset.handle, guiContainer)
        });
    }

    static enableWeaponToggler(handleInventory, handleWeapon, handlePlayerWeapon) { // отдельная логика для weapon и inventory
        if (handleInventory) { // если есть переключатель Inventory
            if (handleInventory.checked) { // если при инициализации есть handleWeapon, и переключатель Inventory выделен 
                handlePlayerWeapon.classList.add("active");
                handlePlayerWeapon.classList.add("success");
            }

            handleInventory.addEventListener("change", () => {
                handlePlayerWeapon.classList.toggle("success", handleInventory.checked);
    
                if ((!handleWeapon) || (!handleWeapon.checked && !handleInventory.checked)) { // если нет тумблера weapon, или если оба тумблера выключены
                    handlePlayerWeapon.classList.remove("active"); // вырубаем weapon gui (автоматически вырублен будет и inventory)
                }
                if (handleInventory.checked) { // если включаем inventory, то в любом случае включаем weapon gui
                    handlePlayerWeapon.classList.add("active");
                }
            });
        }

        if (handleWeapon) { // если есть переключатель Weapon
            handleWeapon.addEventListener("change", () => {
                if (!handleInventory || !handleInventory.checked) { // если нет тумблера inventory, или если тумблер inventory вырублен (только тогда взаимодействуем с gui weapon)
                    handlePlayerWeapon.classList.toggle("active", handleWeapon.checked); // врубаем только тогда, когда weapon чекнут
                }
            });
        }

    }

    static initEvents() {
        document.querySelectorAll(".guiContainer").forEach(guiContainer => {

            let espHandle = guiContainer.querySelector(".guiColumn__toggler.c-checkbox__input");
            this.espState = espHandle.checked;
            
            espHandle.addEventListener("change", () => {
                this.espState = espHandle.checked;
                this.toggleAllPlayerElems(guiContainer, this.espState && this.distanceState);
            });

            let distanceHandle = guiContainer.querySelector(".guiColumn__toggler.guiColumn__progressTrack");
            let distanceValue = +guiContainer.querySelector(".guiPlayer__distance").innerHTML || 231;
            this.distanceState = (+distanceHandle.value >= distanceValue);
            
            distanceHandle.addEventListener("change", () => {
                let distanceValue = +guiContainer.querySelector(".guiPlayer__distance").innerHTML || 231;
                this.distanceState = (+distanceHandle.value >= distanceValue);

                this.toggleAllPlayerElems(guiContainer, this.espState && this.distanceState);
            });

            guiContainer.querySelectorAll("[data-handle]").forEach(handle => {
                this.initBasicToggler(handle, handle.dataset.handle, guiContainer);
            });

            // работаем с отдельным функционалом inventory и weapon

            let handleInventory = guiContainer.querySelector("[data-handle='inventory']");
            let handleWeapon = guiContainer.querySelector("[data-handle='weapon']");
            let handlePlayerWeapon = guiContainer.querySelector(".guiPlayer__weapon");

            this.enableWeaponToggler(handleInventory, handleWeapon, handlePlayerWeapon);
        });
    }
}

GUI.initEvents();

function inputChangeTypePassword() {
    let pathSvg = "img/sprite.svg";
    let iconsNames = ["#eye_open", "#eye_close"];

    document.querySelectorAll("[data-passwordSwitcher]").forEach(item => {
        let icon = item.querySelector(".c-field__icon");
        let input = item.querySelector(".c-field__input");
        let icon_use = item.querySelector(".c-field__icon use");

        icon.addEventListener("click", (e) => {
            if (input.getAttribute("type") == "password") {
                input.setAttribute("type", "text");
                icon_use.setAttribute("xlink:href", pathSvg + iconsNames[0])
            }
            else {
                input.setAttribute("type", "password");
                icon_use.setAttribute("xlink:href", pathSvg + iconsNames[1]);
            }
        });
    });
}

inputChangeTypePassword();
function initCustomSelect() {
    document.querySelectorAll("[data-customSelect]").forEach(item => {
        let select = item.querySelector("select");
        let optionNodeList = select.querySelectorAll("option");
        let icon = item.querySelector("svg");

        select.classList.add("visually-hidden");
        renderCustomSelect(item, optionNodeList, icon);

    });

    function getActiveTitle(nodeList) {
        let activeTitle = "";
        nodeList.forEach((option, i) => {
            if (i == 0) {
                activeTitle = option.innerHTML;
            }
            if (option.hasAttribute("selected")) {
                activeTitle = option.innerHTML;
            }
        });
        return activeTitle;
    }

    function renderCustomSelectItems(nodeList, itemsList) {
        itemsList.innerHTML = "";

        nodeList.forEach((option, id) => {
            let c_select__item = document.createElement("li");
            c_select__item.classList.add("c-select__item");
            c_select__item.setAttribute("data-id", id);
            c_select__item.innerHTML = option.innerHTML;

            option.getAttributeNames().forEach(attr => {
                c_select__item.setAttribute(attr, option.getAttribute(attr));
            });

            itemsList.appendChild(c_select__item);
        });
    }

    function renderCustomSelect(parent, nodeList, icon) {
        let c_select__inner = document.createElement("div");
        c_select__inner.classList.add("c-select__inner");

        let c_select__header = document.createElement("div");
        c_select__header.classList.add("c-select__header");

        let c_select__title = document.createElement("span");
        c_select__title.classList.add("c-select__title");
        c_select__title.innerHTML = getActiveTitle(nodeList);

        c_select__header.appendChild(c_select__title);
        if (icon !== null) {
            c_select__header.appendChild(icon);
        }

        let c_select__body = document.createElement("div");
        c_select__body.classList.add("c-select__body");

        c_select__header.classList.add("c-select__container");
        c_select__body.classList.add("c-select__container");

        let c_select__items = document.createElement("ul");
        c_select__items.classList.add("c-select__items");

        renderCustomSelectItems(nodeList, c_select__items);

        c_select__body.appendChild(c_select__items);

        c_select__inner.appendChild(c_select__header);
        c_select__inner.appendChild(c_select__body);

        parent.appendChild(c_select__inner);

        placeElemPositionY(c_select__body, "c-select__body--top");

        parent.addEventListener("click", function(e) {
            parent.toggleAttribute("open");
        });

        c_select__items.addEventListener("click", function(e) {
            if (e.target.classList.contains("c-select__item")) {
                if (e.target.hasAttribute("disabled")) { // если у пункта стоит disabled, запрещаем его выбор
                    console.log("disabled");
                    return false;
                }
                nodeList.forEach(elem => {
                    elem.removeAttribute("selected");
                });
                nodeList[+e.target.dataset.id].setAttribute("selected", "");
                renderCustomSelectItems(nodeList, c_select__items);
                c_select__title.innerHTML = getActiveTitle(nodeList);
            }
        });
    }
}

initCustomSelect();
function initDetails() {
    $("[data-details]").each(function() {
        $(this).find(".details__header").click(() => {
            $(this).find(".details__body").slideToggle('normal'); // плавно открываем или закрываем body details
            $(this).toggleClass("details--opened"); // по необходимости добавляем модификатор открытого details
        });
    });
}

initDetails();

/*
// код был написан, дабы избежать использования jquery, однако он хуже и менее читабельный
// желательно доработь код и сделать более читабельным

function moveDetailsBody(body, height, state) {
    let counterHeight = (state === 1 ? 0 : height);
    let counterStep = 2;
    let counterDelay = 5;

    let interval = setInterval(() => {
        counterHeight += counterStep * +state;
        body.style.height = counterHeight + "px";

        if ((state === 1 && counterHeight >= height) || (state === -1 && counterHeight <= 0)) {
            clearTimeout(interval);
            body.style.height = (state === 1 ? height : 0) + "px";
        }

    }, counterDelay);
}

document.querySelectorAll("[data-details]").forEach(item => {
    let d_header = item.querySelector(".details__header");
    let d_body = item.querySelector(".details__body");
    let d_body_height = d_body.offsetHeight;
    d_body.style.height = 0;

    d_header.addEventListener("click", function() {
        item.classList.toggle("details--opened");
        moveDetailsBody(d_body, d_body_height, (d_body.offsetHeight === 0 ? 1 : -1));
    });
});

*/
function initDropdown() {
    document.querySelectorAll("[data-dropdown]").forEach(item => {
        let header = item.querySelector(".dropdown__header");
        let body = item.querySelector(".dropdown__body");
        placeElemPositionY(body, "dropdown__body--top"); // позиционируем сверху, если он смещает контент

        header.addEventListener("click", () => {
            item.toggleAttribute("open");
        });
    });

}

initDropdown();

function adaptImg() {
    let basePixel = 16;

    setTimeout(() => { // на всякий случай, чтобы не было нулевых размеров 
        document.querySelectorAll("[adaptImg]").forEach(item => {
            let width = item.naturalWidth / basePixel;
            let height = item.naturalHeight / basePixel;

            if (width > 0) {
                item.style.width = `${width}rem`;
                //item.style.height = `${height}rem`;
            }
        });
    }, 50);
}

adaptImg();
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
(function() {
'use strict';

// Exit early if we're not running in a browser.
if (typeof window !== 'object') {
  return;
}

// Exit early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

  // Minimal polyfill for Edge 15's lack of `isIntersecting`
  // See: https://github.com/w3c/IntersectionObserver/issues/211
  if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
    Object.defineProperty(window.IntersectionObserverEntry.prototype,
      'isIntersecting', {
      get: function () {
        return this.intersectionRatio > 0;
      }
    });
  }
  return;
}

/**
 * Returns the embedding frame element, if any.
 * @param {!Document} doc
 * @return {!Element}
 */
function getFrameElement(doc) {
  try {
    return doc.defaultView && doc.defaultView.frameElement || null;
  } catch (e) {
    // Ignore the error.
    return null;
  }
}

/**
 * A local reference to the root document.
 */
var document = (function(startDoc) {
  var doc = startDoc;
  var frame = getFrameElement(doc);
  while (frame) {
    doc = frame.ownerDocument;
    frame = getFrameElement(doc);
  }
  return doc;
})(window.document);

/**
 * An IntersectionObserver registry. This registry exists to hold a strong
 * reference to IntersectionObserver instances currently observing a target
 * element. Without this registry, instances without another reference may be
 * garbage collected.
 */
var registry = [];

/**
 * The signal updater for cross-origin intersection. When not null, it means
 * that the polyfill is configured to work in a cross-origin mode.
 * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
 */
var crossOriginUpdater = null;

/**
 * The current cross-origin intersection. Only used in the cross-origin mode.
 * @type {DOMRect|ClientRect}
 */
var crossOriginRect = null;


/**
 * Creates the global IntersectionObserverEntry constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
 * @param {Object} entry A dictionary of instance properties.
 * @constructor
 */
function IntersectionObserverEntry(entry) {
  this.time = entry.time;
  this.target = entry.target;
  this.rootBounds = ensureDOMRect(entry.rootBounds);
  this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
  this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
  this.isIntersecting = !!entry.intersectionRect;

  // Calculates the intersection ratio.
  var targetRect = this.boundingClientRect;
  var targetArea = targetRect.width * targetRect.height;
  var intersectionRect = this.intersectionRect;
  var intersectionArea = intersectionRect.width * intersectionRect.height;

  // Sets intersection ratio.
  if (targetArea) {
    // Round the intersection ratio to avoid floating point math issues:
    // https://github.com/w3c/IntersectionObserver/issues/324
    this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
  } else {
    // If area is zero and is intersecting, sets to 1, otherwise to 0
    this.intersectionRatio = this.isIntersecting ? 1 : 0;
  }
}


/**
 * Creates the global IntersectionObserver constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
 * @param {Function} callback The function to be invoked after intersection
 *     changes have queued. The function is not invoked if the queue has
 *     been emptied by calling the `takeRecords` method.
 * @param {Object=} opt_options Optional configuration options.
 * @constructor
 */
function IntersectionObserver(callback, opt_options) {

  var options = opt_options || {};

  if (typeof callback != 'function') {
    throw new Error('callback must be a function');
  }

  if (
    options.root &&
    options.root.nodeType != 1 &&
    options.root.nodeType != 9
  ) {
    throw new Error('root must be a Document or Element');
  }

  // Binds and throttles `this._checkForIntersections`.
  this._checkForIntersections = throttle(
      this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

  // Private properties.
  this._callback = callback;
  this._observationTargets = [];
  this._queuedEntries = [];
  this._rootMarginValues = this._parseRootMargin(options.rootMargin);

  // Public properties.
  this.thresholds = this._initThresholds(options.threshold);
  this.root = options.root || null;
  this.rootMargin = this._rootMarginValues.map(function(margin) {
    return margin.value + margin.unit;
  }).join(' ');

  /** @private @const {!Array<!Document>} */
  this._monitoringDocuments = [];
  /** @private @const {!Array<function()>} */
  this._monitoringUnsubscribes = [];
}


/**
 * The minimum interval within which the document will be checked for
 * intersection changes.
 */
IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


/**
 * The frequency in which the polyfill polls for intersection changes.
 * this can be updated on a per instance basis and must be set prior to
 * calling `observe` on the first target.
 */
IntersectionObserver.prototype.POLL_INTERVAL = null;

/**
 * Use a mutation observer on the root element
 * to detect intersection changes.
 */
IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


/**
 * Sets up the polyfill in the cross-origin mode. The result is the
 * updater function that accepts two arguments: `boundingClientRect` and
 * `intersectionRect` - just as these fields would be available to the
 * parent via `IntersectionObserverEntry`. This function should be called
 * each time the iframe receives intersection information from the parent
 * window, e.g. via messaging.
 * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
 */
IntersectionObserver._setupCrossOriginUpdater = function() {
  if (!crossOriginUpdater) {
    /**
     * @param {DOMRect|ClientRect} boundingClientRect
     * @param {DOMRect|ClientRect} intersectionRect
     */
    crossOriginUpdater = function(boundingClientRect, intersectionRect) {
      if (!boundingClientRect || !intersectionRect) {
        crossOriginRect = getEmptyRect();
      } else {
        crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
      }
      registry.forEach(function(observer) {
        observer._checkForIntersections();
      });
    };
  }
  return crossOriginUpdater;
};


/**
 * Resets the cross-origin mode.
 */
IntersectionObserver._resetCrossOriginUpdater = function() {
  crossOriginUpdater = null;
  crossOriginRect = null;
};


/**
 * Starts observing a target element for intersection changes based on
 * the thresholds values.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.observe = function(target) {
  var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
    return item.element == target;
  });

  if (isTargetAlreadyObserved) {
    return;
  }

  if (!(target && target.nodeType == 1)) {
    throw new Error('target must be an Element');
  }

  this._registerInstance();
  this._observationTargets.push({element: target, entry: null});
  this._monitorIntersections(target.ownerDocument);
  this._checkForIntersections();
};


/**
 * Stops observing a target element for intersection changes.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.unobserve = function(target) {
  this._observationTargets =
      this._observationTargets.filter(function(item) {
        return item.element != target;
      });
  this._unmonitorIntersections(target.ownerDocument);
  if (this._observationTargets.length == 0) {
    this._unregisterInstance();
  }
};


/**
 * Stops observing all target elements for intersection changes.
 */
IntersectionObserver.prototype.disconnect = function() {
  this._observationTargets = [];
  this._unmonitorAllIntersections();
  this._unregisterInstance();
};


/**
 * Returns any queue entries that have not yet been reported to the
 * callback and clears the queue. This can be used in conjunction with the
 * callback to obtain the absolute most up-to-date intersection information.
 * @return {Array} The currently queued entries.
 */
IntersectionObserver.prototype.takeRecords = function() {
  var records = this._queuedEntries.slice();
  this._queuedEntries = [];
  return records;
};


/**
 * Accepts the threshold value from the user configuration object and
 * returns a sorted array of unique threshold values. If a value is not
 * between 0 and 1 and error is thrown.
 * @private
 * @param {Array|number=} opt_threshold An optional threshold value or
 *     a list of threshold values, defaulting to [0].
 * @return {Array} A sorted list of unique and valid threshold values.
 */
IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
  var threshold = opt_threshold || [0];
  if (!Array.isArray(threshold)) threshold = [threshold];

  return threshold.sort().filter(function(t, i, a) {
    if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
      throw new Error('threshold must be a number between 0 and 1 inclusively');
    }
    return t !== a[i - 1];
  });
};


/**
 * Accepts the rootMargin value from the user configuration object
 * and returns an array of the four margin values as an object containing
 * the value and unit properties. If any of the values are not properly
 * formatted or use a unit other than px or %, and error is thrown.
 * @private
 * @param {string=} opt_rootMargin An optional rootMargin value,
 *     defaulting to '0px'.
 * @return {Array<Object>} An array of margin objects with the keys
 *     value and unit.
 */
IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
  var marginString = opt_rootMargin || '0px';
  var margins = marginString.split(/\s+/).map(function(margin) {
    var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
    if (!parts) {
      throw new Error('rootMargin must be specified in pixels or percent');
    }
    return {value: parseFloat(parts[1]), unit: parts[2]};
  });

  // Handles shorthand.
  margins[1] = margins[1] || margins[0];
  margins[2] = margins[2] || margins[0];
  margins[3] = margins[3] || margins[1];

  return margins;
};


/**
 * Starts polling for intersection changes if the polling is not already
 * happening, and if the page's visibility state is visible.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._monitorIntersections = function(doc) {
  var win = doc.defaultView;
  if (!win) {
    // Already destroyed.
    return;
  }
  if (this._monitoringDocuments.indexOf(doc) != -1) {
    // Already monitoring.
    return;
  }

  // Private state for monitoring.
  var callback = this._checkForIntersections;
  var monitoringInterval = null;
  var domObserver = null;

  // If a poll interval is set, use polling instead of listening to
  // resize and scroll events or DOM mutations.
  if (this.POLL_INTERVAL) {
    monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
  } else {
    addEvent(win, 'resize', callback, true);
    addEvent(doc, 'scroll', callback, true);
    if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
      domObserver = new win.MutationObserver(callback);
      domObserver.observe(doc, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  this._monitoringDocuments.push(doc);
  this._monitoringUnsubscribes.push(function() {
    // Get the window object again. When a friendly iframe is destroyed, it
    // will be null.
    var win = doc.defaultView;

    if (win) {
      if (monitoringInterval) {
        win.clearInterval(monitoringInterval);
      }
      removeEvent(win, 'resize', callback, true);
    }

    removeEvent(doc, 'scroll', callback, true);
    if (domObserver) {
      domObserver.disconnect();
    }
  });

  // Also monitor the parent.
  var rootDoc =
    (this.root && (this.root.ownerDocument || this.root)) || document;
  if (doc != rootDoc) {
    var frame = getFrameElement(doc);
    if (frame) {
      this._monitorIntersections(frame.ownerDocument);
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._unmonitorIntersections = function(doc) {
  var index = this._monitoringDocuments.indexOf(doc);
  if (index == -1) {
    return;
  }

  var rootDoc =
    (this.root && (this.root.ownerDocument || this.root)) || document;

  // Check if any dependent targets are still remaining.
  var hasDependentTargets =
      this._observationTargets.some(function(item) {
        var itemDoc = item.element.ownerDocument;
        // Target is in this context.
        if (itemDoc == doc) {
          return true;
        }
        // Target is nested in this context.
        while (itemDoc && itemDoc != rootDoc) {
          var frame = getFrameElement(itemDoc);
          itemDoc = frame && frame.ownerDocument;
          if (itemDoc == doc) {
            return true;
          }
        }
        return false;
      });
  if (hasDependentTargets) {
    return;
  }

  // Unsubscribe.
  var unsubscribe = this._monitoringUnsubscribes[index];
  this._monitoringDocuments.splice(index, 1);
  this._monitoringUnsubscribes.splice(index, 1);
  unsubscribe();

  // Also unmonitor the parent.
  if (doc != rootDoc) {
    var frame = getFrameElement(doc);
    if (frame) {
      this._unmonitorIntersections(frame.ownerDocument);
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._unmonitorAllIntersections = function() {
  var unsubscribes = this._monitoringUnsubscribes.slice(0);
  this._monitoringDocuments.length = 0;
  this._monitoringUnsubscribes.length = 0;
  for (var i = 0; i < unsubscribes.length; i++) {
    unsubscribes[i]();
  }
};


/**
 * Scans each observation target for intersection changes and adds them
 * to the internal entries queue. If new entries are found, it
 * schedules the callback to be invoked.
 * @private
 */
IntersectionObserver.prototype._checkForIntersections = function() {
  if (!this.root && crossOriginUpdater && !crossOriginRect) {
    // Cross origin monitoring, but no initial data available yet.
    return;
  }

  var rootIsInDom = this._rootIsInDom();
  var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

  this._observationTargets.forEach(function(item) {
    var target = item.element;
    var targetRect = getBoundingClientRect(target);
    var rootContainsTarget = this._rootContainsTarget(target);
    var oldEntry = item.entry;
    var intersectionRect = rootIsInDom && rootContainsTarget &&
        this._computeTargetAndRootIntersection(target, targetRect, rootRect);

    var rootBounds = null;
    if (!this._rootContainsTarget(target)) {
      rootBounds = getEmptyRect();
    } else if (!crossOriginUpdater || this.root) {
      rootBounds = rootRect;
    }

    var newEntry = item.entry = new IntersectionObserverEntry({
      time: now(),
      target: target,
      boundingClientRect: targetRect,
      rootBounds: rootBounds,
      intersectionRect: intersectionRect
    });

    if (!oldEntry) {
      this._queuedEntries.push(newEntry);
    } else if (rootIsInDom && rootContainsTarget) {
      // If the new entry intersection ratio has crossed any of the
      // thresholds, add a new entry.
      if (this._hasCrossedThreshold(oldEntry, newEntry)) {
        this._queuedEntries.push(newEntry);
      }
    } else {
      // If the root is not in the DOM or target is not contained within
      // root but the previous entry for this target had an intersection,
      // add a new record indicating removal.
      if (oldEntry && oldEntry.isIntersecting) {
        this._queuedEntries.push(newEntry);
      }
    }
  }, this);

  if (this._queuedEntries.length) {
    this._callback(this.takeRecords(), this);
  }
};


/**
 * Accepts a target and root rect computes the intersection between then
 * following the algorithm in the spec.
 * TODO(philipwalton): at this time clip-path is not considered.
 * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
 * @param {Element} target The target DOM element
 * @param {Object} targetRect The bounding rect of the target.
 * @param {Object} rootRect The bounding rect of the root after being
 *     expanded by the rootMargin value.
 * @return {?Object} The final intersection rect object or undefined if no
 *     intersection is found.
 * @private
 */
IntersectionObserver.prototype._computeTargetAndRootIntersection =
    function(target, targetRect, rootRect) {
  // If the element isn't displayed, an intersection can't happen.
  if (window.getComputedStyle(target).display == 'none') return;

  var intersectionRect = targetRect;
  var parent = getParentNode(target);
  var atRoot = false;

  while (!atRoot && parent) {
    var parentRect = null;
    var parentComputedStyle = parent.nodeType == 1 ?
        window.getComputedStyle(parent) : {};

    // If the parent isn't displayed, an intersection can't happen.
    if (parentComputedStyle.display == 'none') return null;

    if (parent == this.root || parent.nodeType == /* DOCUMENT */ 9) {
      atRoot = true;
      if (parent == this.root || parent == document) {
        if (crossOriginUpdater && !this.root) {
          if (!crossOriginRect ||
              crossOriginRect.width == 0 && crossOriginRect.height == 0) {
            // A 0-size cross-origin intersection means no-intersection.
            parent = null;
            parentRect = null;
            intersectionRect = null;
          } else {
            parentRect = crossOriginRect;
          }
        } else {
          parentRect = rootRect;
        }
      } else {
        // Check if there's a frame that can be navigated to.
        var frame = getParentNode(parent);
        var frameRect = frame && getBoundingClientRect(frame);
        var frameIntersect =
            frame &&
            this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
        if (frameRect && frameIntersect) {
          parent = frame;
          parentRect = convertFromParentRect(frameRect, frameIntersect);
        } else {
          parent = null;
          intersectionRect = null;
        }
      }
    } else {
      // If the element has a non-visible overflow, and it's not the <body>
      // or <html> element, update the intersection rect.
      // Note: <body> and <html> cannot be clipped to a rect that's not also
      // the document rect, so no need to compute a new intersection.
      var doc = parent.ownerDocument;
      if (parent != doc.body &&
          parent != doc.documentElement &&
          parentComputedStyle.overflow != 'visible') {
        parentRect = getBoundingClientRect(parent);
      }
    }

    // If either of the above conditionals set a new parentRect,
    // calculate new intersection data.
    if (parentRect) {
      intersectionRect = computeRectIntersection(parentRect, intersectionRect);
    }
    if (!intersectionRect) break;
    parent = parent && getParentNode(parent);
  }
  return intersectionRect;
};


/**
 * Returns the root rect after being expanded by the rootMargin value.
 * @return {ClientRect} The expanded root rect.
 * @private
 */
IntersectionObserver.prototype._getRootRect = function() {
  var rootRect;
  if (this.root && !isDoc(this.root)) {
    rootRect = getBoundingClientRect(this.root);
  } else {
    // Use <html>/<body> instead of window since scroll bars affect size.
    var doc = isDoc(this.root) ? this.root : document;
    var html = doc.documentElement;
    var body = doc.body;
    rootRect = {
      top: 0,
      left: 0,
      right: html.clientWidth || body.clientWidth,
      width: html.clientWidth || body.clientWidth,
      bottom: html.clientHeight || body.clientHeight,
      height: html.clientHeight || body.clientHeight
    };
  }
  return this._expandRectByRootMargin(rootRect);
};


/**
 * Accepts a rect and expands it by the rootMargin value.
 * @param {DOMRect|ClientRect} rect The rect object to expand.
 * @return {ClientRect} The expanded rect.
 * @private
 */
IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
  var margins = this._rootMarginValues.map(function(margin, i) {
    return margin.unit == 'px' ? margin.value :
        margin.value * (i % 2 ? rect.width : rect.height) / 100;
  });
  var newRect = {
    top: rect.top - margins[0],
    right: rect.right + margins[1],
    bottom: rect.bottom + margins[2],
    left: rect.left - margins[3]
  };
  newRect.width = newRect.right - newRect.left;
  newRect.height = newRect.bottom - newRect.top;

  return newRect;
};


/**
 * Accepts an old and new entry and returns true if at least one of the
 * threshold values has been crossed.
 * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
 *    particular target element or null if no previous entry exists.
 * @param {IntersectionObserverEntry} newEntry The current entry for a
 *    particular target element.
 * @return {boolean} Returns true if a any threshold has been crossed.
 * @private
 */
IntersectionObserver.prototype._hasCrossedThreshold =
    function(oldEntry, newEntry) {

  // To make comparing easier, an entry that has a ratio of 0
  // but does not actually intersect is given a value of -1
  var oldRatio = oldEntry && oldEntry.isIntersecting ?
      oldEntry.intersectionRatio || 0 : -1;
  var newRatio = newEntry.isIntersecting ?
      newEntry.intersectionRatio || 0 : -1;

  // Ignore unchanged ratios
  if (oldRatio === newRatio) return;

  for (var i = 0; i < this.thresholds.length; i++) {
    var threshold = this.thresholds[i];

    // Return true if an entry matches a threshold or if the new ratio
    // and the old ratio are on the opposite sides of a threshold.
    if (threshold == oldRatio || threshold == newRatio ||
        threshold < oldRatio !== threshold < newRatio) {
      return true;
    }
  }
};


/**
 * Returns whether or not the root element is an element and is in the DOM.
 * @return {boolean} True if the root element is an element and is in the DOM.
 * @private
 */
IntersectionObserver.prototype._rootIsInDom = function() {
  return !this.root || containsDeep(document, this.root);
};


/**
 * Returns whether or not the target element is a child of root.
 * @param {Element} target The target element to check.
 * @return {boolean} True if the target element is a child of root.
 * @private
 */
IntersectionObserver.prototype._rootContainsTarget = function(target) {
  var rootDoc =
    (this.root && (this.root.ownerDocument || this.root)) || document;
  return (
    containsDeep(rootDoc, target) &&
    (!this.root || rootDoc == target.ownerDocument)
  );
};


/**
 * Adds the instance to the global IntersectionObserver registry if it isn't
 * already present.
 * @private
 */
IntersectionObserver.prototype._registerInstance = function() {
  if (registry.indexOf(this) < 0) {
    registry.push(this);
  }
};


/**
 * Removes the instance from the global IntersectionObserver registry.
 * @private
 */
IntersectionObserver.prototype._unregisterInstance = function() {
  var index = registry.indexOf(this);
  if (index != -1) registry.splice(index, 1);
};


/**
 * Returns the result of the performance.now() method or null in browsers
 * that don't support the API.
 * @return {number} The elapsed time since the page was requested.
 */
function now() {
  return window.performance && performance.now && performance.now();
}


/**
 * Throttles a function and delays its execution, so it's only called at most
 * once within a given time period.
 * @param {Function} fn The function to throttle.
 * @param {number} timeout The amount of time that must pass before the
 *     function can be called again.
 * @return {Function} The throttled function.
 */
function throttle(fn, timeout) {
  var timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(function() {
        fn();
        timer = null;
      }, timeout);
    }
  };
}


/**
 * Adds an event handler to a DOM node ensuring cross-browser compatibility.
 * @param {Node} node The DOM node to add the event handler to.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to add.
 * @param {boolean} opt_useCapture Optionally adds the even to the capture
 *     phase. Note: this only works in modern browsers.
 */
function addEvent(node, event, fn, opt_useCapture) {
  if (typeof node.addEventListener == 'function') {
    node.addEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.attachEvent == 'function') {
    node.attachEvent('on' + event, fn);
  }
}


/**
 * Removes a previously added event handler from a DOM node.
 * @param {Node} node The DOM node to remove the event handler from.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to remove.
 * @param {boolean} opt_useCapture If the event handler was added with this
 *     flag set to true, it should be set to true here in order to remove it.
 */
function removeEvent(node, event, fn, opt_useCapture) {
  if (typeof node.removeEventListener == 'function') {
    node.removeEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.detatchEvent == 'function') {
    node.detatchEvent('on' + event, fn);
  }
}


/**
 * Returns the intersection between two rect objects.
 * @param {Object} rect1 The first rect.
 * @param {Object} rect2 The second rect.
 * @return {?Object|?ClientRect} The intersection rect or undefined if no
 *     intersection is found.
 */
function computeRectIntersection(rect1, rect2) {
  var top = Math.max(rect1.top, rect2.top);
  var bottom = Math.min(rect1.bottom, rect2.bottom);
  var left = Math.max(rect1.left, rect2.left);
  var right = Math.min(rect1.right, rect2.right);
  var width = right - left;
  var height = bottom - top;

  return (width >= 0 && height >= 0) && {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
    width: width,
    height: height
  } || null;
}


/**
 * Shims the native getBoundingClientRect for compatibility with older IE.
 * @param {Element} el The element whose bounding rect to get.
 * @return {DOMRect|ClientRect} The (possibly shimmed) rect of the element.
 */
function getBoundingClientRect(el) {
  var rect;

  try {
    rect = el.getBoundingClientRect();
  } catch (err) {
    // Ignore Windows 7 IE11 "Unspecified error"
    // https://github.com/w3c/IntersectionObserver/pull/205
  }

  if (!rect) return getEmptyRect();

  // Older IE
  if (!(rect.width && rect.height)) {
    rect = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };
  }
  return rect;
}


/**
 * Returns an empty rect object. An empty rect is returned when an element
 * is not in the DOM.
 * @return {ClientRect} The empty rect.
 */
function getEmptyRect() {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0
  };
}


/**
 * Ensure that the result has all of the necessary fields of the DOMRect.
 * Specifically this ensures that `x` and `y` fields are set.
 *
 * @param {?DOMRect|?ClientRect} rect
 * @return {?DOMRect}
 */
function ensureDOMRect(rect) {
  // A `DOMRect` object has `x` and `y` fields.
  if (!rect || 'x' in rect) {
    return rect;
  }
  // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
  // for internally calculated Rect objects. For the purposes of
  // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
  // for these fields.
  return {
    top: rect.top,
    y: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height
  };
}


/**
 * Inverts the intersection and bounding rect from the parent (frame) BCR to
 * the local BCR space.
 * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
 * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
 * @return {ClientRect} The local root bounding rect for the parent's children.
 */
function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
  var top = parentIntersectionRect.top - parentBoundingRect.top;
  var left = parentIntersectionRect.left - parentBoundingRect.left;
  return {
    top: top,
    left: left,
    height: parentIntersectionRect.height,
    width: parentIntersectionRect.width,
    bottom: top + parentIntersectionRect.height,
    right: left + parentIntersectionRect.width
  };
}


/**
 * Checks to see if a parent element contains a child element (including inside
 * shadow DOM).
 * @param {Node} parent The parent element.
 * @param {Node} child The child element.
 * @return {boolean} True if the parent node contains the child node.
 */
function containsDeep(parent, child) {
  var node = child;
  while (node) {
    if (node == parent) return true;

    node = getParentNode(node);
  }
  return false;
}


/**
 * Gets the parent node of an element or its host element if the parent node
 * is a shadow root.
 * @param {Node} node The node whose parent to get.
 * @return {Node|null} The parent node or null if no parent exists.
 */
function getParentNode(node) {
  var parent = node.parentNode;

  if (node.nodeType == /* DOCUMENT */ 9 && node != document) {
    // If this node is a document node, look for the embedding frame.
    return getFrameElement(node);
  }

  // If the parent has element that is assigned through shadow root slot
  if (parent && parent.assignedSlot) {
    parent = parent.assignedSlot.parentNode
  }

  if (parent && parent.nodeType == 11 && parent.host) {
    // If the parent is a shadow root, return the host element.
    return parent.host;
  }

  return parent;
}

/**
 * Returns true if `node` is a Document.
 * @param {!Node} node
 * @returns {boolean}
 */
function isDoc(node) {
  return node && node.nodeType === 9;
}


// Exposes the constructors globally.
window.IntersectionObserver = IntersectionObserver;
window.IntersectionObserverEntry = IntersectionObserverEntry;

}());
 // подключаем полифилл для полной работоспособности данного API

class Intersection {
    static observerOptions = {
        threshold: 0.5 // при каком объеме обхвата блока будет сработан слушатель
    };

    static animObserverCallback(entries) { // callback функция с настройками
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains(entry.target.dataset.animation)) {
                    entry.target.classList.add(entry.target.dataset.animation);
                }
            }
        });
    }

    static animObserver = new IntersectionObserver(this.animObserverCallback, this.observerOptions);

    static initAnimEvents() {
        document.querySelectorAll("[data-animation]").forEach(item => {

            this.animObserver.observe(item); // закидываем слушателя на все необходимые элементы

            item.addEventListener("mouseenter", function(e) { // вешаем событие на наведение мыши (доп. функционал)
                item.classList.remove(item.dataset.animation);
                setTimeout(() => {
                    item.classList.add(item.dataset.animation);
                }, 70);
            });
        });
    }
}

Intersection.initAnimEvents();

class ContentSelect {
    static selectList = document.querySelectorAll("[data-contentSelect]");
    static activeId = 0; // id активного пункта

    static filterRadioAttributes(attributes) { // из NamedNodeMap возвращает массив имен атрибутов, кроме class
        return [...attributes].map(elem => elem.name).filter(elem => elem !== "class"); // возвращает 
    }

    static createElemContainer(elemName) {
        let elem = document.createElement("div");

        elem.classList.add(`contentSelect__${elemName}`);
        elem.classList.add("contentSelect__container");
        return elem;
    }

    static createRadioInput(name, attributes) {
        let input = document.createElement("input");

        input.setAttribute("type", "radio");
        input.setAttribute("name", name);
        
        input.classList.add("contentSelect__radio");
        input.classList.add("visually-hidden");

        attributes.forEach(attr => {
            input.setAttribute(attr, "")
        });

        return input;
    }

    static createMarkup() {
        this.selectList.forEach(select => {
            let body = this.createElemContainer("body");
            let header = this.createElemContainer("header");

            let itemList = select.querySelectorAll(".contentSelect__item");
            let icon = select.querySelector(".contentSelect__icon");

            header.appendChild(icon);

            select.innerHTML = "";

            itemList.forEach((item, id) => {
                let itemClone = item.cloneNode(true);

                let label = document.createElement("label");
                label.classList.add("contentSelect__label");

                if (item.hasAttribute("checked")) { // по атрибуту checked получает id активного выделенного пункта
                    this.activeId = id;
                }

                let input = this.createRadioInput(select.dataset.contentselect, this.filterRadioAttributes(item.attributes));

                label.appendChild(input);
                label.appendChild(item);

                header.appendChild(itemClone);
                body.appendChild(label);
            })

            select.appendChild(header);
            select.appendChild(body);

            placeElemPositionY(body, "contentSelect__body--top"); // ставим менюшку сверху или снизу


        });
    }

    static initEvents() {
        this.selectList.forEach(select => {

            let selectHeader = select.querySelector(".contentSelect__header");
            let radioList = select.querySelectorAll(".contentSelect__radio");
            let contentList = selectHeader.querySelectorAll(".contentSelect__item");

            radioList.forEach((radio, id) => {
                radio.addEventListener("change", () => {
                    contentList[this.activeId].removeAttribute("checked");
                    this.activeId = id;
                    contentList[id].setAttribute("checked", "");
                    select.toggleAttribute("open");
                });
            });

            selectHeader.addEventListener("click", () => {
                select.toggleAttribute("open");
            });
            
        });
    }
}

ContentSelect.createMarkup();
ContentSelect.initEvents();
let swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 0,
    grabCursor: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
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
            slidesPerView: 4
        }
    }
});
class MainSlider {
    static fadeSpeed = 600;
    static slideDelay = 5000;
    static slideBar = document.querySelector(".main__top .main__timer");
    static radioSelector = document.querySelectorAll(".gameSelector .gameSelector__radio");

    static productBtnLink = document.querySelector(".main__top .main__buttonProduct");
    static productLinks = document.querySelectorAll(".main__slider [data-link]");

    static mainSlider;
    static mainGameSlider;
    static mainStatusSlider;

    static updateSlideLink(index) {
        let productLink = this.productLinks[index];
        if (productLink !== undefined) {
            this.productBtnLink.setAttribute("href", productLink.dataset.link);
        }
    }

    static updateSlideBar(index, isFirst) {
        this.slideBar.innerHTML = "";

        let slideBarProgress = document.createElement("div");
        slideBarProgress.classList.add("main__timerBar");
        slideBarProgress.setAttribute("style", `transition: ${isFirst ? this.slideDelay : this.slideDelay + 500}ms linear`);
        this.slideBar.appendChild(slideBarProgress);

        if (this.radioSelector[index] !== undefined) {
            this.radioSelector[index].checked = true; // переключить радио переключатель (под основным слайдером)
        }

        setTimeout(() => {
            slideBarProgress.classList.add("main__timerBar--fill");
        }, 10);
    }

    static initRadioSelector() { // инициализируем радио кнопки игр под основным слайдером
        this.radioSelector.forEach((radio, id) => {
            radio.addEventListener("change", () => {
                this.mainSlider.slideTo(id, this.fadeSpeed, true);
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
                        this.updateSlideLink(this.mainSlider.realIndex);
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
            this.updateSlideLink(this.mainSlider.realIndex);
            this.initRadioSelector();
        }
    }
}

MainSlider.initEvents();

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

modalGameBuyRadio.forEach((radio, id) => {
    if (id === 0) { // стартовая инициализация данных в футере модалки
        updateProductModalInfo(radio);
    }

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