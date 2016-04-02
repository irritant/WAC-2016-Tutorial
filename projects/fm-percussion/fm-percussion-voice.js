function FMPercussionVoice(context, noiseOptions) {
	var _voice = this;

	_voice.output = context.createGain();
	_voice.output.gain.value = 1.0;
	
	_voice.tone1 = new FMPercussionTone(context);
	_voice.tone1.output.connect(_voice.output);

	_voice.tone2 = new FMPercussionTone(context);
	_voice.tone2.output.connect(_voice.output);
	
	_voice.noise = new FMPercussionNoise(context, noiseOptions);
	_voice.noise.output.connect(_voice.output);

	_voice.play = function() {
		_voice.tone1.play();
		_voice.tone2.play();
		_voice.noise.play();
	};
}