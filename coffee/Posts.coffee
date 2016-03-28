class blog.Posts extends blog.Observable
  constructor: ->
    @datasource = new blog.Datasource()
    @el = document.getElementById('posts')
    @currentPost = null
    @buildBackButton()
    @getPosts()

  buildBackButton: ->
    @backButton = document.createElement('a')
    @backButton.href = 'javascript:void(0)'
    @backButton.textContent = '<< Back to all posts'

  getPosts: =>
    @hideAll()
    delete @posts
    @datasource.getPosts().done(@setPosts).fail(@onGetPostsError)

  setPosts: (posts) =>
    @posts = posts.map( (post, i) => new blog.Post(post, @datasource, blog.colors[i % blog.colors.length] ) )
    @applyHandlers()
    @showList()

  showList: =>
    @backButton.remove()
    @hideAll()
    post.showSummary() for post in @posts

  onGetPostsError: =>
    @el.getElementById('load-error')

  applyHandlers: ->
    document.getElementById('blog-title').addEventListener('click', @showList)
    for post in @posts
      post.on 'showPost', @onShowPost
      post.on 'showList', @showList
      post.on 'postDeleted', @getPosts
      post.on 'postSaved', @getPosts
      post.on 'editPost', @hideAll

  onShowPost: (toShow) =>
    for post in @posts
      post.hideSummary()
      if post.context.id == toShow.context.id
        @currentPost = post
        @showBackButton()
        post.showDetail()

  showBackButton: ->
    @backButton.addEventListener('click', @showList)
    document.getElementById('posts').appendChild(@backButton)

  toggleAdminMode: =>
    blog.adminMode = !blog.adminMode
    button = document.getElementById('toggle-admin')
    if blog.adminMode
      button.textContent = 'Turn off Admin Mode'
      @showCreateButton()
      post.showAdminControls() for post in @posts
    else
      button.textContent = 'Turn on Admin Mode'
      @hideCreateButton()
      post.hideAdminControls() for post in @posts

  showCreateButton: ->
    document.getElementById('create').style.display = 'block'

  hideCreateButton: ->
    document.getElementById('create').style.display = 'none'

  createNew: =>
    @hideAll()
    @createPostView = new blog.PostEdit({}, @datasource)
    @createPostView.on 'postSaved', @getPosts
    document.getElementById('posts').appendChild(@createPostView.el)

  hideAll: =>
    @backbutton.remove() if @backbutton
    @createPostView.hide() if @createPostView
    if @posts then post.hideAll() for post in @posts
