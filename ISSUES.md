Issues Encountered
==================

* scripts that can't work standalone (commonjs only or require.js only) it's probably okay to not have support for people who still want to just use plain script tags - you really can't for modules that don't support that.
* jquery in component: it uses module.exports outside of if-then statements, therefore failing to load only because cajon though it also supported AMD. So dumb.
* handlebars - global exported not by window. Handlebars but instead using var Handlebars -> cajon doesn't pick it up as a global probably because it local evals it.
* any lib that has a build step and doesn't save the dist version in the repo is simply unuseable: hogan.js, marionette, lawnchair. Angularjs and ember are ok only because people has setup shim repos. 
* In case of threejs, we can probably make it work by searching for a file nameed three.js, by converting from threejs to three.js, this is a special case, how special is it?
* Ember.js has an explicit version check for jQuery. So for these we'll need to pass in the dep (jQuery) for empath detection.