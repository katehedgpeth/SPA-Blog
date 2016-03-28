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