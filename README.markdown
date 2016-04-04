# Introduction to Percussion Synthesis Using Web Audio
Tony Wallace, Irritant Creative Inc.  
Web Audio Conference 2016, Atlanta

This tutorial will introduce the basics of web audio programming by writing code to synthesize simple percussion sounds. Basic familiarity with JavaScript is assumed.

# 1. Basic Concepts

## 1.1 The Audio Graph

Audio systems are usually comprised of several interconnected subsystems, or nodes. The connections between nodes can be described by an _audio graph_. The audio graph for a very simple synthesizer might look something like this:

![Basic synth audio graph](images/audio-graph-1.png)
    
We can also expand the graph to include controllers and modulators:

![Complex synth audio graph](images/audio-graph-2.png)

The audio graph is similar to a modular synthesizer or a guitarist's pedalboard. It provides an easy way to visualize a complex system as a collection of smaller, simpler units, each with its own inputs and outputs. The audio graph is a central concept in Web Audio and many other audio programming environments.

## 1.2 The AudioContext Object

Each audio graph is represented by an  [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) object. The AudioContext coordinates many of the graph's global properties, like the sample rate and current time. It is also responsible for rendering via the `destination` property.

You will normally use a single AudioContext to describe your system. Creating the context is easy:

    var context = new AudioContext();
    
Webkit browsers require a vendor-prefixed constructor, so we can redefine AudioContext to improve support across browsers:

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    
That will cover modern browsers, but let's show some consideration for the few people who might try to use our project with an older browser that doesn't support Web Audio:

    function createAudioContext() {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext === undefined) {
        return null;
      } else {
        return new AudioContext();
      }
    }

