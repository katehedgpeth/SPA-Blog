class blog.Datasource
  constructor: ->
    @url = 'http://localhost:3000/v1/posts'

  getPosts: (opts) ->
    $.getJSON(@url)

  save: (opts) ->
    if opts.data.id
      opts.url = "#{@url}/#{opts.data.id}/edit"
      opts.method = 'GET'
    else
      opts.url = @url
      opts.method = 'POST'
    $.ajax(opts)

  deletePost: (postId, opts) ->
    opts.url = "#{@url}/destroy/#{postId}"
    $.ajax opts

  onSaveSuccess: ->
    myBlog.getPosts()