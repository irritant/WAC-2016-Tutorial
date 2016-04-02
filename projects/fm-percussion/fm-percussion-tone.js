function FMPercussionTone(context) {
	var _tone = this;

	// Modulator Oscillator
	_tone.modulator = context.createOscillator();
	_tone.modulator.type = 'sine';
	_tone.modulator.frequency.value = 200.0;
	_tone.modulator.start();

	// Modulator Oscillator Frequency Envelope
	_tone.modulatorEnvelope = new AttackDecayEnvelope(context, _tone.modulator.frequency);
	_tone.modulatorEnvelope.attackTime = 0.0;
	_tone.modulatorEnvelope.decayTime = 0.1;
	_tone.modulatorEnvelope.startValue = 800.0;
	_tone.modulatorEnvelope.peakValue = 800.0;
	_tone.modulatorEnvelope.endValue = 200.0;

	// Modulator Depth
	_tone.modulatorDepth = context.createGain();
	_tone.modulatorDepth.gain.value = 0.0;

	// Modulator Depth Gain Envelope
	_tone.modDepthEnvelope = new AttackDecayEnvelope(context, _tone.modulatorDepth.gain);
	_tone.modDepthEnvelope.attackTime = 0.0;
	_tone.modDepthEnvelope.decayTime = 0.1;
	_tone.modDepthEnvelope.startValue = 0.0;
	_tone.modDepthEnvelope.peakValue = 0.0;
	_tone.modDepthEnvelope.endValue = 0.0;

	// Carrier Oscillator
	_tone.carrier = context.createOscillator();
	_tone.carrier.type = 'sine';
	_tone.carrier.frequency.value = 200.0;
	_tone.carrier.start();

	// Carrier Oscillator Frequency Envelope
	_tone.carrierEnvelope = new AttackDecayEnvelope(context, _tone.carrier.frequency);
	_tone.carrierEnvelope.attackTime = 0.0;
	_tone.carrierEnvelope.decayTime = 0.1;
	_tone.carrierEnvelope.startValue = 800.0;
	_tone.carrierEnvelope.peakValue = 800.0;
	_tone.carrierEnvelope.endValue = 200.0;

	// Filter:
	_tone.filter = context.createBiquadFilter();
	_tone.filter.type = 'lowpass';
	_tone.filter.frequency.value = 2000.0;
	_tone.filter.Q.value = 1.0;

	// Filter Frequency Envelope
	_tone.filterEnvelope = new AttackDecayEnvelope(context, _tone.filter.frequency);
	_tone.filterEnvelope.attackTime = 0.0;
	_tone.filterEnvelope.decayTime = 0.5;
	_tone.filterEnvelope.startValue = 2000.0;
	_tone.filterEnvelope.peakValue = 2000.0;
	_tone.filterEnvelope.endValue = 500.0;

	// Level
	_tone.level = context.createGain();
	_tone.level.gain.value = 0.0;

	// Level Gain Envelope
	_tone.levelEnvelope = new AttackDecayEnvelope(context, _tone.level.gain);
	_tone.levelEnvelope.attackTime = 0.01;
	_tone.levelEnvelope.decayTime = 0.5;

	// Output
	_tone.output = context.createGain();
	_tone.output.gain.value = 1.0;

	// Connections:
	_tone.modulator.connect(_tone.modulatorDepth);
	_tone.modulatorDepth.connect(_tone.carrier.frequency);
	_tone.carrier.connect(_tone.filter);
	_tone.filter.connect(_tone.level);
	_tone.level.connect(_tone.output);

	_tone.play = function() {
		_tone.modulatorEnvelope.play();
		_tone.modDepthEnvelope.play();
		_tone.carrierEnvelope.play();
		_tone.filterEnvelope.play();
		_tone.levelEnvelope.play();
	};

}