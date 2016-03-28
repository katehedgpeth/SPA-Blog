var bind = function(fn, me) {
    return function() {
        return fn.apply(me, arguments);
    };
}, extend = function(child, parent) {
    for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
        this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
}, hasProp = {}.hasOwnProperty;

blog.PostDetail = function(superClass) {
    extend(PostDetail, superClass);
    function PostDetail() {
        this.goBack = bind(this.goBack, this);
        return PostDetail.__super__.constructor.apply(this, arguments);
    }
    PostDetail.prototype.buildEl = function() {
        var date, text, title;
        this.container = document.createElement("div");
        this.container.className = "post detail";
        this.container.setAttribute("data-id", this.context.id);
        title = document.createElement("h1");
        title.className = "title";
        title.textContent = this.context.title;
        title.setAttribute("style", "color: " + this.color);
        this.container.appendChild(title);
        date = document.createElement("p");
        date.className = "date";
        date.textContent = this.context.date.day + ", " + this.context.date.month + " " + this.context.date.date + ", " + this.context.date.year + ", " + this.context.date.time;
        this.container.appendChild(date);
        text = document.createElement("p");
        text.className = "text";
        text.textContent = this.context.text;
        this.container.appendChild(text);
        return this.container;
    };
    PostDetail.prototype.goBack = function(e) {
        return this.fire("showList");
    };
    return PostDetail;
}(blog.PostView);