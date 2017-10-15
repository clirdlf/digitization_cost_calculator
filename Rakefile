require 'erb'
require 'json'
require 'pp'

require 'colorize'
require 'dotenv'
require 'dotenv/tasks'
require 'google_drive'

Dotenv.load

require_relative 'lib/utilities'

task default: 'convert:all'

desc "List all header fields"
task headers: :dotenv do
  login
  puts @headers.keys
end

namespace :convert do
  desc 'Run all conversions'
  task :all => [:data]

  desc 'Convert Google spreadsheet to JSON for the app'
  task data: :dotenv do
    login
    puts "Processing Google Spreadsheet".green

    puts "Generating Image Capture stats file".yellow
    image_capture_stats

    puts "Generating Preparation of Materials data".yellow
    preparation_stats

    puts "Generating Quality Control data".yellow
    quality_control_stats

    puts "Generating Post Processing data".yellow
    post_processing_stats

    puts "Generaging Metadata Creation data".yellow
    metadata_stats

    puts "Generating Post-Preparation data".yellow
    post_preparation_stats

    puts "Rendering calculator data".green
    contents = render('templates/calculator_data.js.erb')
    write_file('./data/calculator_data.js', contents)

    puts "Creating human-readable data output".green
    contents = render('templates/raw-data.html.erb')
    write_file('./raw-data.md', contents)
  end
end
