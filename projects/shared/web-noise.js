/*
WebNoise
A noise generator for WebAudio.
https://github.com/irritant/WebNoise

Copyright (c) 2015 Tony Wallace - tonywallace.ca

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is furnished 
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function WebNoise(context) {

	// Private:

	var _self = this;
	var _previousValue = 0.0;
	var _blockSize = 1;

	// Public:

	this.context = context;
	this.node = null;

	this.blockSize = function(size) {
		if (!isNaN(parseInt(size))) {
			_blockSize = Math.max(parseInt(size), 1);
		} else {
			return _blockSize;
		}
	}

	this.configureNode = function(options) {
		options = options || {};
		var bufferSize = parseInt(options.bufferSize) || 256;
		var inputChannels = parseInt(options.inputChannels) || 1;
		var outputChannels = parseInt(options.outputChannels) || 1;
		
		_self.node = _self.context.createScriptProcessor(bufferSize, inputChannels, outputChannels);
		_self.node.onaudioprocess = function(e) {
			var outputBuffer = e.outputBuffer;
			var blockSize = _self.blockSize();
			for (var c = 0; c < outputBuffer.numberOfChannels; c++) {
				var outputData = outputBuffer.getChannelData(c);
				for (var s = 0; s < outputBuffer.length; s++) {
					if (s % blockSize == 0) {
						outputData[s] = _previousValue = Math.random();
					} else {
						outputData[s] = _previousValue;
					}
				}
			}
		}

	}

}