var slice = [].slice;

blog.Observable = function() {
    function Observable() {}
    Observable.prototype.on = function(event, handler) {
        var base;
        (base = this.events || (this.events = {}))[event] || (base[event] = $.Callbacks());
        return this.events[event].add(handler);
    };
    Observable.prototype.fire = function() {
        var event, params, ref;
        event = arguments[0], params = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (this.events && this.events[event] != null) {
            return (ref = this.events[event]).fire.apply(ref, params);
        }
    };
    Observable.prototype.randomInteger = function(max, min) {
        if (min == null) {
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return Observable;
}();