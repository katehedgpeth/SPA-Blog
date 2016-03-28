class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title
      t.string :text
      t.string :uuid
      t.timestamps null: false
    end
  end
end
