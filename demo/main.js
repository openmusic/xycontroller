require('../').register('openmusic-xycontroller');

var ac = new AudioContext();
var osc = ac.createOscillator();
var gain = ac.createGain();
var xycontroller = document.querySelector('openmusic-xycontroller');
var xSlider = document.getElementById('xSlider');
var ySlider = document.getElementById('ySlider');

xycontroller.addEventListener('input', function(ev) {
	var detail = ev.detail;
	var x = detail.x * 1;
	var y = detail.y * 1;
	xSlider.value = x;
	ySlider.value = y;
	var baseFreq = 220;
	var freqRange = 880;
	
	var relFreq = 0.5 * (x + 1);
	var relVol = (1 + y) * 0.5;

	osc.frequency.linearRampToValueAtTime(baseFreq + relFreq * freqRange, ac.currentTime);
	gain.gain.linearRampToValueAtTime(relVol, ac.currentTime);
});


osc.connect(gain);
gain.connect(ac.destination);
osc.start();


xycontroller.setAttribute('x', 0);
xycontroller.setAttribute('y', -0.95);


//

/*
// Uncomment to test the detachedCallback is actually called
setTimeout(function() {
	xycontroller.parentNode.removeChild(xycontroller);
}, 1000);
*/

/*
// Testing attribute setting
setTimeout(function() {
	xycontroller.setAttribute('x', 0.5);
	xycontroller.setAttribute('x', -0.5);
	xycontroller.removeAttribute('x');
}, 1000);
*/
