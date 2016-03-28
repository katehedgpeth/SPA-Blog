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

blog.PostSummary = function(superClass) {
    extend(PostSummary, superClass);
    function PostSummary(context, datasource, color) {
        this.context = context;
        this.datasource = datasource;
        this.color = color;
        this.showAdminControls = bind(this.showAdminControls, this);
        this.showPost = bind(this.showPost, this);
        this.context.summary = this.context.text.slice(0, 200);
        PostSummary.__super__.constructor.apply(this, arguments);
    }
    PostSummary.prototype.buildEl = function() {
        var day, month, post, text, title, weekday;
        this.links = {};
        this.container = document.createElement("div");
        this.container.className = "post summary";
        this.container.setAttribute("data-id", this.context.uuid);
        this.date = document.createElement("div");
        this.date.className = "date";
        this.date.style.backgroundColor = this.color;
        this.container.appendChild(this.date);
        weekday = document.createElement("p");
        weekday.className = "weekday";
        weekday.textContent = this.context.date.day;
        this.date.appendChild(weekday);
        day = document.createElement("p");
        day.className = "day";
        day.textContent = this.context.date.date;
        this.date.appendChild(day);
        month = document.createElement("p");
        month.className = "month";
        month.textContent = this.context.date.month;
        this.date.appendChild(month);
        post = document.createElement("div");
        post.className = "content";
        this.container.appendChild(post);
        title = document.createElement("h2");
        title.className = "title";
        post.appendChild(title);
        this.links.title = document.createElement("a");
        this.links.title.textContent = this.context.title;
        this.links.title.href = "javascript:void(0)";
        title.appendChild(this.links.title);
        text = document.createElement("p");
        text.className = "text";
        text.textContent = this.context.summary;
        post.appendChild(text);
        this.links.ellipsis = document.createElement("a");
        this.links.ellipsis.href = "javascript:void(0)";
        this.links.ellipsis.textContent = "...";
        if (this.context.text.length > 200) {
            text.appendChild(this.links.ellipsis);
        }
        this.actionButtons = document.createElement("div");
        this.actionButtons.className = "action-buttons";
        this.container.appendChild(this.actionButtons);
        return this.container;
    };
    PostSummary.prototype.applyHandlers = function() {
        this.date.addEventListener("click", this.showPost);
        this.links.title.addEventListener("click", this.showPost);
        this.links.ellipsis.addEventListener("click", this.showPost);
        return PostSummary.__super__.applyHandlers.apply(this, arguments);
    };
    PostSummary.prototype.showPost = function() {
        return this.fire("showPost");
    };
    PostSummary.prototype.showAdminControls = function() {
        this.container.appendChild(this.editButton);
        return this.container.appendChild(this.deleteButton);
    };
    return PostSummary;
}(blog.PostView);