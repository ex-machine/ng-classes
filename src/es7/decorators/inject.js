export function inject(...depNames) {
	return function (target, prop, descriptor) {
		if (arguments.length === 1) {
			target.$inject = depNames;
		} else if (arguments.length > 1) {
			descriptor.value.$inject = depNames;
		}
	};
}