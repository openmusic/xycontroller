# openmusic-xycontroller

> A component for plotting (and getting!) X-Y input values

[![Install with NPM](https://nodei.co/npm/openmusic-xycontroller.png?downloads=true&stars=true)](https://nodei.co/npm/openmusic-xycontroller/)

** YOU NEED SUPPORT FOR WEB COMPONENTS IN YOUR BROWSER BECAUSE WE'RE NOT SHIMMING ANYTHING IN **

Firefox: go to `about:config`, find `dom.webcomponents.enabled` and set it to true.

Chrome: maybe nothing to do?

## Installation

Grab `XYController.js` from the repo or do `npm install openmusic-xycontroller`.

### If not using any package manager

Include `XYController.js` before you use the component.

```javascript
<script src="XYController.js"></script>
```

It will be registered automatically as `openmusic-xycontroller`, so you can `document.createElement('openmusic-xycontroller')` or just have `<openmusic-xycontroller>` elements in your HTML source.

### If using npm

You need to load the module and then register it--it is not automatically registered!

```javascript
require('openmusic-xycontroller').register('openmusic-xycontroller');
```

But you could even register it with other name, for example:

```javascript
require('openmusic-xycontroller').register('mega-xycontroller');
```

Up to you.

## Usage

Have a look at `demo/demo.js` for an example that uses this component to control the volume and pitch of an oscillator in order to build a very simple theremin-like instrument.

### Attributes

Both `x` and `y` go from `-1` to `1`. Values from outside this range won't be accepted and will be automatically clamped.

#### `x`

Determines the horizontal value.

```javascript
<openmusic-xycontroller x="-1"></openmusic-xycontroller> // left
<openmusic-xycontroller x="0"></openmusic-xycontroller> // center
<openmusic-xycontroller x="1"></openmusic-xycontroller> // right
```

#### `y`

Determines the vertical value.

```javascript
<openmusic-xycontroller y="-1"></openmusic-xycontroller> // bottom
<openmusic-xycontroller y="0"></openmusic-xycontroller> // center
<openmusic-xycontroller y="1"></openmusic-xycontroller> // top
```

### Events

#### `input`

This event will be dispatched as the value changes due to user input. To listen for `input` events on a controller, add an event listener:

```javascript
controller.addEventListener('input', function(ev) {
	var detail = ev.detail;
	// detail.x and detail.y contain the values you want
	console.log(detail.x, detail.y);
});
```
