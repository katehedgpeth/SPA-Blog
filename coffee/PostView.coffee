class blog.PostView extends blog.Observable

  constructor: (@context, @datasource, @color) ->
    @el = @buildEl()
    @editButton = @buildAdminButton('Edit')
    @deleteButton = @buildAdminButton('Delete')
    @confirmDeletePopup = @buildConfirmDeletePopup()
    @applyHandlers()

  buildAdminButton: (type) ->
    button = document.createElement('a')
    button.href = 'javascript:void(0)'
    button.className = "#{type.toLowerCase()} button"
    button.textContent = type
    button

  buildConfirmDeletePopup: ->
    popup = document.createElement 'div'
    popup.className = 'confirm-popup'

    p = document.createElement 'p'
    p.textContent = 'Are you sure you want to delete this post?'
    popup.appendChild p

    @confirmDeleteButton = document.createElement 'a'
    @confirmDeleteButton.href = 'javascript:void(0)'
    @confirmDeleteButton.className = 'confirm-delete-button button'
    @confirmDeleteButton.textContent = 'Yes, delete it'
    popup.appendChild @confirmDeleteButton

    @cancelDeleteButton = document.createElement 'a'
    @cancelDeleteButton.href = 'javascript:void(0)'
    @cancelDeleteButton.className = 'cancel-delete-button button'
    @cancelDeleteButton.textContent = 'Cancel'
    popup.appendChild @cancelDeleteButton

    popup

  applyHandlers: ->
    @editButton.addEventListener('click', @editPost)
    @deleteButton.addEventListener('click', @deletePost)
    @confirmDeleteButton.addEventListener('click', @onConfirmDeletePost)
    @cancelDeleteButton.addEventListener('click', @onCancelDeletePost)

  show: ->
    @showAdminControls() if blog.adminMode
    document.getElementById('posts').appendChild @el

  hide: =>
    @el.remove()

  showAdminControls: ->
    @container.appendChild @editButton
    @container.appendChild @deleteButton
    @applyHandlers()

  hideAdminControls: ->
    @editButton.remove()
    @deleteButton.remove()

  editPost: =>
    @fire 'editPost'

  deletePost: =>
    document.body.appendChild @confirmDeletePopup
    @confirmDeletePopup.style['left'] = "#{(window.innerWidth / 2) - (@confirmDeletePopup.getBoundingClientRect().width / 2)}px"

  onConfirmDeletePost: =>
    @confirmDeletePopup.remove()
    @datasource.deletePost(@context.id, { success: @onDeletePost })

  onCancelDeletePost: =>
    @confirmDeletePopup.remove()

  onDeletePost: =>
    @fire 'postDeleted'