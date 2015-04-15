var ac = new AudioContext();
var osc = ac.createOscillator();
var xycontroller = document.querySelector('openmusic-xycontroller');
var xSlider = document.getElementById('xSlider');
var ySlider = document.getElementById('ySlider');

xycontroller.addEventListener('input', function(ev) {
	var detail = ev.detail;
	xSlider.value = detail.x;
	ySlider.value = detail.y;
});

osc.connect(ac.destination);
// osc.start();
//

/*
// Uncomment to test the detachedCallback is actually called
setTimeout(function() {
	xycontroller.parentNode.removeChild(xycontroller);
}, 1000);
*/
