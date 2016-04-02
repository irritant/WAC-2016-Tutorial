function SubPercussionTone(context) {
	var _tone = this;

	// Oscillator
	_tone.oscillator = context.createOscillator();
	_tone.oscillator.type = 'sawtooth';
	_tone.oscillator.frequency.value = 200.0;
	_tone.oscillator.start();

	// Oscillator Frequency Envelope
	_tone.oscEnvelope = new AttackDecayEnvelope(context, _tone.oscillator.frequency);
	_tone.oscEnvelope.attackTime = 0.0;
	_tone.oscEnvelope.decayTime = 0.1;
	_tone.oscEnvelope.startValue = 800.0;
	_tone.oscEnvelope.peakValue = 800.0;
	_tone.oscEnvelope.endValue = 200.0;

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
	_tone.oscillator.connect(_tone.filter);
	_tone.filter.connect(_tone.level);
	_tone.level.connect(_tone.output);

	_tone.play = function() {
		_tone.oscEnvelope.play();
		_tone.filterEnvelope.play();
		_tone.levelEnvelope.play();
	};

}