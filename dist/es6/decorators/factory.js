/// <reference path="../typings/globals.d.ts"/>
/// <reference path="../typings/lib.d.ts"/>
function factory(target) {
    if (target.hasOwnProperty('$$classified'))
        return target;
    let wrapper = (...deps) => new target(...deps);
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(wrapper, Object.getPrototypeOf(target));
    }
    else {
        angular.extend(wrapper, target);
    }
    let props = Object.getOwnPropertyNames(target);
    for (let i = 0; i < props.length; i++) {
        let prop = props[i];
        let descriptor = Object.getOwnPropertyDescriptor(target, prop);
        if (descriptor) {
            Object.defineProperty(wrapper, prop, descriptor);
        }
    }
    // compatibility with ng-classified	
    wrapper.$$classified = null;
    return wrapper;
}
exports.factory = factory;
