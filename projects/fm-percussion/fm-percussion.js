window.addEventListener('load', function(e) {

	// Obtain a new audio context:
	var context = null;
	if (typeof window.AudioContext != 'undefined') {
		context = new AudioContext();
	} else if (typeof window.webkitAudioContext != 'undefined') {
		context = new webkitAudioContext();
	}

	if (!context) {
		alert('Web Audio API is not supported.');
		return;
	}

	window.voice = new FMPercussionVoice(context);
	window.voice.output.connect(context.destination);
	window.voice.output.gain.value = 0.5;

	// Configure voice paramters...

	// Tone 1 Modulator:
	window.voice.tone1.modulator.type = 'sine';
	window.voice.tone1.modulatorEnvelope.attackTime = 0.0;
	window.voice.tone1.modulatorEnvelope.decayTime = 0.5;
	window.voice.tone1.modulatorEnvelope.peakValue = 300.0;
	window.voice.tone1.modulatorEnvelope.endValue = 270.0;
	window.voice.tone1.modulatorEnvelope.exponential = true;

	// Tone 1 Modulator Depth Envelope
	window.voice.tone1.modDepthEnvelope.attackTime = 0.0;
	window.voice.tone1.modDepthEnvelope.decayTime = 0.5;
	window.voice.tone1.modDepthEnvelope.startValue = 1000.0;
	window.voice.tone1.modDepthEnvelope.peakValue = 1000.0;
	window.voice.tone1.modDepthEnvelope.endValue = 500.0;

	// Tone 1 Carrier:
	window.voice.tone1.carrier.type = 'sine';
	window.voice.tone1.carrierEnvelope.attackTime = 0.0;
	window.voice.tone1.carrierEnvelope.decayTime = 0.5;
	window.voice.tone1.carrierEnvelope.peakValue = 100.0;
	window.voice.tone1.carrierEnvelope.endValue = 90.0;
	window.voice.tone1.carrierEnvelope.exponential = true;

	// Tone 1 Filter:
	window.voice.tone1.filter.type = 'lowpass';
	window.voice.tone1.filter.Q.value = 0.5;

	// Tone 1 Filter Envelope
	window.voice.tone1.filterEnvelope.attackTime = 0.0;
	window.voice.tone1.filterEnvelope.decayTime = 0.5;
	window.voice.tone1.filterEnvelope.startValue = 2000.0;
	window.voice.tone1.filterEnvelope.peakValue = 2000.0;
	window.voice.tone1.filterEnvelope.endValue = 1000.0;

	// Tone 1 Level Envelope:
	window.voice.tone1.levelEnvelope.attackTime = 0.01;
	window.voice.tone1.levelEnvelope.decayTime = 0.5;
	window.voice.tone1.levelEnvelope.startValue = 0.0;
	window.voice.tone1.levelEnvelope.peakValue = 1.0;
	window.voice.tone1.levelEnvelope.endValue = 0.0;
	window.voice.tone1.levelEnvelope.exponential = true;

	// Tone 1 Output:
	window.voice.tone1.output.gain.value = 0.3;

	// Tone 2 Modulator:
	window.voice.tone2.modulator.type = 'sine';
	window.voice.tone2.modulatorEnvelope.attackTime = 0.0;
	window.voice.tone2.modulatorEnvelope.decayTime = 0.1;
	window.voice.tone2.modulatorEnvelope.peakValue = 300.0;
	window.voice.tone2.modulatorEnvelope.endValue = 150.0;
	window.voice.tone2.modulatorEnvelope.exponential = true;

	// Tone 2 Modulator Depth Envelope
	window.voice.tone2.modDepthEnvelope.attackTime = 0.0;
	window.voice.tone2.modDepthEnvelope.decayTime = 0.1;
	window.voice.tone2.modDepthEnvelope.startValue = 2000.0;
	window.voice.tone2.modDepthEnvelope.peakValue = 2000.0;
	window.voice.tone2.modDepthEnvelope.endValue = 1000.0;

	// Tone 2 Carrier:
	window.voice.tone2.carrier.type = 'sine';
	window.voice.tone2.carrierEnvelope.attackTime = 0.0;
	window.voice.tone2.carrierEnvelope.decayTime = 0.1;
	window.voice.tone2.carrierEnvelope.peakValue = 400.0;
	window.voice.tone2.carrierEnvelope.endValue = 200.0;
	window.voice.tone2.carrierEnvelope.exponential = true;

	// Tone 2 Filter:
	window.voice.tone2.filter.type = 'lowpass';
	window.voice.tone2.filter.Q.value = 3.0;

	// Tone 2 Filter Envelope
	window.voice.tone2.filterEnvelope.attackTime = 0.0;
	window.voice.tone2.filterEnvelope.decayTime = 0.5;
	window.voice.tone2.filterEnvelope.startValue = 2000.0;
	window.voice.tone2.filterEnvelope.peakValue = 2000.0;
	window.voice.tone2.filterEnvelope.endValue = 1000.0;

	// Tone 2 Level Envelope:
	window.voice.tone2.levelEnvelope.attackTime = 0.01;
	window.voice.tone2.levelEnvelope.decayTime = 0.25;
	window.voice.tone2.levelEnvelope.startValue = 0.0;
	window.voice.tone2.levelEnvelope.peakValue = 1.0;
	window.voice.tone2.levelEnvelope.endValue = 0.0;
	window.voice.tone2.levelEnvelope.exponential = true;

	// Tone 2 Output:
	window.voice.tone2.output.gain.value = 0.3;

	// Noise Generator:
	window.voice.noise.generator.blockSize(4);

	// Noise Filter:
	window.voice.noise.filter.type = 'lowpass';
	window.voice.noise.filter.Q.value = 1.0;

	// Noise Filter Envelope:
	window.voice.noise.filterEnvelope.attackTime = 0.0;
	window.voice.noise.filterEnvelope.decayTime = 0.25;
	window.voice.noise.filterEnvelope.startValue = 8000.0;
	window.voice.noise.filterEnvelope.peakValue = 8000.0;
	window.voice.noise.filterEnvelope.endValue = 4000.0;
	window.voice.noise.filterEnvelope.exponential = true;

	// Noise Level Envelope:
	window.voice.noise.levelEnvelope.attackTime = 0.01;
	window.voice.noise.levelEnvelope.decayTime = 0.5;
	window.voice.noise.levelEnvelope.startValue = 0.0;
	window.voice.noise.levelEnvelope.peakValue = 1.0;
	window.voice.noise.levelEnvelope.endValue = 0.0;
	window.voice.noise.levelEnvelope.exponential = true;

	// Noise Output:
	window.voice.noise.output.gain.value = 0.3;

	// Configure mouse event listeners:
	document.getElementById('trigger').addEventListener('click', function() {
		window.voice.play();
	});

	document.addEventListener('keyup', function(e) {
		if (e.which === 84) { // t key
			window.voice.play();
		}
	});

	configureUIBindings();

});

