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
		this.listenToInput();
		// this.startAnimation();
		// TODO perhaps only render on touch
		// TODO perhaps also debounce that?
		this.updateDisplay();
	};


	proto.detachedCallback = function() {
		// this.stopAnimation();
		this.stopListeningToInput();
	};


	proto.listenToInput = function() {

		var onTouchStart = this.onTouchStart.bind(this);
		var onTouchEnd = this.onTouchEnd.bind(this);

		this.canvas.addEventListener('touchstart', onTouchStart);
		this.canvas.addEventListener('mousedown', onTouchStart);
		this.canvas.addEventListener('touchend', onTouchEnd);
		this.canvas.addEventListener('mouseup', onTouchEnd);

		this.boundOnTouchStart = onTouchStart;
		this.boundOnTouchEnd = onTouchEnd;

	};


	proto.stopListeningToInput = function() {
		this.canvas.removeEventListener('touchstart', this.boundOnTouchStart);
		this.canvas.removeEventListener('mousedown', this.boundOnTouchStart);
		this.canvas.removeEventListener('touchend', this.boundOnTouchEnd);
		this.canvas.removeEventListener('mouseup', this.boundOnTouchEnd);
		document.body.removeEventListener('mouseup', this.boundOnTouchEnd);
	};


	proto.onTouchStart = function(ev) {
		console.log('touch start', this, ev);
		var onTouchMove = this.onTouchMove.bind(this);
		this.canvas.addEventListener('touchmove', onTouchMove);
		this.canvas.addEventListener('mousemove', onTouchMove);
		document.body.addEventListener('mouseup', this.boundOnTouchEnd);
		this.boundOnTouchMove = onTouchMove;
	};


	proto.onTouchMove = function(ev) {
		var canvasWidth = this.canvas.width;
		var canvasHeight = this.canvas.height;
		// TODO: pretty sure this triggers ALL THE REFLOWS
		// should cache the element position
		var elPosX = this.canvas.offsetLeft;
		var elPosY = this.canvas.offsetTop;
		// ^^^
		var eventX = ev.layerX - elPosX;
		var eventY = ev.layerY - elPosY;
		var relX;
		var relY;

		if(eventX < 0) {
			eventX = 0;
		} else if(eventX > canvasWidth) {
			eventX = canvasWidth;
		}

		if(eventY < 0) {
			eventY = 0;
		} else if(eventY > canvasHeight) {
			eventY = canvasHeight;
		}

		relX = (eventX / canvasWidth - 0.5) * 2;
		relY = (eventY / canvasHeight - 0.5) * 2;

		this.x = relX;
		this.y = relY;

		// emit event and...
		var e = new CustomEvent('input', { detail: { x: relX, y: relY }});
		this.dispatchEvent(e);

		// Update with the new values!
		this.updateDisplay();
		
	};


	proto.onTouchEnd = function(ev) {
		console.log('end', this, ev);
		this.canvas.removeEventListener('touchmove', this.boundOnTouchMove);
		this.canvas.removeEventListener('mousemove', this.boundOnTouchMove);
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

	proto.updateDisplay = function() {
		this.resetCanvas();
		render(this.canvas, this.x, this.y);
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

