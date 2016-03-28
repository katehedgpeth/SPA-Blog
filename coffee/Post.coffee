class blog.Post extends blog.Observable
  constructor: (@context, @datasource, @color) ->
    @setContext()
    @summary = new blog.PostSummary(@context, @datasource, @color)
    @detail  = new blog.PostDetail(@context, @datasource, @color)
    @edit    = new blog.PostEdit(@context, @datasource, @color)
    @applyHandlers()

  setContext: ->
    monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    date = new Date @context.timestamp
    @context.date =
      full: date
      day: dayNames[date.getDay()]
      month: monthNames[date.getMonth()]
      date: date.getDate()
      year: date.getFullYear()
      time: date.toLocaleTimeString()

  showSummary: ->
    @summary.show()

  hideSummary: ->
    @summary.hide()

  showDetail: =>
    @detail.show()

  hideDetail: ->
    @detail.hide()

  hideAll: ->
    @summary.hide()
    @detail.hide()
    @edit.hide()

  applyHandlers: ->
    @summary.on 'showPost', @onShowPost
    @detail.on 'showList', @onShowList
    @summary.on 'postDeleted', @onPostDeleted
    @detail.on 'postDeleted', @onPostDeleted
    @summary.on 'editPost', @onEditPost
    @detail.on 'editPost', @onEditPost

  onShowPost: =>
    @fire 'showPost', @summary

  onShowList: (e) =>
    @fire 'showList', @context

  showAdminControls: =>
    @summary.showAdminControls()
    @detail.showAdminControls()

  hideAdminControls: =>
    @summary.hideAdminControls()
    @detail.hideAdminControls()

  onPostDeleted: =>
    @fire 'postDeleted'

  onEditPost: =>
    @fire 'editPost'
    @edit.show()

  onPostSaved: (e) ->
    myBlog.getPosts()
