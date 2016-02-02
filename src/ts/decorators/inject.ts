/// <reference path="../typings/lib.d.ts"/>

export function inject(...depNames) {
	return function (target: INgBaseConstructor, prop?: string, descriptor?: PropertyDescriptor) {
		if (arguments.length === 1) {
			target.$inject = depNames;
		} else if (arguments.length > 1) {
			descriptor.value.$inject = depNames;
		}
	};
}