(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
blog.Datasource = function() {
    function Datasource() {
        this.url = "http://localhost:3000/v1/posts";
    }
    Datasource.prototype.getPosts = function(opts) {
        return $.getJSON(this.url);
    };
    Datasource.prototype.save = function(opts) {
        if (opts.data.id) {
            opts.url = this.url + "/" + opts.data.id + "/edit";
            opts.method = "GET";
        } else {
            opts.url = this.url;
            opts.method = "POST";
        }
        return $.ajax(opts);
    };
    Datasource.prototype.deletePost = function(postId, opts) {
        opts.url = this.url + "/destroy/" + postId;
        return $.ajax(opts);
    };
    Datasource.prototype.onSaveSuccess = function() {
        return myBlog.getPosts();
    };
    return Datasource;
}();
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
    PostDetail.prototype.show = function() {
        if (blog.adminMode) {
            this.showAdminControls();
        }
        return document.getElementById("current-post").appendChild(this.el);
    };
    return PostDetail;
}(blog.PostView);
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
    PostSummary.prototype.show = function() {
        if (blog.adminMode) {
            this.showAdminControls();
        }
        return document.getElementById("older-posts").appendChild(this.el);
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
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
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

blog.Posts = function(superClass) {
    extend(Posts, superClass);
    function Posts() {
        this.hideAll = bind(this.hideAll, this);
        this.createNew = bind(this.createNew, this);
        this.toggleAdminMode = bind(this.toggleAdminMode, this);
        this.onShowPost = bind(this.onShowPost, this);
        this.onGetPostsError = bind(this.onGetPostsError, this);
        this.showList = bind(this.showList, this);
        this.setPosts = bind(this.setPosts, this);
        this.getPosts = bind(this.getPosts, this);
        this.datasource = new blog.Datasource();
        this.el = document.getElementById("posts");
        this.currentPost = null;
        this.buildBackButton();
        this.getPosts();
    }
    Posts.prototype.buildBackButton = function() {
        this.backButton = document.createElement("a");
        this.backButton.href = "javascript:void(0)";
        return this.backButton.textContent = "<< Back to all posts";
    };
    Posts.prototype.getPosts = function() {
        this.hideAll();
        delete this.posts;
        return this.datasource.getPosts().done(this.setPosts).fail(this.onGetPostsError);
    };
    Posts.prototype.setPosts = function(posts) {
        this.posts = posts.map(function(_this) {
            return function(post, i) {
                return new blog.Post(post, _this.datasource, blog.colors[i % blog.colors.length]);
            };
        }(this));
        this.applyHandlers();
        return this.showList();
    };
    Posts.prototype.showList = function() {
        var i, j, len, post, ref, results;
        this.backButton.remove();
        this.hideAll();
        ref = this.posts;
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
            post = ref[i];
            if (i === 0) {
                results.push(post.showDetail());
            } else {
                results.push(post.showSummary());
            }
        }
        return results;
    };
    Posts.prototype.onGetPostsError = function() {
        return this.el.getElementById("load-error");
    };
    Posts.prototype.applyHandlers = function() {
        var j, len, post, ref, results;
        document.getElementById("blog-title").addEventListener("click", this.showList);
        ref = this.posts;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
            post = ref[j];
            post.on("showPost", this.onShowPost);
            post.on("showList", this.showList);
            post.on("postDeleted", this.getPosts);
            post.on("postSaved", this.getPosts);
            results.push(post.on("editPost", this.hideAll));
        }
        return results;
    };
    Posts.prototype.onShowPost = function(toShow) {
        var j, len, post, ref, results;
        ref = this.posts;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
            post = ref[j];
            if (post.context.id === toShow.context.id) {
                post.hideSummary();
                this.currentPost = post;
                results.push(post.showDetail());
            } else {
                post.hideDetail();
                results.push(post.showSummary());
            }
        }
        return results;
    };
    Posts.prototype.showBackButton = function() {
        this.backButton.addEventListener("click", this.showList);
        return document.getElementById("posts").appendChild(this.backButton);
    };
    Posts.prototype.toggleAdminMode = function() {
        var button, j, k, len, len1, post, ref, ref1, results, results1;
        blog.adminMode = !blog.adminMode;
        button = document.getElementById("toggle-admin");
        if (blog.adminMode) {
            button.textContent = "Turn off Admin Mode";
            this.showCreateButton();
            ref = this.posts;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
                post = ref[j];
                results.push(post.showAdminControls());
            }
            return results;
        } else {
            button.textContent = "Turn on Admin Mode";
            this.hideCreateButton();
            ref1 = this.posts;
            results1 = [];
            for (k = 0, len1 = ref1.length; k < len1; k++) {
                post = ref1[k];
                results1.push(post.hideAdminControls());
            }
            return results1;
        }
    };
    Posts.prototype.showCreateButton = function() {
        return document.getElementById("create").style.display = "block";
    };
    Posts.prototype.hideCreateButton = function() {
        return document.getElementById("create").style.display = "none";
    };
    Posts.prototype.createNew = function() {
        this.hideAll();
        this.createPostView = new blog.PostEdit({}, this.datasource);
        this.createPostView.on("postSaved", this.getPosts);
        return document.getElementById("posts").appendChild(this.createPostView.el);
    };
    Posts.prototype.hideAll = function() {
        var j, len, post, ref, results;
        if (this.backbutton) {
            this.backbutton.remove();
        }
        if (this.createPostView) {
            this.createPostView.hide();
        }
        if (this.posts) {
            ref = this.posts;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
                post = ref[j];
                results.push(post.hideAll());
            }
            return results;
        }
    };
    return Posts;
}(blog.Observable);
},{}],9:[function(require,module,exports){
var blog;

blog = {};

require("./Observable.js");

require("./Datasource.js");

require("./PostView.js");

require("./PostSummary.js");

require("./PostDetail.js");

require("./PostEdit.js");

require("./Post.js");

require("./Posts.js");
},{"./Datasource.js":1,"./Observable.js":2,"./Post.js":3,"./PostDetail.js":4,"./PostEdit.js":5,"./PostSummary.js":6,"./PostView.js":7,"./Posts.js":8}]},{},[9]);