The function above will return an AudioContext object, or `null` if the browser doesn't support either the standard or vendor-prefixed constructor. We can use it like this:

    var context = createAudioContext();
    if (!context) {
      alert('Sorry, your browser doesn't support Web Audio.');
      return;
    }

If `createAudioContext()` returns null, we can deliver the sad news to our visitor and return to halt execution. Otherwise, we can start building our graph.

## 1.3 AudioNode Objects

[AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode) objects are the basic building blocks of an audio graph. Each module in the synthesizer graph we looked at before can be represented by a type of AudioNode:

![AudioNode graph](images/audio-graph-3.png)

AudioNodes are created by calling methods on the AudioContext and connected to each other via the `connect()` method. The graph shown above can be represented by the following code:

    // Create an AudioContext using the function we declared earlier:
    var context = createAudioContext();
    
    // Request an OscillatorNode, a BiquadFilterNode, and a GainNode from the AudioContext:
    var oscillator = context.createOscillator();
    var filter = context.createBiquadFilter();
    var amplifier = context.createGain();
    
    // Connect the OscillatorNode to the BiquadFilterNode, and connect the BiquadFilterNode to the GainNode:
    oscillator.connect(filter);
    filter.connect(amplifier);
    
    // Connect the GainNode to the AudioContext's destination:
    amplifier.connect(context.destination);
    
    // Start the OscillatorNode:
    oscillator.start();

Connections between AudioNodes are always made in the order `source.connect(destination)`. The final node in your graph will usually be the AudioContext's `destination` property, which represents your computer's audio output.

The Web Audio API includes a wide variety of nodes to generate, capture and process audio signals. We'll use several of them during the course of this tutorial. I encourage you to explore the ones we don't use on your own.

## 1.4 AudioParam Objects

AudioParam objects provide the interface through which we control our AudioNodes. You can set the value of an AudioParam to a constant value by assigning its `value` property:

    oscillator.frequency.value = 440.0;
    
In the example above, `oscillator` is an OscillatorNode and `frequency` is the AudioParam that controls its frequency. Always assign to the `value` parameter, not directly to the AudioParam. The following will not work:

    oscillator.frequency = 440.0; // Does nothing!
    
Of course, you can also assign a variable or the return value of a function to the `value` property:

    var freq = 440.0;
    oscillator.frequency.value = freq;

...or...

    var freq = calculateFrequency();
    oscillator.frequency.value = freq;

AudioNodes are also potential control sources for AudioParams. This is a very powerful concept that enables many modulation techniques, from simple vibrato and tremolo effects to FM synthesis. Here is a graph that uses a low-frequency oscillator to control a gain node, creating a tremolo effect:

    // Create an AudioContext using the function we declared earlier:
    var context = createAudioContext();
    
    // Request two OscillatorNodes from the AudioContext, one for the signal and one for the LFO:
    var oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440.0;
    
    var lfo = context.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 440.0;
    
    // Request two GainNodes from the AudioContext, one for the tremolo and one for the output attenuator:
    var tremolo = context.createGain();
    
    var attenuator = context.createGain();
    attenuator.gain.value = 0.5;
    
    // Connect the LFO to the tremolo's gain param:
    lfo.connect(tremolo.gain);
    
    // Connect the signal oscillator to the tremolo:
    oscillator.connect(tremolo);
    
    // Connect the tremolo to the attenuator:
    tremolo.connect(attenuator);
    
    // Connect the attenuator to the AudioContext's destination:
    attenuator.connect(context.destination);
    
    // Start the signal and LFO:
    lfo.start();
    oscillator.start();

**The attenuator in the above example is important.** The LFO's amplitude swings from 0.0 (silence) to 1.0 (maximum) so the unattenuated output could be loud enough to damage your listening equipment and potentially your hearing. Always start with your headphones or speakers tuned down and gradually increase the volume to a comfortable, safe listening level.

# 2. Advanced Concepts  

## 2.1 Noise

Noise is an important element in percussion synthesis, but the Web Audio API doesn't provide a noise generator so we'll have to make our own. There are a few ways to accomplish this, each of which has its own strengths and weaknesses.

### Noise Recipe 1: Realtime Generation with ScriptProcessorNode

The simplest way to produce noise is via the [ScriptProcessorNode](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode). This is a special AudioNode that repeatedly calls a function that accepts an [AudioProcessingEvent](https://developer.mozilla.org/en-US/docs/Web/API/AudioProcessingEvent) argument, which allows you to process or generate audio in real time. To create noise, you simply fill the output buffer with constantly-changing random values:

    // Create an AudioContext using the function we declared earlier:
    var context = createAudioContext();

    // Request a ScriptProcessorNode with a buffer size of 256 samples, 1 input channel and 1 output channel. The number of input channels doesn't matter, but you can set the number of output channels to 2 to generate noise in stereo.
    var noise = context.createScriptProcessor(256, 1, 1);
    
    // Declare the callback function that will fill the output buffer with random values:
    noise.onaudioprocess = function(evt) {
	    // Get the output buffer:
	    var outputBuffer = evt.outputBuffer;
	    // Iterate over the channels in the output buffer:
	    for (var c = 0; c < outputBuffer.numberOfChannels; c++) {
	      // Get the output data for the current channel:
	      var outputData = outputBuffer.getChannelData(c);
	      // Assign a new random value to each sample position in the output data:
        for (var s = 0; s < outputBuffer.length; s++) {
		      outputData[s] = Math.random();
	      }
	    }
	  }
	  
	  // Connect the ScriptProcessorNode to a destination:
    noise.connect(context.destination);
	  
This approach to noise generation is simple and produces the ideal result: a continuous, aperiodic signal. It also has a significant downside: ScriptProcessorNode executes the `onaudioprocess` function _on the main thread_ and can therefore be interrupted by other actions, like JavaScript animations. It has been deprecated and will eventually be replaced by [AudioWorkers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers). Until then, ScriptProcessorNode is still usable but only if you can guarantee that it will run uninterrupted. You should also be prepared to replace any ScriptProcessorNode-based features as browser vendors may evenutally drop support for it. 

### Noise Recipe 2: Sampling with AudioBuffers

Sampling provides an easy alternative to generating noise in real time. To begin, you'll need a digital audio recording of noise. Almost any audio editor can generate noise and save it to an audio file. If you have analog or digital synthesizers, you might also want to try sampling their noise sources so you'll have a variety of different colors to work with.

Once you have a sample, you can load it into an [AudioBuffer](https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer) object and control it with an [AudioBufferSourceNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode):

    // Create a XMLHttpRequest to load the sample:
    var request = new XMLHttpRequest();
    request.open('GET', 'noise.wav', true);
    request.responseType = "arraybuffer";
    
    // Assign a function to be executed when the sample has loaded:
    request.onload = function() {
      // Create an AudioContext using the function we declared earlier:
      var context = createAudioContext();
      
      // Request an AudioBuffer filled with the sample data from the response:
      var buffer = context.createBuffer(request.response, false);
    	
      // Request an AudioBufferSourceNode and assign the AudioBuffer to it:
      var source = context.createBufferSource();
      source.buffer = buffer;
      
      // Uncomment to enable looping:
      // source.loop = true;
      
      // Connect the AudioBufferSourceNode to a destination:
      source.connect(context.destination);
      
      // Start playback:
      source.start();
    };

    // Send the request to load the sample:
    request.send();

There are a few things to be aware of when using samples:

1. If you don't enable looping on the AudioBufferSourceNode, your noise sample must be long enough to last the maximum duration you'll need in your project. That could be several seconds for cymbals and other sounds with long decays.
2. If you do enable looping, your noise sample music be long enough to create the impression that it is _aperiodic_. If the sample is too short, you will be able to hear it loop. Again, you will probably need several seconds of noise to achieve a smooth sounding loop.
3. AudioBufferSourceNode can only be played once, so you will need to create a new one for each note. You can reuse the same AudioBuffer so there is no need to reload the sample.

### Noise Recipe 3: Pseudorandom Binary Sequences with AudioBuffers

A Pseudorandom Binary Sequence (PRBS) is an algorithm that creates a completely deterministic sequence of values that _creates the impression_ of being random. In practice, this approach to noise generation is similar to sampling but instead of filling the AudioBuffer with the contents of an audio file, we'll fill it with a PRBS. This has a notable advantage in that we don't have to wait for an audio file to load. See the attached paper on [Pseudorandom Binary Sequence Noise](PRBS-Noise.markdown) for details on how to generate a PRBS.

## 2.2 AudioParam Scheduling

A percussion sound will typically be short but very dynamic, with many characteristics that change over the course of its lifespan. We can control these changes with two methods provided by the AudioParam object: `linearRampToValueAtTime()` and `exponentialRampToValueAtTime()`. Let's try decreasing an oscillator's amplitude over time:

    // Create an AudioContext using the function we declared earlier:
    var context = createAudioContext();
    
    // Request and configure an OscillatorNode:
    var oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440.0;
    
    // Request and configure a GainNode:
    var amplifier = context.createGain();
    amplifier.gain.value = 1.0;
    
    // Connect the OscillatorNode to the GainNode:
    oscillator.connect(amplifier);
    
    // Connect the GainNode to the AudioContext's destination:
    amplifier.connect(context.destination);
    
    // Start the OscillatorNode:
    oscillator.start();
    
    // Set the end time to two seconds from the current time provided by the AudioContext:
    var endTime = context.currentTime + 2.0;
    
    // Ramp the GainNode's gain value to zero:
    amplifier.gain.linearRampToValueAtTime(0.0, endTime);

We can produce a smoother, more natural sounding decay by substituting `exponentialRampToValueAtTime()` for `linearRampToValueAtTime()`, but there is a small detail to pay attention to. We can't use `exponentialRampToValueAtTime()` if the start or end value is zero. If either value is zero, the value will remain unchanged for the duration of the ramp and will then snap abruptly to the end value. We can solve this problem by ramping exponentially to a very small value greater than zero, then ramping linearly to zero.

    // Set the initial value:
    amplifier.gain.value = 1.0;
    
    // Set the end time to two seconds from the current time provided by the AudioContext:
    var endTime = context.currentTime + 2.0;

    // Ramp exponentially to a very small value, slightly before the desired time:
    amplifier.gain.exponentialRampToValueAtTime(0.001, endTime - 0.01);
    
    // Ramp linearly to zero at the desired time:
    amplifier.gain.linearRampToValueAtTime(0.0, endTime);

If you are increasing the value over time, reverse the order of the ramps:

    // Set the initial value:
    amplifier.gain.value = 0.0;
    
    // Set the start time to a very short distance in the future"
    var startTime = context.currentTime + 0.01;
    
    // Set the end time to two seconds from the current time provided by the AudioContext:
    var endTime = context.currentTime + 2.0;
    
    // Ramp linearly to a very small value:
    amplifier.gain.linearRampToValueAtTime(0.0, startTime);
    
    // Ramp exponentially to the end value:
    amplifier.gain.exponentialRampToValueAtTime(1.0, endTime);

## 2.3 Envelope Generators

We can improve upon the scheduling methods demonstrated above by encapsulating them in an envelope generator. The Web Audio API doesn't provide a ready-to-use envelope generator but we can create our own quite easily. Let's start by defining a decay envelope generator.

    function DecayEnvelope(context, param) {
      var _env = this;

      _env.param = param;
      
      // Set default values:
	    _env.decayTime = 1.0;
	    _env.startValue = 1.0;
	    _env.endValue = 0.0;
	    _env.useExponentialCurve = true;

      // Declare a function to play the envelope:
	    _env.play = function() {
		    var startTime = context.currentTime;
		    var endTime = startTime + _env.decayTime;
		    
		    // Cancel any previously scheduled values and ramp immediately to the start value. This will ensure that the envelope generator always resets to the correct start value:
		    _env.param.cancelScheduledValues(startTime);
		    _env.param.linearRampToValueAtTime(_env.startValue, startTime);

		    if (_env.useExponentialCurve) {
		      // Schedule an exponential decay:
		      if (_env.endValue == 0.0) {
		        var targetTime = endTime - 0.001;
		        _env.param.exponentialRampToValueAtTime(0.001, targetTime);
		        _env.param.linearRampToValueAtTime(0.0, endTime);
			    } else {
			      _env.param.exponentialRampToValueAtTime(_env.endValue, endTime);
			    }
		    } else {
		      // Schedule a linear decay:
		      _env.param.linearRampToValueAtTime(_env.endValue, endTime);
		    }
	    };
	    
    }

The DecayEnvelope constructor accepts the current AudioContext and an AudioParam as arguments. You can use it to control any AudioParam. Let's modify our previous example to use DecayEnvelope instead of the manual scheduling code:

    // Create an AudioContext using the function we declared earlier:
    var context = createAudioContext();
    
    // Request and configure an OscillatorNode:
    var oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440.0;
    
    // Request and configure a GainNode:
    var amplifier = context.createGain();
    amplifier.gain.value = 1.0;
    
    // Configure a DecayEnvelope to control the GainNode:
    var envelope = new DecayEnvelope(context, amplifier.gain);
    envelope.decayTime = 2.0;
    
    // Connect the OscillatorNode to the GainNode:
    oscillator.connect(amplifier);
    
    // Connect the GainNode to the AudioContext's destination:
    amplifier.connect(context.destination);
    
    // Start the OscillatorNode and DecayEnvelope:
    oscillator.start();
    envelope.play();

The envelope generator has two significant benefits over manual scheduling code:

1. It's more flexible. The `decayTime`, `startValue` and `endValue` properties can be updated at any time to change the envelope's characteristics.
2. It's reusable. You can create and configure as many envelope generators as you need with just a few lines of code.

The DecayEnvelope is useful but you might notice an annoying clicking sound when you call the `play()` function. This happens because the envelope ramps instantly to the start value. We can smooth the clicking out by adding an attack stage to the envelope. This will also enable better sound design - percussion sounds have fast attacks, but that doesn't mean that they have _instant_ attacks.

    function AttackDecayEnvelope(context, param) {
	    var _env = this;
	    
	    _env.param = param;

      // Set default values:
	    _env.attackTime = 0.0;
	    _env.decayTime = 1.0;
	    _env.startValue = 0.0;
	    _env.peakValue = 1.0;
	    _env.endValue = 0.0;
	    _env.exponential = true;

      // Declare a function to play the envelope:
	    _env.play = function() {
		    var startTime = context.currentTime;
		    var peakTime = startTime + _env.attackTime;
		    var endTime = peakTime + _env.decayTime;
		    
		    // Cancel any previously scheduled values and ramp immediately to the start value. This will ensure that the envelope generator always resets to the correct start value:
		    _env.param.cancelScheduledValues(startTime);
		    _env.param.linearRampToValueAtTime(_env.startValue, startTime);

		    if (_env.exponential) {
		      // Schedule an exponential attack:
		      if (_env.startValue == 0.0) {
		        _env.param.linearRampToValueAtTime(0.001, startTime + 0.001);
		      }

			    if (_env.peakValue == 0.0) {
			      _env.param.exponentialRampToValueAtTime(0.001, peakTime - 0.001);
			      _env.param.linearRampToValueAtTime(0.0, peakTime);
			     } else {
			      _env.param.exponentialRampToValueAtTime(_env.peakValue, peakTime);
			     }
			    
			    // Schedule an exponential decay:
			    if (_env.endValue == 0.0) {
			      _env.param.exponentialRampToValueAtTime(0.001, endTime - 0.001);
			      _env.param.linearRampToValueAtTime(0.0, endTime);
			    } else {
			      _env.param.exponentialRampToValueAtTime(_env.endValue, endTime);
			    }
		    } else {
		      // Schedule a linear attack:
		      _env.param.linearRampToValueAtTime(_env.peakValue, peakTime);
		      // Schedule a linear decay:
		      _env.param.linearRampToValueAtTime(_env.endValue, endTime);
		    }
	    };

    }

Switching from DecayEnvelope to AttackDecayEnvelope requires very few changes to our code:

    // Create an AudioContext using the function we declared earlier:
    var context = createAudioContext();
    
    // Request and configure an OscillatorNode:
    var oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 440.0;
    
    // Request and configure a GainNode:
    var amplifier = context.createGain();
    amplifier.gain.value = 1.0;
    
    // Configure an AttackDecayEnvelope to control the GainNode:
    var envelope = new AttackDecayEnvelope(context, amplifier.gain);
    envelope.attackTime = 0.1;
    envelope.decayTime = 2.0;
    
    // Connect the OscillatorNode to the GainNode:
    oscillator.connect(amplifier);
    
    // Connect the GainNode to the AudioContext's destination:
    amplifier.connect(context.destination);
    
    // Start the OscillatorNode and DecayEnvelope:
    oscillator.start();
    envelope.play();

Both of the sample projects included with this tutorial use AttackDecayEnvelope. You can emulate DecayEnvelope by setting `attackTime` to `0` and setting `peakValue` to the same value as `startValue`.

You could expand the envelope generator to add other stages (see my [WebAHDSR](https://github.com/irritant/WebAHDSR) project for an example) but attack and decay will be sufficient for simple percussion sounds.

# 3. Sample Project: Creating Percussion Sounds with Subtractive Synthesis

Percussion sounds created with subtractive synthesis are reminiscent of mid- to late-1970s drum machines and the rhythm accompaniment boxes on old electronic organs. These sounds are far from realistic but have a certain lo-fi charm.

Open the `sub-percussion` project. This project provides a drum "voice" with three channels:

1. `tone1`: oscillator -> filter -> gain, with envelope generators to control oscillator frequency, filter cutoff and gain (level). This channel is normally used to synthesize the body of a drum sound.
2. `tone2`: similar to `tone1` but normally used to synthesize the attack of a drum sound.
3. `noise`: noise generator -> filter -> gain, with envelope generators to control filter cutoff and gain (level). This channel can be used to synthesize hi-hats, the snares on a snare drum, or to add some "dirt" to other sounds.

Each channel also has an `output` gain node. You can use these nodes to set the overall level of each channel. The voice also has its own `output` gain node that sets the final output level.

Because the oscillators, filters and gain nodes are controlled by envelope generators, most sound editing should be performed by manipulating the envelope generators rather than the nodes themselves. However, you can manually set the values for oscillator `type`, and filter `type` and `Q`.

The `sub-percussion` project includes the following files:

* `attack-decay.js``: An attack/decay envelope generator.
* `web-noise.js`: A ScriptProcessorNode-based noise generator.
* `sub-percussion-tone.js`: The prototype for the tone channels.
* `sub-percussion-noise.js`: The prototype for the noise channels.
* `sub-percussion.js`: The main implementation file, which instantiates a voice and configures a basic snare drum sound. 

Spend some time playing with the properties in `sub-percussion.js` to design your own sounds. Make note of any settings that you particularly like.

## Subtractive Sound Design Tips:

### Snare

The preset sound in `sub-percussion.js` is a snare sound. `tone1` generates a `triangle` waveform at a moderately low frequency, with a slight envelope decay over the duration of the sound. This provides the "body" sound. `tone2` is set to a midrange frequency with a much more pronounced envelope decay over a much shorter period. This provides the "attack" sound. `noise` has a lowpass filter with a low `Q` and moderately high `frequency` that decays over the duration of the sound.

### Tom-Tom

Start with the basic snare sound. Set the `noise` output gain to `0` and lengthen the decays of the `tone1` frequency and level envelopes. If you want to add a bit more "bite" to the attack, try adding the `noise` component back in with a very short decay and very low output gain. Vary the frequency between 100 Hz and 1000 Hz to create a range of tom-tom sounds. As you increase the frequency, decrease the decay slightly for more realism.

### Kick

Similar to the Tom-Tom sound, but with a much lower frequency (under 100 Hz) and shorter decay.

### Hi-Hats and Cymbals

Cymbals create very complex, inharmonic sounds that aren't easily emulated with subtractive synthesis, but we can use the noise generator to create the _impression_ of a cymbal. Begin by setting the `tone1` and `tone2` output gains to `0`. Change the `noise` component's filter type `highpass` to highpass and set its `frequency` to between 500 and 1000 Hz. Use a very short level decay (under 0.25 seconds) for a closed hi-hat, moderate decay (0.5 - 1 second) for an open hi-hat, or long decay (over 2 seconds) for a cymbal. You can add a bit of "stick" sound to hi-hats by lowering the filter `frequency` and increasing the `Q`.

# 4. Sample Project: Creating Percussion Sounds with FM Synthesis

Frequency Modulation (FM) synthesis allows for more harmonic complexity than subtractive synthesis and is easy to implement. The simplest FM algorithm uses two oscillators, called _operators_. The _carrier_ operator is responsible for the pitch that you hear, just like the oscillator in a subtractive synth. The _modulator_ operator applies a control signal to the carrier's frequency. If the modulator's frequency is below the audible threshold (under ~20 Hz), it serves as a  Low Frequency Oscillator (LFO) and creates a _vibrato_ effect. In FM synthesis, the modulator's frequency is above the audible threshold (over ~20 Hz), which creates a more complex waveform without changing the carrier's pitch. FM makes it easy to generate a wide variety of timbres that would be impossible to achieve with subtractive synthesis. It is particularly good at "metallic" and "wooden" sounds which makes it well suited to percussion.

Open the `fm-percussion` project. This project is very similar to `sub-percussion`. The only differences are in `fm-percussion-tone.js`, which has several new properties:

1. `modulator`: The modulator OscillatorNode.
2. `modulatorEnvelope`: An instance of AttackDecayEnvelope that controls the `modulator` frequency.
3. `modulatorDepth`: A GainNode that controls the amount of modulation applied to the carrier.
4. `carrier`: The carrier OscillatorNode (this replaces the `oscillator` property in `sub-percussion-tone.js`).

This is a basic 2 operator algorithm with one modulator and one carrier, but our drum voice provides two of them so we can layer different tibmres.

## FM Sound Design Tips:

### Frequency Ratios

The character of an FM sound is determined largely by the relationship between the modulator and carrier frequencies. Integer ratios (eg. 2:1) result in harmonically simple, smoother sounding waveforms, especially when using smaller ratios (2:1 or 3:1 is much less complex than 7:1 or 9:1). Non-integer ratios (eg. 2.5:1) result in complex, _inharmonic_ waveforms. Generally speaking, integer ratios are good for pitched sounds, while non-integer ratios make interesting unpitched sounds. Both can be useful when creating percussion sounds, so try both and let your ears determine what works. Setting the modulator to a higher frequency than the carrier will produce a brighter sound. Setting it to a lower frequency will generate a darker, more "wooden" sound.

The `tone1` and `tone2` components have envelope generators for both modulator and carrier frequency. You'll get more predictable results if you maintain a constant ratio between the modulator and carrier. For example, if you want a 3:2 ratio and your carrier frequency starts at 400 Hz, decaying exponentially to 200 Hz over 0.5 seconds, your modulator should start at 600 Hz and decay exponentially to 300 Hz over the same period. This is not a rule and you should feel free to experiment with different envelope settings for the modulator and carrier, but the results of doing so can be very hard to predict.

The `tone1` and `tone2` components also have envelope generators for the modulation depth. Varying modulation depth can be a great way to dynamically change the harmonic complexity of your sounds. In general, use a higher value (~1000+) for the `startValue` and `peakValue` properties and a lower value for the `endValue` property. 

### Snare

The preset snaore sound in `fm-percussion.js` is similar to the one in `sub-percussion.js`. The `tone1` carrier generates a `sine` waveform at a moderately low frequency, with a slight envelope decay over the duration of the sound. The modulator maintains a consistent integer ratio with the carrier throughout the decay period. This provides the "body" sound. The `tone2` carrier is set to a higher frequency than `tone1` with a more pronounced envelope decay over a much shorter period. The modulator and carrier frequencies have a non-integer ratio. This provides the "attack" sound. `noise` has a lowpass filter with a low `Q` and moderately high `frequency` that decays over the duration of the sound.

### Tom-Tom & Kick

The procedure for creating tom-tom and kick sounds from the snare sound is similar for both FM and subtractive sounds. See _Subtractive Sound Design Tips_.

### Hi-Hats and Cymbals

FM does a better job of synthesizing metallic sounds like hi-hats and cymbals than subtractive synthesis. While noise can still be useful, we don't have to depend on it. Begin by setting the carrier to a high frequency (over 1000 Hz) and set the modulator to a non-integer ratio with the carrier. The frequency envelope should not decay much, if at all (hint: set `startValue`, `peakValue` and `endValue` to the same value). The modulation depth should start at a high value and can decay slightly over the duration of the sound, but the `endValue` should still be fairly high (over ~1000).

# Resources

The [Mozilla Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) documentation does an excellent job of documenting the current state of the API.

Simon Cann's book [How to Make a Noise: Frequency Modulation Synthesis](http://noisesculpture.com/how-to-make-a-noise-frequency-modulation-synthesis/) offers a great primer on FM synthesis.