function configureUIBindings() {

	var bindings = new UIBindings();

	// Output UI Binding:
	bindings.bindGainParamInput('input[name="output.gain"]', window.voice.output.gain);

	// Tone 1 UI Bindings:

	// Tone 1 Modulator UI Bindings:
	bindings.bindTypeParamInput('input[name="tone1.modulator.type"]', window.voice.tone1.modulator);
	bindings.bindNumericPropertyInput('input[name="tone1.modulatorEnvelope.decayTime"]', window.voice.tone1.modulatorEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone1.modulatorEnvelope.peakValue"]', window.voice.tone1.modulatorEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="tone1.modulatorEnvelope.endValue"]', window.voice.tone1.modulatorEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="tone1.modulatorEnvelope.exponential"]', window.voice.tone1.modulatorEnvelope, 'exponential');

	// Tone 1 Modulator Depth UI Bindings:
	bindings.bindNumericPropertyInput('input[name="tone1.modDepthEnvelope.decayTime"]', window.voice.tone1.modDepthEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone1.modDepthEnvelope.peakValue"]', window.voice.tone1.modDepthEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="tone1.modDepthEnvelope.endValue"]', window.voice.tone1.modDepthEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="tone1.modDepthEnvelope.exponential"]', window.voice.tone1.modDepthEnvelope, 'exponential');

	// Tone 1 Carrier UI Bindings:
	bindings.bindTypeParamInput('input[name="tone1.carrier.type"]', window.voice.tone1.carrier);
	bindings.bindNumericPropertyInput('input[name="tone1.carrierEnvelope.decayTime"]', window.voice.tone1.carrierEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone1.carrierEnvelope.peakValue"]', window.voice.tone1.carrierEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="tone1.carrierEnvelope.endValue"]', window.voice.tone1.carrierEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="tone1.carrierEnvelope.exponential"]', window.voice.tone1.carrierEnvelope, 'exponential');

	// Tone 1 Filter UI Bindings:
	bindings.bindTypeParamInput('input[name="tone1.filter.type"]', window.voice.tone1.filter);
	bindings.bindAudioParamInput('input[name="tone1.filter.Q"]', window.voice.tone1.filter.Q);
	bindings.bindNumericPropertyInput('input[name="tone1.filterEnvelope.decayTime"]', window.voice.tone1.filterEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone1.filterEnvelope.peakValue"]', window.voice.tone1.filterEnvelope, 'startValue'); // Lock startValue to peakValue
	bindings.bindNumericPropertyInput('input[name="tone1.filterEnvelope.peakValue"]', window.voice.tone1.filterEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="tone1.filterEnvelope.endValue"]', window.voice.tone1.filterEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="tone1.filterEnvelope.exponential"]', window.voice.tone1.filterEnvelope, 'exponential');

	// Tone 1 Level UI Bindings:
	bindings.bindNumericPropertyInput('input[name="tone1.levelEnvelope.decayTime"]', window.voice.tone1.levelEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone1.levelEnvelope.peakValue"]', window.voice.tone1.levelEnvelope, 'peakValue');
	bindings.bindBooleanPropertyInput('input[name="tone1.levelEnvelope.exponential"]', window.voice.tone1.levelEnvelope, 'exponential');

	// Tone 2 UI Bindings:

	// Tone 1 Modulator UI Bindings:
	bindings.bindTypeParamInput('input[name="tone2.modulator.type"]', window.voice.tone2.modulator);
	bindings.bindNumericPropertyInput('input[name="tone2.modulatorEnvelope.decayTime"]', window.voice.tone2.modulatorEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone2.modulatorEnvelope.peakValue"]', window.voice.tone2.modulatorEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="tone2.modulatorEnvelope.endValue"]', window.voice.tone2.modulatorEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="tone2.modulatorEnvelope.exponential"]', window.voice.tone2.modulatorEnvelope, 'exponential');

	// Tone 1 Modulator Depth UI Bindings:
	bindings.bindNumericPropertyInput('input[name="tone2.modDepthEnvelope.decayTime"]', window.voice.tone2.modDepthEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone2.modDepthEnvelope.peakValue"]', window.voice.tone2.modDepthEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="tone2.modDepthEnvelope.endValue"]', window.voice.tone2.modDepthEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="tone2.modDepthEnvelope.exponential"]', window.voice.tone2.modDepthEnvelope, 'exponential');

	// Tone 1 Carrier UI Bindings:
	bindings.bindTypeParamInput('input[name="tone2.carrier.type"]', window.voice.tone2.carrier);
	bindings.bindNumericPropertyInput('input[name="tone2.carrierEnvelope.decayTime"]', window.voice.tone2.carrierEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone2.carrierEnvelope.peakValue"]', window.voice.tone2.carrierEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="tone2.carrierEnvelope.endValue"]', window.voice.tone2.carrierEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="tone2.carrierEnvelope.exponential"]', window.voice.tone2.carrierEnvelope, 'exponential');

	// Tone 2 Filter UI Bindings:
	bindings.bindTypeParamInput('input[name="tone2.filter.type"]', window.voice.tone2.filter);
	bindings.bindAudioParamInput('input[name="tone2.filter.Q"]', window.voice.tone2.filter.Q);
	bindings.bindNumericPropertyInput('input[name="tone2.filterEnvelope.decayTime"]', window.voice.tone2.filterEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone2.filterEnvelope.peakValue"]', window.voice.tone2.filterEnvelope, 'startValue'); // Lock startValue to peakValue
	bindings.bindNumericPropertyInput('input[name="tone2.filterEnvelope.peakValue"]', window.voice.tone2.filterEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="tone2.filterEnvelope.endValue"]', window.voice.tone2.filterEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="tone2.filterEnvelope.exponential"]', window.voice.tone2.filterEnvelope, 'exponential');

	// Tone 2 Level UI Bindings:
	bindings.bindNumericPropertyInput('input[name="tone2.levelEnvelope.decayTime"]', window.voice.tone2.levelEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="tone2.levelEnvelope.peakValue"]', window.voice.tone2.levelEnvelope, 'peakValue');
	bindings.bindBooleanPropertyInput('input[name="tone2.levelEnvelope.exponential"]', window.voice.tone2.levelEnvelope, 'exponential');

	// Noise UI Bindings:

	// Noise Generator UI Bindings:
	bindings.bindNumericPropertyInput('input[name="noise.generator.blockSize"]', window.voice.noise.generator, 'blockSize');

	// Noise Filter UI Bindings:
	bindings.bindTypeParamInput('input[name="noise.filter.type"]', window.voice.noise.filter);
	bindings.bindAudioParamInput('input[name="noise.filter.Q"]', window.voice.noise.filter.Q);
	bindings.bindNumericPropertyInput('input[name="noise.filterEnvelope.decayTime"]', window.voice.noise.filterEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="noise.filterEnvelope.peakValue"]', window.voice.noise.filterEnvelope, 'startValue'); // Lock startValue to peakValue
	bindings.bindNumericPropertyInput('input[name="noise.filterEnvelope.peakValue"]', window.voice.noise.filterEnvelope, 'peakValue');
	bindings.bindNumericPropertyInput('input[name="noise.filterEnvelope.endValue"]', window.voice.noise.filterEnvelope, 'endValue');
	bindings.bindBooleanPropertyInput('input[name="noise.filterEnvelope.exponential"]', window.voice.noise.filterEnvelope, 'exponential');

	// Noise Level UI Bindings:
	bindings.bindNumericPropertyInput('input[name="noise.levelEnvelope.decayTime"]', window.voice.noise.levelEnvelope, 'decayTime');
	bindings.bindNumericPropertyInput('input[name="noise.levelEnvelope.peakValue"]', window.voice.noise.levelEnvelope, 'peakValue');
	bindings.bindBooleanPropertyInput('input[name="noise.levelEnvelope.exponential"]', window.voice.noise.levelEnvelope, 'exponential');

}