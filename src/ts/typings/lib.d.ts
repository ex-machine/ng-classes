interface INgWrapper extends Function {
	(...deps: any[]): any;
	$$classified?: any;
	$inject?: string[];
}

interface INgBase {
	$: Object;
}

interface INgBaseConstructor {
	new (...args: any[]): INgBase;
	$inject?: string[];
}

interface INgProvider extends INgBase {
	_$get: INgWrapper;
	$get: any;
}

interface INgProviderInstance extends INgBase {
	$provider: INgProvider;
}

interface INgProviderInstanceConstructor extends INgBaseConstructor {
	new (...args: any[]): INgProviderInstance;
}

interface INgDirective extends INgBase {
	restrict: string;
	_compileFn: Function;
	_compile: Function;
	compile: Function;
	preLink?: Function;
	link?: Function | Object;
}

interface INgTemplate extends INgBase {
	$template: string;
	toString: () => string;
	valueOf: () => string;
}

declare type TNgComponentTemplate = string | Function;