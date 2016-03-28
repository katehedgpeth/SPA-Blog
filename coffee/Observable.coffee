class blog.Observable

  on: (event, handler) ->
    (@events ||= {})[event] ||= $.Callbacks()
    @events[event].add(handler)

  fire: (event, params...) ->
    @events[event].fire(params...) if @events and @events[event]?

  randomInteger: (max, min = 0) ->
    Math.floor(Math.random() * (max - min + 1)) + min