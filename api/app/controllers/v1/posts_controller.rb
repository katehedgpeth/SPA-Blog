module V1
  class PostsController < ApplicationController

    skip_before_filter :verify_authenticity_token

    before_action :cors_preflight_check
    def cors_preflight_check
      if request.method == :options
        headers['Access-Control-Allow-Origin'] = '*'
        headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT'
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept, X-Requested-With, Session, Origin'
        headers['Access-Control-Max-Age'] = '1728000'
        render :text => '', :content_type => 'text/plain'
      end
    end

    before_filter :cors_set_access_control_headers
    def cors_set_access_control_headers
      puts request
      headers['Access-Control-Allow-Origin'] = '*'
      headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT'
      headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept, X-Requested-With, Session, Origin'
      headers['Access-Control-Max-Age'] = "1728000"
    end

    def index
      render :json => Post.order(:created_at).reverse.as_json({ :only => [:text, :title, :uuid, :id], :methods => [:timestamp] })
    end

    def show
      render :json => Post.find(params[:id]).as_json({ :only => [:text, :title, :uuid, :id], :methods => [:timestamp] })
    end

    def create
      render :json => Post.create(JSON.parse params[:post]).as_json({ :only => [:text, :title, :uuid, :id], :methods => [:timestamp] })
    end

    def edit
      render :json => Post.update(params[:id], JSON.parse(params[:post])).as_json({ :only => [:text, :title, :uuid, :id], :methods => [:timestamp] })
    end

    def destroy
      render :json => Post.destroy(params[:id]).as_json({ :only => [:text, :title, :uuid, :id], :methods => [:timestamp] })
    end
  end
end
