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