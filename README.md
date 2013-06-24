Empath - Javascript Library Sniffer
===================================

Currently in the Javascript community there is simply no concenses about modules. *This is a problem.* Empath scans a Javascript library and gives you information on how it expects to be consumed.

## Install

    npm install empath -g

## Usage

You've got a Javascript library sitting there in a directory called backbone. Maybe you downloaded it using a package manager or cloned it using git or extracted it as a tarball from github. How do you use it?

    $ empath backbone # give it the path of the directory
    Searching for main in backbone
    has backbone/bower.json? yes
    No main found in backbone/bower.json
    has backbone/component.json? no
    has backbone/package.json? yes
    Main found in backbone/package.json: backbone.js
    Supports AMD?
      no
    Supports CommonJS?
      yes
      dependencies: underscore
      exports a object
    Globals variables exported
      Backbone

## Background Information

### Module Format

On the issue of *module format*, there are generally three camps:

1. (AMD(Require.js))[http://requirejs.org/docs/whyamd.html]
2. CommonJS(Node)
3. We don't need a module system, just add globals

### Registry

Here is a list of the most popular package registries for Javascript

* (NPM)[https://npmjs.org/] - the registry for Node modules, currently the most popular JS registry, but the modules are generally not intended for use in the browser. Format: CommonJS.
* (Jam)[http://jamjs.org/] - A registry and package manager with a easy workflow. AMD-based.
* (Bower)[http://bower.io/] - a new registry by Twitter. Format agnostic but does nothing for workflow.
* (Component)[https://github.com/component/component] - the only front-end module registry using CommonJS. Requires a build step.
* (Volo)[http://volojs.org/] - Another AMD-based registry with workflow and project scaffolding.

For more information on module registries, take a look a this [article by wilmoore](https://github.com/wilmoore/frontend-packagers).





