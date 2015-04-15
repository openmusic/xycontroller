# openmusic-xycontroller

> A component for plotting (and getting!) X-Y input values

[![Install with NPM](https://nodei.co/npm/openmusic-xycontroller.png?downloads=true&stars=true)](https://nodei.co/npm/openmusic-xycontroller/)

** YOU NEED SUPPORT FOR WEB COMPONENTS IN YOUR BROWSER BECAUSE WE'RE NOT SHIMMING ANYTHING IN **

Firefox: go to `about:config`, find `dom.webcomponents.enabled` and set it to true.

Chrome: maybe nothing to do?

## Installation

Grab `XYController.js` from the repo or do `npm install openmusic-xycontroller`.

## Usage

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


