class blog.PostSummary extends blog.PostView
  constructor: (@context, @datasource, @color) ->
    @context.summary = @context.text.slice(0, 200)
    super

  buildEl: ->
    @links = {}

    @container = document.createElement 'div'
    @container.className = "post summary"
    @container.setAttribute 'data-id', @context.uuid

    @date = document.createElement 'div'
    @date.className = 'date'
    @date.style.backgroundColor = @color
    @container.appendChild @date

    weekday = document.createElement 'p'
    weekday.className = 'weekday'
    weekday.textContent = @context.date.day
    @date.appendChild weekday

    day = document.createElement 'p'
    day.className = 'day'
    day.textContent = @context.date.date
    @date.appendChild day

    month = document.createElement 'p'
    month.className = 'month'
    month.textContent = @context.date.month
    @date.appendChild month

    post = document.createElement 'div'
    post.className = 'content'
    @container.appendChild post

    title = document.createElement 'h2'
    title.className = 'title'
    post.appendChild title

    @links.title = document.createElement 'a'
    @links.title.textContent = @context.title
    @links.title.href = 'javascript:void(0)'
    title.appendChild @links.title

    text = document.createElement 'p'
    text.className = 'text'
    text.textContent = @context.summary
    post.appendChild text

    @links.ellipsis = document.createElement 'a'
    @links.ellipsis.href = 'javascript:void(0)'
    @links.ellipsis.textContent = '...'
    text.appendChild @links.ellipsis if @context.text.length > 200

    @actionButtons = document.createElement 'div'
    @actionButtons.className = 'action-buttons'
    @container.appendChild @actionButtons

    @container


  applyHandlers: ->
    @date.addEventListener 'click', @showPost
    @links.title.addEventListener 'click', @showPost
    @links.ellipsis.addEventListener 'click', @showPost
    super

  show: ->
    @showAdminControls() if blog.adminMode
    document.getElementById('older-posts').appendChild @el

  showPost: =>
    @fire 'showPost'

  showAdminControls: =>
    @container.appendChild @editButton
    @container.appendChild @deleteButton

