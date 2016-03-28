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

blog.PostEdit = function(superClass) {
    extend(PostEdit, superClass);
    function PostEdit(context1, datasource, color) {
        this.context = context1;
        this.datasource = datasource;
        this.color = color;
        this.onKeyUp = bind(this.onKeyUp, this);
        this.onSaveClicked = bind(this.onSaveClicked, this);
        PostEdit.__super__.constructor.apply(this, arguments);
    }
    PostEdit.prototype.buildEl = function() {
        var h1;
        this.container = document.createElement("div");
        this.container.className = "post edit";
        h1 = document.createElement("h1");
        h1.textContent = this.context.title || this.context.text ? "Edit Post" : "New Post";
        this.container.appendChild(h1);
        this.title = document.createElement("input");
        this.title.type = "text";
        this.title.value = this.context.title || null;
        this.container.appendChild(this.title);
        this.content = document.createElement("textarea");
        this.content.value = this.context.text || null;
        this.container.appendChild(this.content);
        this.saveButton = document.createElement("a");
        this.saveButton.href = "javascript:void(0)";
        this.saveButton.className = "save button";
        this.saveButton.textContent = "Save";
        this.container.appendChild(this.saveButton);
        this.cancelButton = document.createElement("a");
        this.cancelButton.href = "javascript:void(0)";
        this.cancelButton.className = "cancel button";
        this.cancelButton.textContent = "Cancel";
        this.container.appendChild(this.cancelButton);
        return this.container;
    };
    PostEdit.prototype.applyHandlers = function() {
        this.saveButton.addEventListener("click", this.onSaveClicked);
        this.cancelButton.addEventListener("click", this.onCancelClicked);
        this.title.addEventListener("keyup", this.onKeyUp);
        return this.content.addEventListener("keyup", this.onKeyUp);
    };
    PostEdit.prototype.onSaveClicked = function(e) {
        var context;
        e.stopImmediatePropagation();
        context = {
            title: this.context.title,
            text: this.context.text
        };
        return this.datasource.save({
            data: {
                id: this.context.id,
                post: JSON.stringify(context)
            },
            success: this.onSaveSuccess
        });
    };
    PostEdit.prototype.onCancelClicked = function() {
        return myBlog.getPosts();
    };
    PostEdit.prototype.show = function() {
        return document.getElementById("current-post").appendChild(this.el);
    };
    PostEdit.prototype.onKeyUp = function() {
        this.context.title = this.title.value;
        return this.context.text = this.content.value;
    };
    PostEdit.prototype.onSaveSuccess = function() {
        return myBlog.getPosts();
    };
    return PostEdit;
}(blog.PostView);