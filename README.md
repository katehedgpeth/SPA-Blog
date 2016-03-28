Single Page Blog App
====================

This is a basic implementation of a blog platform as a single-page app. I wrote it using coffeescript, haml, sass and a rails api test server, and used Browserify to bundle the javascript files for output. I use CodeKit to compile my preprocessor code. All told, this took me about 6 or 7 hours to put together (probably one or two of which were entirely spent monkeying with the test server).

App Structure
-------------

The structure of the blog app mimics an MVC framework structure. The app is built by initializing a `blog.Posts` controller object. That object initializes a `blog.Datasource` object which fetches all existing blog post models from the server. The controller takes those models and creates a new `blog.Post` controller object for each post. Each post gets a summary view, a detail view, and an edit view.

There is also an Admin mode that can be toggled on or off (I didn't bother with credentials for this exercise). When Admin mode is enabled, the user sees Edit and Delete buttons for each blog post on the summary view and detail view, as well as a button in the header to create a new post (which uses the same `blog.EditView object that the posts use.

Test Server
-----------
The test server generates an intial set of blog posts to be returned to the site. (They're posts from The Onion, one of my go-to sources for dummy content.)

To run the test server:
1. Navigate to the /api folder in a terminal window
2. Run `bundle install`
3. When the bundle is finished installing, run `rake db:migrate` to set up the database
4. Once the migration is finished, run `rails server` to start the server
5. If at any time you want to reset the database, run `rake db:reset`

If you don't have rails installed on your computer, you will need to get that first, obviously.

Implementation Notes
--------------------

The instructions of this exercise specified to build this app using pure javascript only, no jQuery, with the exception of the `$.ajax` family of functions. However, since I decided to make my version a single-page app, and SPA's are so heavily reliant on non-DOM callbacks, I decided to use jquery's `$.Callbacks` functionality as the basis of my event triggering system, since it's complex and would likely take me a very long time to write my own implementation of it. Hopefully this is not a major sin on my part.

I also decided against attempting to use any libraries to handle template rendering, opting instead to build the templates in plain javascript. This is clunky and I would never do it in a real-life situation. I have traditionally used Rails and Hamlbars (a haml implementation of Handlebars) to handle template rendering, so I'm familiar with that kind of structure. I actually started out trying to use Handlebars for this project but the amount of time it was taking me to implement it felt like overkill for what I needed it for.

The exercise instructions specified that each blog post object has an `id` value which is a unique id for that post. I was not able to figure out a way to have rails return that value in the JSON object as `id` while still being able to know that `id` and `uuid` are different. I suspect that it is possible for those who are more familiar with rails than I am, but when I hadn't found it after about half an hour of looking, I gave up and decided to rename that attribute to `uuid`. The server does generate a new one for every new post.

The styling is pretty straightforward, as I was more focused on the functionality. I tried to give it a little bit of color. It relies on flexbox a fair amount, as do most of my designs these days. I kept the styles all in one file; if this were a larger application I would break them up into separate files for each page.
