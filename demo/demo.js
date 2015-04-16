var ac = new AudioContext();
var osc = ac.createOscillator();
var gain = ac.createGain();
var xycontroller = document.querySelector('openmusic-xycontroller');
var xSlider = document.getElementById('xSlider');
var ySlider = document.getElementById('ySlider');



xycontroller.addEventListener('input', function(ev) {
	var detail = ev.detail;
	xSlider.value = detail.x;
	ySlider.value = detail.y;
	
	var baseFreq = 220;
	var freqRange = 880;
	var relFreq = 0.5 * (detail.x + 1);

	osc.frequency.linearRampToValueAtTime(baseFreq + relFreq * freqRange, ac.currentTime);
	gain.gain.linearRampToValueAtTime(1 - (1 + detail.y) * 0.5, ac.currentTime);
});


xycontroller.setAttribute('x', 0);
xycontroller.setAttribute('y', -0.25);
osc.connect(gain);
gain.connect(ac.destination);
gain.gain.setValueAtTime(0.25, ac.currentTime);
osc.start();

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
