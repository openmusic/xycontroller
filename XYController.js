(function() {
	var proto = Object.create(HTMLElement.prototype);

	var defaultWidth = 200;
	var defaultHeight = defaultWidth;
	// TODO Take into account display density!


	// x, y -> both -1, 1
	// TODO X, Y attributes
	// touch event -> x, y
	
	function render(canvas, x, y) {
		var ctx = canvas.getContext('2d');
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		var canvasHalfHeight = canvasHeight * 0.5;

		// Tip: the additional + 0.5 is for getting a sharp line instead of a blurry one
		var canvasX = 0.5 * (1 + x) * canvasWidth + 0.5;
		var canvasY = 0.5 * (1 + y) * canvasHeight + 0.5;

		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgb(0, 255, 0)';

		// vertical axis
		ctx.beginPath();
		ctx.moveTo(canvasX, 0);
		ctx.lineTo(canvasX, canvasHeight);
		ctx.stroke();

		// horizontal axis
		ctx.beginPath();
		ctx.moveTo(0, canvasY);
		ctx.lineTo(canvasWidth, canvasY);
		ctx.stroke();
		
	}

	
	proto.createdCallback = function() {
		// making web components MWC framework proof.
		this.innerHTML = '';
		
		var canvas = document.createElement('canvas');
		canvas.width = defaultWidth;
		canvas.height = defaultHeight;
		this.x = 0;
		this.y = 0;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.appendChild(canvas);

		this.resetCanvas(this.context);

	};

	
	proto.attachedCallback = function() {
		this.startAnimation();
		// TODO perhaps only render on touch
		// TODO perhaps also debounce that?
	};


	proto.detachedCallback = function() {
		this.stopAnimation();
	};


	proto.startAnimation = function() {

		var that = this;

		animate();

		function animate() {
			that.animationFrameID = requestAnimationFrame(animate);
		
			that.resetCanvas();
			render(that.canvas, that.x, that.y);
		}
	};


	proto.stopAnimation = function() {
		cancelAnimationFrame(this.animationFrameID);
	};


	proto.resetCanvas = function() {
		var ctx = this.context;
		var canvas = this.canvas;

		ctx.fillStyle = 'rgba(0, 50, 0, 1)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	//

	var component = {};
	component.prototype = proto;
	component.register = function(name) {
		document.registerElement(name, {
			prototype: proto
		});
	};

	if(typeof define === 'function' && define.amd) {
		define(function() { return component; });
	} else if(typeof module !== 'undefined' && module.exports) {
		module.exports = component;
	} else {
		component.register('openmusic-xycontroller'); // automatic registration
	}

}).call(this);

