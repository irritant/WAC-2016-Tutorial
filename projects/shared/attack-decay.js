/*
AttackDecayEnvelope
Envelope generator for WebAudio.
https://github.com/irritant/WebNoise

Copyright (c) 2016 Tony Wallace - tonywallace.ca

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

function AttackDecayEnvelope(audioContext, audioParam) {
	var _env = this;

	_env.attackTime = 0.0;
	_env.decayTime = 1.0;
	_env.startValue = 0.0;
	_env.peakValue = 1.0;
	_env.endValue = 0.0;
	_env.exponential = true;

	_env.play = function() {
		var startTime = audioContext.currentTime;
		var peakTime = startTime + _env.attackTime;
		var endTime = peakTime + _env.decayTime;
		audioParam.cancelScheduledValues(startTime);
		audioParam.linearRampToValueAtTime(_env.startValue, startTime);

		if (_env.exponential) {
			if (_env.startValue == 0.0) {
				audioParam.linearRampToValueAtTime(0.001, startTime + 0.001);
			}

			if (_env.peakValue == 0.0) {
				audioParam.exponentialRampToValueAtTime(0.001, peakTime - 0.001);
				audioParam.linearRampToValueAtTime(0.0, peakTime);
			} else {
				audioParam.exponentialRampToValueAtTime(_env.peakValue, peakTime);
			}

			if (_env.endValue == 0.0) {
				audioParam.exponentialRampToValueAtTime(0.001, endTime - 0.001);
				audioParam.linearRampToValueAtTime(0.0, endTime);
			} else {
				audioParam.exponentialRampToValueAtTime(_env.endValue, endTime);
			}
		} else {
			audioParam.linearRampToValueAtTime(_env.peakValue, peakTime);
			audioParam.linearRampToValueAtTime(_env.endValue, endTime);
		}
	};

}