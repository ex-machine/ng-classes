import { factory } from './decorators/factory';
export { factory };

export { inject } from './decorators/inject';



/** @module ng-classes */

/**
 * Base class for Angular units.
 * Child classes are supposed to be supplied into most places that feature Angular DI - controllers, `config` and `run` blocks, `factory` and `service` services, etc.
 */
export class NgBase {
	/**
	 * Annotates class constructor for Angular injector.
	 * @static
	 * @public
	 * @default
	 * @type {Array.<string>}
	 */
	static $inject = [];

	/**
	 * Provides support for ng-classified.
	 * @static
	 * @public
	 * @constant
	 * @default
	 */
	static $classify = true;

	/**
	 * Stores injected dependencies.
	 * @private
	 * @type {Object.<*>}
	 */
	$ = {};

	/**
	 * Creates an annotated class wrapper which is supplied to Angular injector.
	 * @static
	 * @public
	 * @returns {function} Factory function that returns a new class instance.
	 */
	static $factory() {
		return factory(this);
	}

	/**
	 * @param {...*} Injected dependencies
	 */
	constructor(...args) {	
		let self = this.constructor;

		angular.forEach(self.$inject, (depName, i) => {
			this.$[depName] = args[i]; 
		});
	}
}



/**
 * Base class for Angular service providers.
 * Accepts a child of NgProviderInstance class as `$get` value to be instantiated as service instance.
 */
export class NgProvider extends NgBase {
	/**
	 * Stores a factory function that returns a new instance of supplied constructor.
	 * @public
	 * @type {function}
	 */
	_$get;

	/**
	 * `$get` getter/setter.
	 * Dispathes factory function from/to `_$get`.
	 * @public
	 * @type {function}
	 * @returns {function}
	 */
	get $get() {
		return this._$get;
	}

	set $get(Instance) {
		let $get = (...deps) => new Instance(this, ...deps);
		$get.$inject = Instance.$inject;
		this._$get = $get;
	}
}



/**
 * Base class for Angular `provider` service instances
 */
export class NgProviderInstance extends NgBase {
	/**
	 * Stores the instance of provider class that hosts service instance.
	 * @public
	 * @type {NgProvider}
	 */
	$provider;

	/**
	 * @param {NgProvider} Provider class instance.
	 * @param {...*} Injected dependencies.
	 */
	constructor(provider, ...deps) {
		super(...deps);

		this.$provider = provider;
	}
}



/**
 * Base class for Angular directives
 */
export class NgDirective extends NgBase {
	/**
	 * Stores original `compile` function.
	 * @private
	 * @type {?function}
	 */
	_compileFn;

	/**
	 * Pre-link function.
	 * @public
	 * @type {?function}
	 */
	preLink;

	/**
	 * (Post-)link function, { pre: ..., post: ... } object is also accepted for compatibility.
	 * @public
	 * @type {?(function|Object.<function>)}
	 */
	link;

	/**
	 * Restricts directive declaration, forces the defaults in Angular 1.2.x for consistency.
	 * @public
	 * @type {string}
	 * @default
	 */
	restrict = 'EA';

	/**
	 * `compile` function wrapper.
	 * Runs original function and allows `compile`, `preLink` and `link` functions to co-exist on DDO.
	 * @public
	 * @type {function}
	 * @returns {function}
	 */
	_compile(element, attrs, transclude) {
		let linkingFns;

		if (this._compile)
			linkingFns = this._compileFn(element, attrs, transclude);

		if (linkingFns === undefined) {
			if (typeof this.link === 'object') {
				linkingFns = this.link;
			} else if (this.preLink || this.link) {
				linkingFns = {
					pre: this.preLink,
					post: this.link
				};
			}
		}

		return linkingFns;
	};

	/**
	 * `compile` getter/setter.
	 * Puts original function to '_compileFn' and returns `_compile` wrapper.
	 * @public
	 * @type {function}
	 * @returns {function}
	 */
	get compile() {
		return this._compile;
	}

	set compile(compileFn) {
		this._compileFn = compileFn;
	}
}



/**
 * Base class for Angular `component` templates
 */
export class NgTemplate extends NgBase implements INgTemplate {
	/**
	 * Stores `template`/`templateUrl` string.
	 * @public
	 * @type {string}
	 */
	$template;

	/**
	 * Shadows `Object.prototype.toString` method.
	 * Affects object conversion when a string is expected (DOM assignments, `String.prototype` methods).
	 * @public
 	 * @type {function}
 	 * @returns {string}
	 */
	toString() {
		return this.$template;
	}

	/**
	 * Shadows `Object.prototype.valueOf` method. 
	 * Affects type conversion (string operators, non-strict equality).
	 * @public
 	 * @type {function}
 	 * @returns {string}
	 */
	valueOf() {
		return this.$template;
	}
}
