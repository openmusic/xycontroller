var ac = new AudioContext();
var osc = ac.createOscillator();
var xycontroller = document.querySelector('openmusic-xycontroller');

xycontroller.addEventListener('input', function(ev) {
	console.log('input', ev);
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
