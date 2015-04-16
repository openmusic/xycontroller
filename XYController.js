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
		var canvasY = canvasHeight - 0.5 * (1 + y) * canvasHeight + 0.5;

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
		
		this.values = { x: 0, y: 0 };

		// making web components MWC framework proof.
		this.innerHTML = '';
		
		var canvas = document.createElement('canvas');
		canvas.width = defaultWidth;
		canvas.height = defaultHeight;
		//this.x = 0;
		//this.y = 0;
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.appendChild(canvas);

		this.resetCanvas(this.context);

	};

	
	proto.attachedCallback = function() {
		this.readAttributes();
		this.listenToInput();
		this.updateDisplay();
	};


	proto.detachedCallback = function() {
		this.stopListeningToInput();
	};


	proto.readAttributes = function() {
		var that = this;
		['x', 'y'].forEach(function(attr) {
			that.setValue(attr, that.getAttribute(attr));		
		});
	};

	
	proto.setValue = function(name, value) {
		// TODO clamp to -1, 1
		if(value !== undefined && value !== null) {
			this.values[name] = value;
		} /*
		// TODO: perhaps it doesn't make sense to delete the internal value ;-)
		 else {
			if(this.values[name]) {
				delete(this.values[name]);
			}
		}*/
		this.updateDisplay();
	};


	proto.getValue = function(name) {
		return this.values[name];
	};

	
	proto.attributeChangedCallback = function(attr, oldValue, newValue, namespace) {
		
		this.setValue(attr, newValue);
		// TODO: this is not exactly the right type of event I guess
		var e = new CustomEvent('input', { detail: { x: this.values.x, y: this.values.y } });
		this.dispatchEvent(e);
		
	};


	proto.listenToInput = function() {

		var onTouchStart = this.onTouchStart.bind(this);
		var onTouchEnd = this.onTouchEnd.bind(this);
		var onTouchMove = this.onTouchMove.bind(this);

		this.canvas.addEventListener('mousedown', onTouchStart);
		this.canvas.addEventListener('mouseup', onTouchEnd);
		this.canvas.addEventListener('touchmove', onTouchMove);

		this.boundOnTouchStart = onTouchStart;
		this.boundOnTouchEnd = onTouchEnd;
		this.boundOnTouchMove = onTouchMove;

	};


	proto.stopListeningToInput = function() {
		this.canvas.removeEventListener('mousedown', this.boundOnTouchStart);
		this.canvas.removeEventListener('mouseup', this.boundOnTouchEnd);
		document.body.removeEventListener('mouseup', this.boundOnTouchEnd);
		this.canvas.removeEventListener('touchmove', this.boundOnTouchMove);
	};


	proto.onTouchStart = function(ev) {
		var onTouchMove = this.boundOnTouchMove;
		this.canvas.addEventListener('mousemove', onTouchMove);
		document.body.addEventListener('mouseup', this.boundOnTouchEnd);
	};


	proto.onTouchMove = function(ev) {
		var canvasWidth = this.canvas.width;
		var canvasHeight = this.canvas.height;
		// TODO: pretty sure this triggers ALL THE REFLOWS
		// should cache the element position
		var elPosX = this.canvas.offsetLeft;
		var elPosY = this.canvas.offsetTop;
		// ^^^
		var eventX;
		var eventY;

		if(ev.touches) {
			var touches = ev.touches;
			var touch = touches[0];
			eventX = touch.clientX - elPosX;
			eventY = touch.clientY - elPosY;
		} else {
			eventX = ev.layerX - elPosX;
			eventY = ev.layerY - elPosY;
		}
		
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
		relY = - (eventY / canvasHeight - 0.5) * 2;

		this.setValue('x', relX);
		this.setValue('y', relY);

		// emit event and...
		var e = new CustomEvent('input', { detail: { x: relX, y: relY }});
		this.dispatchEvent(e);

		// Update with the new values!
		this.updateDisplay();
		
	};


	proto.onTouchEnd = function(ev) {
		this.canvas.removeEventListener('touchmove', this.boundOnTouchMove);
		this.canvas.removeEventListener('mousemove', this.boundOnTouchMove);
	};

	
	proto.updateDisplay = function() {
		this.resetCanvas();
		render(this.canvas, this.getValue('x') * 1, this.getValue('y') * 1);
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

