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

blog.Post = function(superClass) {
    extend(Post, superClass);
    function Post(context, datasource, color) {
        this.context = context;
        this.datasource = datasource;
        this.color = color;
        this.onEditPost = bind(this.onEditPost, this);
        this.onPostDeleted = bind(this.onPostDeleted, this);
        this.hideAdminControls = bind(this.hideAdminControls, this);
        this.showAdminControls = bind(this.showAdminControls, this);
        this.onShowList = bind(this.onShowList, this);
        this.onShowPost = bind(this.onShowPost, this);
        this.showDetail = bind(this.showDetail, this);
        this.setContext();
        this.summary = new blog.PostSummary(this.context, this.datasource, this.color);
        this.detail = new blog.PostDetail(this.context, this.datasource, this.color);
        this.edit = new blog.PostEdit(this.context, this.datasource, this.color);
        this.applyHandlers();
    }
    Post.prototype.setContext = function() {
        var date, dayNames, monthNames;
        monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
        dayNames = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];
        date = new Date(this.context.timestamp);
        return this.context.date = {
            full: date,
            day: dayNames[date.getDay()],
            month: monthNames[date.getMonth()],
            date: date.getDate(),
            year: date.getFullYear(),
            time: date.toLocaleTimeString()
        };
    };
    Post.prototype.showSummary = function() {
        return this.summary.show();
    };
    Post.prototype.hideSummary = function() {
        return this.summary.hide();
    };
    Post.prototype.showDetail = function() {
        return this.detail.show();
    };
    Post.prototype.hideDetail = function() {
        return this.detail.hide();
    };
    Post.prototype.hideAll = function() {
        this.summary.hide();
        this.detail.hide();
        return this.edit.hide();
    };
    Post.prototype.applyHandlers = function() {
        this.summary.on("showPost", this.onShowPost);
        this.detail.on("showList", this.onShowList);
        this.summary.on("postDeleted", this.onPostDeleted);
        this.detail.on("postDeleted", this.onPostDeleted);
        this.summary.on("editPost", this.onEditPost);
        return this.detail.on("editPost", this.onEditPost);
    };
    Post.prototype.onShowPost = function() {
        return this.fire("showPost", this.summary);
    };
    Post.prototype.onShowList = function(e) {
        return this.fire("showList", this.context);
    };
    Post.prototype.showAdminControls = function() {
        this.summary.showAdminControls();
        return this.detail.showAdminControls();
    };
    Post.prototype.hideAdminControls = function() {
        this.summary.hideAdminControls();
        return this.detail.hideAdminControls();
    };
    Post.prototype.onPostDeleted = function() {
        return this.fire("postDeleted");
    };
    Post.prototype.onEditPost = function() {
        this.fire("editPost");
        return this.edit.show();
    };
    Post.prototype.onPostSaved = function(e) {
        return myBlog.getPosts();
    };
    return Post;
}(blog.Observable);