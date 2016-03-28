class Post < ActiveRecord::Base
  require 'securerandom'

  before_create :generate_uuid

  def generate_uuid
    self.uuid = SecureRandom.uuid
  end

  def timestamp
    self.created_at.strftime('%FT%R')
  end

end
