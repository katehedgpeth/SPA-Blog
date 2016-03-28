class blog.PostEdit extends blog.PostView

  constructor: (@context, @datasource, @color) ->
    super

  buildEl: ->
    @container = document.createElement('div')
    @container.className = 'post edit'

    h1 = document.createElement('h1')
    h1.textContent = if @context.title || @context.text then 'Edit Post' else 'New Post'
    @container.appendChild h1

    @title = document.createElement('input')
    @title.type = 'text'
    @title.value = @context.title || null
    @container.appendChild(@title)

    @content = document.createElement('textarea')
    @content.value = @context.text || null
    @container.appendChild(@content)

    @saveButton = document.createElement('a')
    @saveButton.href = 'javascript:void(0)'
    @saveButton.className = 'save button'
    @saveButton.textContent = 'Save'
    @container.appendChild @saveButton

    @cancelButton = document.createElement 'a'
    @cancelButton.href = 'javascript:void(0)'
    @cancelButton.className = 'cancel button'
    @cancelButton.textContent = 'Cancel'
    @container.appendChild @cancelButton

    @container

  applyHandlers: ->
    @saveButton.addEventListener 'click', @onSaveClicked
    @cancelButton.addEventListener 'click', @onCancelClicked
    @title.addEventListener 'keyup', @onKeyUp
    @content.addEventListener 'keyup', @onKeyUp

  onSaveClicked: (e) =>
    e.stopImmediatePropagation()
    context = {title: @context.title, text: @context.text }
    @datasource.save({data: {id: @context.id, post: JSON.stringify(context) }, success: @onSaveSuccess })

  onCancelClicked: ->
    myBlog.getPosts()

  show: ->
    document.getElementById('posts').appendChild @el

  onKeyUp: =>
    @context.title = @title.value
    @context.text = @content.value

  onSaveSuccess: ->
    myBlog.getPosts()
