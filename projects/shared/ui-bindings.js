function UIBindings() {
	var _instance = this;

	_instance.bindAudioParamInput = function(selector, param) {
		var element = document.querySelector(selector);
		element.value = param.value;
		element.addEventListener('input', function(e) {
			param.value = e.target.value;
			_instance.updateValueDisplayForInput(element);
		});

		_instance.bindValueDisplayForAudioParamInput(element, param);
	};

	_instance.bindGainParamInput = function(selector, param) {
		var element = document.querySelector(selector);
		element.value = param.value;
		element.addEventListener('input', function(e) {
			param.value = _instance.calculateGainValue(e.target.value);
			_instance.updateValueDisplayForInput(element);
		});

		_instance.bindValueDisplayForGainParamInput(element, param);
	};

	_instance.bindTypeParamInput = function(selector, param) {
		var elements = document.querySelectorAll(selector);
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			element.checked = (element.value == param.type);
			element.addEventListener('change', function(e) {
				param.type = e.target.value;
			});
		}
	};

	_instance.bindNumericPropertyInput = function(selector, object, property) {
		var element = document.querySelector(selector);

		if (typeof object[property] === 'function') {
			element.value = object[property]();
		} else {
			element.value = object[property];
		}

		element.addEventListener('input', function(e) {
			var value = parseFloat(e.target.value);

			if (typeof object[property] === 'function') {
				object[property](value);
			} else {
				object[property] = value;
			}

			_instance.updateValueDisplayForInput(element);
		});

		_instance.bindValueDisplayForNumericPropertyInput(element, object, property);
	};

	_instance.bindBooleanPropertyInput = function(selector, object, property) {
		var element = document.querySelector(selector);
		element.checked = object[property];
		element.addEventListener('bindTypeParamInput', function(e) {
			object[property] = e.target.checked;
		});
	};

	_instance.bindValueDisplayForAudioParamInput = function(inputElement, param) {
		var parentElement = inputElement.parentNode;
		if (parentElement.classList.contains('input-group')) {
			var valueElement = parentElement.querySelector('.value-display');
			if (valueElement) {
				valueElement.value = _instance.clampValueToRangeOfInput(inputElement, param.value);

				valueElement.addEventListener('blur', function(e) {
					e.target.value = _instance.clampValueToRangeOfInput(inputElement, e.target.value);
					param.value = e.target.value;
					_instance.updateInputForValueDisplay(valueElement);
				});

				valueElement.addEventListener('keyup', function(e) {
					if (e.which === 13) {
						e.target.blur();
					}
				});
			}
		}
	};

	_instance.bindValueDisplayForGainParamInput = function(inputElement, param) {
		var parentElement = inputElement.parentNode;
		if (parentElement.classList.contains('input-group')) {
			var valueElement = parentElement.querySelector('.value-display');
			if (valueElement) {
				valueElement.value = param.value;

				valueElement.addEventListener('blur', function(e) {
					e.target.value = _instance.clampValueToRangeOfInput(inputElement, e.target.value);
					param.value = _instance.calculateGainValue(e.target.value);
					_instance.updateInputForValueDisplay(valueElement);
				});

				valueElement.addEventListener('keyup', function(e) {
					if (e.which === 13) {
						e.target.blur();
					}
				});
			}
		}
	};

	_instance.bindValueDisplayForNumericPropertyInput = function(inputElement, object, property) {
		var parentElement = inputElement.parentNode;
		if (parentElement.classList.contains('input-group')) {
			var valueElement = parentElement.querySelector('.value-display');
			if (valueElement) {

				if (typeof object[property] === 'function') {
					valueElement.value = _instance.clampValueToRangeOfInput(inputElement, object[property]());
				} else {
					valueElement.value = _instance.clampValueToRangeOfInput(inputElement, object[property]);
				}

				valueElement.addEventListener('blur', function(e) {
					e.target.value = _instance.clampValueToRangeOfInput(inputElement, e.target.value);

					if (typeof object[property] === 'function') {
						object[property](parseFloat(e.target.value));
					} else {
						object[property] = parseFloat(e.target.value);
					}

					_instance.updateInputForValueDisplay(valueElement);
				});

				valueElement.addEventListener('keyup', function(e) {
					if (e.which === 13) {
						e.target.blur();
					}
				});
			}
		}
	};

	_instance.updateValueDisplayForInput = function(inputElement) {
		var parentElement = inputElement.parentNode;
		if (parentElement.classList.contains('input-group')) {
			var valueElement = parentElement.querySelector('.value-display');
			if (valueElement) {
				valueElement.value = _instance.roundValue(inputElement.value);
			}
		}
	};

	_instance.updateInputForValueDisplay = function(valueElement) {
		var parentElement = valueElement.parentNode;
		if (parentElement.classList.contains('input-group')) {
			var inputElement = parentElement.querySelector('input:not(.value-display)');
			if (inputElement) {
				inputElement.value = valueElement.value;
			}
		}
	};

	_instance.clampValueToRangeOfInput = function(inputElement, value) {
		var min = parseFloat(inputElement.getAttribute('min'));
		var max = parseFloat(inputElement.getAttribute('max'));
		if (!isNaN(max) && value > max) {
			return max;
		} else if (!isNaN(min) && value < min) {
			return min;
		} else {
			return parseFloat(value);
		}
	};

	_instance.calculateGainValue = function(value) {
		if (value > 1.0) {
			value = 1.0;
		} else if (value < 0.0) {
			value = 0.0;
		} else {
			value = Math.pow(parseFloat(value), 0.6);
		}
		return _instance.roundValue(value);
	};

	_instance.roundValue = function(value) {
		return parseFloat(Math.round(value * 100) / 100);
	};

}