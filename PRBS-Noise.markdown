# Pseudorandom Binary Sequence Noise

Generates noise by creating a pseudorandom binary sequence (PRBS). A PRBS of order _n_ will create 2<sup>n</sup>-1 samples. The signal is periodic but will seem random given a large enough value for _n_.

See [Wikipedia](https://en.wikipedia.org/wiki/Linear_feedback_shift_register#Some_polynomials_for_maximal_LFSRs) and [Xilinx](http://www.xilinx.com/support/documentation/application_notes/xapp052.pdf) for a list of polynomials that can be used to create PRBSs of different lengths. The 4-tap polynomials seem to create smoother sounding noise than the 2-tap polynomials. A PRBS of order 19 is the shortest that creates noise that is random enough for general musical use but order 16 may be sufficient for short sounds like persussion and is significantly more efficient.

Additional resources:
* [Wikipedia](https://en.m.wikipedia.org/wiki/Pseudorandom_binary_sequence)
* [Kurt Tomlinson](http://blog.kurttomlinson.com/posts/prbs-pseudo-random-binary-sequence)

```js
// Implementation:

// Convenience functions for a 16-bit pseudorandom binary sequence:
function generatePrbs16Samples() {
	return generatePrbsSamples(16, [16, 15, 13, 4]);
}

// Convenience function for a 19-bit pseudorandom binary sequence:
function generatePrbs19Samples() {
	return generatePrbsSamples(19, [19, 6, 2, 1]);
}

// 4-tap pseudorandom binary sequence generator:
function generatePrbsSamples(order, taps) {
	var tap1 = taps[0] || 0;
	var tap2 = taps[1] || 0;
	var tap3 = taps[2] || 0;
	var tap4 = taps[3] || 0;
	var length = Math.pow(2, order) - 1;
	var initial = 2;
	var x = initial;
	var samples = [];

	// Loop until the initial sample value is repeated, which 
	// means the pseudorandom sequence has reached its end:
	do {
		var bit = ((x >> (tap1 - 1)) ^ (x >> (tap2 - 1)) ^ (x >> (tap3 - 1)) ^ (x >> (tap4 - 1))) & 1;
		var x = ((x << 1) | bit) & length;
		// Convert the sample from an integer to a float in the range -1...1:
		var s = ((x / length) * 2) - 1;
	  samples.push(s);
	} 
	while (x != initial);
		
	return samples;
}

// Generate an audio buffer filled with a pseudorandom binary sequence:
function generatePrbsBuffer(context, numChannels, order) {
	// Generate frames:
	var frames = (function() {
		switch(order) {
			case 16:
				return generatePrbs16Samples();
			case 19:
				return generatePrbs19Samples();
			default:
				return [];
		}
	}());
	// Create and fill the buffer:
	var buffer = context.createBuffer(numChannels, frames.length, context.sampleRate);
	for (var c = 0; c < numChannels; c++) {
		var channel = buffer.getChannelData(c);
		// Provide a unique value for each channel by offseting 
		// the frame index by the number of frames divided by 
		// the 1-based channel index:
		var frameOffset = parseInt(frames.length / (c + 1));
		for (var f = 0; f < frames.length; f++) {
			var idx = f + frameOffset;
			if (idx > frames.length) {
				idx -= frames.length;
			}
			channel[f] = frames[idx];
		}
	}
	return buffer;
}

// Usage:

var context = new AudioContext();
var numChannels = 2;
var order = 19;
var buffer = generatePrbsBuffer(context, numChannels, order);
	
var source = context.createBufferSource();
source.buffer = buffer;
source.loop = 1;
source.connect(context.destination);
source.start();
```