function UIBindings() {
	var _instance = this;

	_instance.bindAudioParamInput = function(selector, param) {
		var element = document.querySelector(selector);
		element.value = param.value;
		element.addEventListener('input', function(e) {
			param.value = e.target.value;
		});
	};

	_instance.bindGainParamInput = function(selector, param) {
		var element = document.querySelector(selector);
		element.value = param.value;
		element.addEventListener('input', function(e) {
			param.value = Math.pow(parseFloat(e.target.value), 0.6);
		});
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
		});
	};

	_instance.bindBooleanPropertyInput = function(selector, object, property) {
		var element = document.querySelector(selector);
		element.checked = object[property];
		element.addEventListener('bindTypeParamInput', function(e) {
			object[property] = e.target.checked;
		});
	};

}