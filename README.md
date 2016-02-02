# ng-classes

Base classes for object-oriented Angular 1.x units, tailored with DI in mind.

Come in ES2015 (ES6), ES2016 (ES7) and TypeScript flavours.

# Flavours

## ES2015 (ES6)

```javascript
import { NgBase } from 'ng-classes';
```

or 

```javascript
let ngClasses = require('ng-classes');
let NgBase = ngClasses.NgBase;
```

## ES2016 (ES7)

```javascript
import { NgBase } from 'ng-classes/es7';
```

## TypeScript

```javascript
import { NgBase } from 'ng-classes/ts';
```


# Compatibility

`NgProvider` and `NgDirective` classes use [ES5 getters/setters](https://kangax.github.io/compat-table/es5/#test-Object_static_methods_Object.defineProperty) (IE9+) to substitute methods in children.

`NgProvider` uses [`Function.prototype.bind`](https://kangax.github.io/compat-table/es5/#test-Function.prototype.bind) (IE9+) to supply its instance to `NgProviderInstance`.

ES2016/TS decorators call for ES5 getters/setters.

`factory` uses [`Object.getOwnPropertyNames`](https://kangax.github.io/compat-table/es5/#test-Object_static_methods_Object.getOwnPropertyNames) and [`Object.getOwnPropertyDescriptor`](https://kangax.github.io/compat-table/es5/#test-Object_static_methods_Object.getOwnPropertyDescriptor) (IE9+), also [`Object.getPrototypeOf`](https://kangax.github.io/compat-table/es5/#test-Object_static_methods_Object.getPrototypeOf) and [`Object.setPrototypeOf`](https://kangax.github.io/compat-table/es6/#test-Object_static_methods_Object.setPrototypeOf) (IE11) for able-bodied support of static property inheritance.  
 
# Dependency injection

## `@inject` decorator (ES2016/TS)

Can be used to annotate classes and class members.

```javascript
import { inject, NgBase } from 'ng-classes';

@inject('$logProvider')
class JoeProvider extends NgBase {
	constructor(...deps) {
		super(...deps);

		this.$.$logProvider.…;
	}

	@inject('$log', '$q')
	$get($log, $q) { … }
}
```

## `$inject` static property

```javascript
class JoeProvider extends NgBase {
	static $inject = ['$logProvider'];
	…
}
```

# Class instantiation

## `@factory` decorator (ES2016/TS)

Allows to feed classes to Angular units that expect factory functions. Uni`controller` and `service` may benefit from this, too, in the case of instantiation problems (applicable to pre-1.5 Angular with native classes).

Replaces a class with wrapper function that instantiates it. Wrapper properties are prototypically inherited from class if `Object.setPrototypeOf` is supported, otherwise they are copied (all properties from the class and enumerable properties from its parents). This may cause inheritance issues in older JS engines, particularly if static properties are changed after class declaration, or parent classes have non-enumerable static properties.

All children classes of a decorated class will inherit from wrapper function, not a class itself.


**Should be used in the first place, before `@inject` and other class decorators. The decorators are executed in reverse order of their appearance, a factory wrapper and not original class will be decorated otherwise.**

```javascript
import { factory, inject, NgBase, NgDirective } from 'ng-classes';

class JoeAbstractDirective extends NgDirective {}

Object.defineProperty(JoeAbstractDirective, 'nonEnumerableStaticProp', {
	value: 'May not be available as JoeDirective.nonEnumerableStaticProp'
});

// Preferably a final class
@factory
@inject('$log')
class JoeDirective extends JoeAbstractDirective {
	static staticProp = 'Available as JoeDirective.staticProp and this.constructor.staticProp';

	constructor(...deps) {
		super(...deps);

		// this.constructor !== JoeDirective
 
		this.constructor.lateStaticProp = 'May not be available as JoeDirective.lateStaticProp';
	}
}

// Commonly does not require a factory wrapper
class JoeService extends NgBase { … }

angular.module('average', [])
	.service('JoeService', JoeService)
	.directive('joe', JoeDirective);
```

## `factory` function

The same function can be also used as a helper but has no inherent side effects of `@factory` decorator.

```javascript
…
angular.module('average', [])
	.service('JoeService', JoeService)
	.directive(factory(JoeDirective));
```

## `$factory` static method

Provides the same functionality for base classes as `factory` function.

```javascript
…
angular.module('average', [])
	.service('JoeService', JoeService)
	.directive(JoeDirective.$factory());
```

## `ng-classified` extension

Base classes have `$classify` property and are compatible with [`ng-classified`](https://github.com/ex-machine/ng-classified), no additional instantiation measures are necessary.

```javascript
import { NgBase, NgDirective } from 'ng-classes';
import { ngClassifiedModule } from 'ng-classified';

class JoeService extends NgBase { … }

class JoeDirective extends NgDirective { … }

angular.module('average', [ngClassifiedModule])
	.service('JoeService', JoeService)
	.directive('joe', JoeDirective);
```

# Classes

<a name="module_ng-classes"></a>
## ng-classes

* [ng-classes](#module_ng-classes)
    * [~NgBase](#module_ng-classes..NgBase)
        * [new NgBase(...deps)](#new_module_ng-classes..NgBase_new)
        * [.$inject](#module_ng-classes..NgBase.$inject) : <code>Array.&lt;string&gt;</code>
        * [.$classify](#module_ng-classes..NgBase.$classify)
        * [.$factory()](#module_ng-classes..NgBase.$factory) ⇒ <code>function</code>
    * [~NgProvider](#module_ng-classes..NgProvider)
        * [.$get](#module_ng-classes..NgProvider+$get) ⇒ <code>function</code>
    * [~NgProviderInstance](#module_ng-classes..NgProviderInstance)
        * [new NgProviderInstance(provider, ...deps)](#new_module_ng-classes..NgProviderInstance_new)
    * [~NgDirective](#module_ng-classes..NgDirective)
        * [.restrict](#module_ng-classes..NgDirective.NgDirective+restrict) : <code>string</code>
        * [.compile](#module_ng-classes..NgDirective+compile) ⇒ <code>function</code>
        * [._compile()](#module_ng-classes..NgDirective+_compile) ⇒ <code>function</code>
    * [~NgTemplate](#module_ng-classes..NgTemplate)
        * [.toString()](#module_ng-classes..NgTemplate+toString) ⇒ <code>string</code>
        * [.valueOf()](#module_ng-classes..NgTemplate+valueOf) ⇒ <code>string</code>

<a name="module_ng-classes..NgBase"></a>
### ng-classes~NgBase
Base class for Angular units.
Child classes are supposed to be supplied into most places that feature Angular DI - controllers, `config` and `run` blocks, `factory` and `service` services, etc.

**Kind**: inner class of <code>[ng-classes](#module_ng-classes)</code>  

* [~NgBase](#module_ng-classes..NgBase)
    * [new NgBase(...deps)](#new_module_ng-classes..NgBase_new)
    * [.$inject](#module_ng-classes..NgBase.$inject) : <code>Array.&lt;string&gt;</code>
    * [.$classify](#module_ng-classes..NgBase.$classify)
    * [.$factory()](#module_ng-classes..NgBase.$factory) ⇒ <code>function</code>

<a name="new_module_ng-classes..NgBase_new"></a>
#### new NgBase(...deps)

| Param | Type | Description |
| --- | --- | --- |
| ...deps | <code>\*</code> | Injected dependencies |

<a name="module_ng-classes..NgBase.$inject"></a>
#### NgBase.$inject : <code>Array.&lt;string&gt;</code>
Annotates class constructor for Angular injector.

**Kind**: static property of <code>[NgBase](#module_ng-classes..NgBase)</code>  
**Default**: <code>[]</code>  
**Access:** public  
<a name="module_ng-classes..NgBase.$classify"></a>
#### NgBase.$classify
Provides support for ng-classified.

**Kind**: static constant of <code>[NgBase](#module_ng-classes..NgBase)</code>  
**Default**: <code>true</code>  
**Access:** public  
<a name="module_ng-classes..NgBase.$factory"></a>
#### NgBase.$factory() ⇒ <code>function</code>
Creates an annotated class wrapper which is supplied to Angular injector.

**Kind**: static method of <code>[NgBase](#module_ng-classes..NgBase)</code>  
**Returns**: <code>function</code> - Factory function that returns a new class instance.  
**Access:** public  
<a name="module_ng-classes..NgProvider"></a>
### ng-classes~NgProvider
Base class for Angular service providers.
Accepts a child of NgProviderInstance class as `$get` value to be instantiated as service instance.

**Kind**: inner class of <code>[ng-classes](#module_ng-classes)</code>  
<a name="module_ng-classes..NgProvider+$get"></a>
#### ngProvider.$get ⇒ <code>function</code>
`$get` getter/setter.
Dispathes factory function from/to `_$get`.

**Kind**: instance property of <code>[NgProvider](#module_ng-classes..NgProvider)</code>  
**Access:** public  
<a name="module_ng-classes..NgProviderInstance"></a>
### ng-classes~NgProviderInstance
Base class for Angular `provider` service instances

**Kind**: inner class of <code>[ng-classes](#module_ng-classes)</code>  
<a name="new_module_ng-classes..NgProviderInstance_new"></a>
#### new NgProviderInstance(provider, ...deps)

| Param | Type | Description |
| --- | --- | --- |
| provider | <code>NgProvider</code> | Provider class instance. |
| ...deps | <code>\*</code> | Injected dependencies. |

<a name="module_ng-classes..NgDirective"></a>
### ng-classes~NgDirective
Base class for Angular directives

**Kind**: inner class of <code>[ng-classes](#module_ng-classes)</code>  

* [~NgDirective](#module_ng-classes..NgDirective)
    * [.restrict](#module_ng-classes..NgDirective.NgDirective+restrict) : <code>string</code>
    * [.compile](#module_ng-classes..NgDirective+compile) ⇒ <code>function</code>
    * [._compile()](#module_ng-classes..NgDirective+_compile) ⇒ <code>function</code>

<a name="module_ng-classes..NgDirective.NgDirective+restrict"></a>
#### ngDirective.restrict : <code>string</code>
Restricts directive declaration, forces the defaults in Angular 1.2.x for consistency.

**Kind**: instance property of <code>[NgDirective](#module_ng-classes..NgDirective)</code>  
**Default**: <code>&quot;EA&quot;</code>  
**Access:** public  
<a name="module_ng-classes..NgDirective+compile"></a>
#### ngDirective.compile ⇒ <code>function</code>
`compile` getter/setter.
Puts original function to '_compileFn' and returns `_compile` wrapper.

**Kind**: instance property of <code>[NgDirective](#module_ng-classes..NgDirective)</code>  
**Access:** public  
<a name="module_ng-classes..NgDirective+_compile"></a>
#### ngDirective._compile() ⇒ <code>function</code>
`compile` function wrapper.
Runs original function and allows `compile`, `preLink` and `link` functions to co-exist on DDO.

**Kind**: instance method of <code>[NgDirective](#module_ng-classes..NgDirective)</code>  
**Access:** public  
<a name="module_ng-classes..NgTemplate"></a>
### ng-classes~NgTemplate
Base class for Angular `component` templates

**Kind**: inner class of <code>[ng-classes](#module_ng-classes)</code>  

* [~NgTemplate](#module_ng-classes..NgTemplate)
    * [.toString()](#module_ng-classes..NgTemplate+toString) ⇒ <code>string</code>
    * [.valueOf()](#module_ng-classes..NgTemplate+valueOf) ⇒ <code>string</code>

<a name="module_ng-classes..NgTemplate+toString"></a>
#### ngTemplate.toString() ⇒ <code>string</code>
Shadows `Object.prototype.toString` method.
Affects object conversion when a string is expected (DOM assignments, `String.prototype` methods).

**Kind**: instance method of <code>[NgTemplate](#module_ng-classes..NgTemplate)</code>  
**Access:** public  
<a name="module_ng-classes..NgTemplate+valueOf"></a>
#### ngTemplate.valueOf() ⇒ <code>string</code>
Shadows `Object.prototype.valueOf` method.
Affects type conversion (string operators, non-strict equality).

**Kind**: instance method of <code>[NgTemplate](#module_ng-classes..NgTemplate)</code>  
**Access:** public  

# Usage


```
<body>
  <joe-directive>Directive can be DI-powered class</joe-directive>
  <joe-component>Component's template function can be DI-powered class as well</joe-component>
</body>
```


----------

*bootstrap.js*

```javascript
import 'angular';
import appModule from './app';

angular.bootstrap(document.body, [appModule]);
```

----------

*app.js*


```javascript
import joeDirectiveModule from './joe-directive';
import joeComponentModule from './joe-component';

export default angular.module('average', [joeDirectiveModule, joeComponentModule])
  .name;
```

----------

*joe-provider-complex.js*

```javascript
import { factory, inject, NgProvider, NgProviderInstance } from 'ng-classes';

// Decorators are executed in reverse order of their appearance.
// @factory should come first.
@factory
@inject('$logProvider')
export class JoeProviderComplex extends NgProvider {
  debug(flag) {
    return this.$.$logProvider.debugEnabled(flag);
  }
  
  $get = JoeProviderComplexInstance;
}

@inject('$log')
export class JoeProviderComplexInstance extends NgProviderInstance {
  logOnly(flag) {
    // Provider object, passed to constructor and available as this.$provider
    this.$provider.debug(!flag);

    // Injected $log, passed to constructor and available as this.$.$log    
    let { $log } = this.$;
    $log.debug('complex provider debug');
    $log.log('complex provider log');
    
    return 'Logging with joeProviderComplex instance' + (flag && ' with no debugging');
  }
}

export default angular.module('average.joeProviderComplex', [])
  .provider('joeProviderComplex', JoeProviderComplex)
  .name;
```

----------

*joe-provider-basic.js*

```javascript
import { factory, inject, NgBase } from 'ng-classes';

// Provider can be defined with NgBase instead of NgProvider/NgProviderInstance
export class JoeProviderBasic extends NgBase {
  log(logService) {
    logService.log('basic provider log');
  }

  // and having a single class for provider and instance can be tedious
  @inject('$log')
  $get($log) {
    this.log($log);

    // but provider instance result can return any value,
    // no toString/valueOf shadowing in class is required.
    return 'Logging with joeProviderBasic instance';
  };
}

export default angular.module('average.joeProviderBasic', [])
  // 'factory' helper function is the alternative to '@factory' decorator.
  .provider('joeProviderBasic', factory(JoeProviderBasic))
  .name;
```

----------

*joe-controller.js*

```javascript
import { factory, inject, NgBase } from 'ng-classes';
import joeProviderComplexModule from './joe-provider-complex';
import joeProviderBasicModule from './joe-provider-basic';

// No @factory is necessary for instantiated units.
@inject('joeProviderComplex', 'joeProviderBasic')
export class JoeController extends NgBase {
  constructor(...deps) {
    super(...deps);

    this.messageBasic = this.$.joeProviderBasic;
    this.messageComplex = this.$.joeProviderComplex.logOnly(true);
  }
}

export default angular.module('average.joeController', [joeProviderComplexModule, joeProviderBasicModule])
  .controller('JoeController', JoeController)
  .name;
```

----------

*joe-directive.js*

```javascript
import { factory, inject, NgDirective } from 'ng-classes';
import joeControllerModule from './joe-controller';

export class JoeDirective extends NgDirective {
  template = `
<div>    
  <h1>joe-directive</h1>
  <h2 ng-transclude></h2>
  <p></p>
  <p></p>
</div>
  `;

  transclude = true;
  
  controller = 'JoeController';
  
  controllerAs = 'vm';

  compile = (element) => {
    this.messageCompile = 'compile';
  }

  preLink = (scope, element, attrs, ctrl) => {
    ctrl.messagePreLink = 'pre-link';
  }
  
  link = (scope, element, attrs, ctrl) => {
    ctrl.messagePostLink = 'post-link';

    let text = [this.messageCompile, ctrl.messagePreLink, ctrl.messagePostLink].join(', ');
    text += ' functions can coexist on DDO';
    
    element.append(angular.element('<p>').text(text))
  }
}

export default angular.module('average.joeDirective', [joeControllerModule])
  // $factory() method does the same job as '@factory' decorator and 'factory' helper function
  .directive('joeDirective', JoeDirective.$factory())
  .name;
```

----------

*joe-component.js*

```javascript
import { factory, inject, NgBase, NgTemplate } from 'ng-classes';

export class JoeComponent {
  template = JoeComponentTemplate.$factory();
}

@inject('$element')
export class JoeComponentTemplate extends NgTemplate {
  constructor(...deps) {
    super(...deps);

    let text = this.$.$element.text();

 	// The instance is converted to $template value with shadowed toString() and valueOf().
    this.$template = `
<div>    
  <h1>joe-component</h1>
  <h2>${text}</h2>
</div>
    `;
  }
}

export default angular.module('average.joeComponent', [])
  // Components don't do DI, the class can be just 'new'ed.
  .component('joeComponent', new JoeComponent)
  .name;
```
