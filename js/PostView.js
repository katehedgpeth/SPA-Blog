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

blog.PostView = function(superClass) {
    extend(PostView, superClass);
    function PostView(context, datasource, color) {
        this.context = context;
        this.datasource = datasource;
        this.color = color;
        this.onDeletePost = bind(this.onDeletePost, this);
        this.onCancelDeletePost = bind(this.onCancelDeletePost, this);
        this.onConfirmDeletePost = bind(this.onConfirmDeletePost, this);
        this.deletePost = bind(this.deletePost, this);
        this.editPost = bind(this.editPost, this);
        this.hide = bind(this.hide, this);
        this.el = this.buildEl();
        this.editButton = this.buildAdminButton("Edit");
        this.deleteButton = this.buildAdminButton("Delete");
        this.confirmDeletePopup = this.buildConfirmDeletePopup();
        this.applyHandlers();
    }
    PostView.prototype.buildAdminButton = function(type) {
        var button;
        button = document.createElement("a");
        button.href = "javascript:void(0)";
        button.className = type.toLowerCase() + " button";
        button.textContent = type;
        return button;
    };
    PostView.prototype.buildConfirmDeletePopup = function() {
        var p, popup;
        popup = document.createElement("div");
        popup.className = "confirm-popup";
        p = document.createElement("p");
        p.textContent = "Are you sure you want to delete this post?";
        popup.appendChild(p);
        this.confirmDeleteButton = document.createElement("a");
        this.confirmDeleteButton.href = "javascript:void(0)";
        this.confirmDeleteButton.className = "confirm-delete-button button";
        this.confirmDeleteButton.textContent = "Yes, delete it";
        popup.appendChild(this.confirmDeleteButton);
        this.cancelDeleteButton = document.createElement("a");
        this.cancelDeleteButton.href = "javascript:void(0)";
        this.cancelDeleteButton.className = "cancel-delete-button button";
        this.cancelDeleteButton.textContent = "Cancel";
        popup.appendChild(this.cancelDeleteButton);
        return popup;
    };
    PostView.prototype.applyHandlers = function() {
        this.editButton.addEventListener("click", this.editPost);
        this.deleteButton.addEventListener("click", this.deletePost);
        this.confirmDeleteButton.addEventListener("click", this.onConfirmDeletePost);
        return this.cancelDeleteButton.addEventListener("click", this.onCancelDeletePost);
    };
    PostView.prototype.hide = function() {
        return this.el.remove();
    };
    PostView.prototype.showAdminControls = function() {
        this.container.appendChild(this.editButton);
        this.container.appendChild(this.deleteButton);
        return this.applyHandlers();
    };
    PostView.prototype.hideAdminControls = function() {
        this.editButton.remove();
        return this.deleteButton.remove();
    };
    PostView.prototype.editPost = function() {
        return this.fire("editPost");
    };
    PostView.prototype.deletePost = function() {
        document.body.appendChild(this.confirmDeletePopup);
        return this.confirmDeletePopup.style["left"] = window.innerWidth / 2 - this.confirmDeletePopup.getBoundingClientRect().width / 2 + "px";
    };
    PostView.prototype.onConfirmDeletePost = function() {
        this.confirmDeletePopup.remove();
        return this.datasource.deletePost(this.context.id, {
            success: this.onDeletePost
        });
    };
    PostView.prototype.onCancelDeletePost = function() {
        return this.confirmDeletePopup.remove();
    };
    PostView.prototype.onDeletePost = function() {
        return this.fire("postDeleted");
    };
    return PostView;
}(blog.Observable);