function SubPercussionNoise(context, options) {
	_noise = this

	// Noise generator:
	_noise.generator = new WebNoise(context);
	_noise.generator.configureNode(options);

	// Filter:
	_noise.filter = context.createBiquadFilter();
	_noise.filter.type = 'lowpass';
	_noise.filter.frequency.value = 5000.0;
	_noise.filter.Q.value = 1.0;

	// Filter Frequency Envelope
	_noise.filterEnvelope = new AttackDecayEnvelope(context, _noise.filter.frequency);
	_noise.filterEnvelope.attackTime = 0.0;
	_noise.filterEnvelope.decayTime = 0.1;
	_noise.filterEnvelope.startValue = 5000.0;
	_noise.filterEnvelope.peakValue = 5000.0;
	_noise.filterEnvelope.endValue = 2000.0;

	// Level
	_noise.level = context.createGain();
	_noise.level.gain.value = 0.0;

	// Level Gain Envelope
	_noise.levelEnvelope = new AttackDecayEnvelope(context, _noise.level.gain);
	_noise.levelEnvelope.attackTime = 0.01;
	_noise.levelEnvelope.decayTime = 0.5;

	// Output
	_noise.output = context.createGain();
	_noise.output.gain.value = 1.0;

	// Connections:
	_noise.generator.node.connect(_noise.filter);
	_noise.filter.connect(_noise.level);
	_noise.level.connect(_noise.output);

	_noise.play = function() {
		_noise.filterEnvelope.play();
		_noise.levelEnvelope.play();
	};

}