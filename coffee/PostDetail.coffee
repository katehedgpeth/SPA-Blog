class blog.PostDetail extends blog.PostView

  buildEl: ->
    @container = document.createElement('div')
    @container.className = 'post detail'
    @container.setAttribute('data-id', @context.id)

    title = document.createElement('h1')
    title.className = 'title'
    title.textContent = @context.title
    title.setAttribute 'style', "color: #{@color}"
    @container.appendChild(title)

    date = document.createElement 'p'
    date.className = 'date'
    date.textContent = "#{@context.date.day}, #{@context.date.month} #{@context.date.date}, #{@context.date.year}, #{@context.date.time}"
    @container.appendChild date

    text = document.createElement 'p'
    text.className = 'text'
    text.textContent = @context.text
    @container.appendChild text

    @container

  goBack: (e) =>
    @fire 'showList'
