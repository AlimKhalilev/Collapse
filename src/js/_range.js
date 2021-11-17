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