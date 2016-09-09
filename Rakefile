require 'erb'
require 'json'

require 'colorize'
require 'dotenv'
require 'dotenv/tasks'
require 'google_drive'

Dotenv.load

def login
  system('clear')
  puts 'Authorizing...'.green

  @session ||= GoogleDrive.saved_session('config.json')
  spreadsheet
end

def spreadsheet
  @ws ||= @session.spreadsheet_by_key(ENV['SPREADSHEET_KEY']).worksheets[0]
end

def render(template_path)
  template = File.open(template_path, 'r').read
  erb = ERB.new(template)
  erb.result(binding)
end

def write_file(path, contents)
  begin
    file = File.open(path, 'w')
    file.write(contents)
  rescue IOError => error
    puts "File not writeable. Check your permissions.".red
    puts error.inspect
  ensure
    file.close unless file == nil
  end
end

task default: 'convert:all'

namespace :convert do
  desc 'Run all conversions'
  task :all => [:data]

  desc 'Convert Google spreadsheet to JSON for the app'
  task data: :dotenv do
    login
    @data = []

    puts "Processing Google Spreadsheet".green

    # process the rows in the spreadsheet
    (2..@ws.num_rows).each do |row|
      data = {}

      
    end

    puts "Rendering calculator data".green
    #contents = render('templates/calculator_data.js.erb')
    #write_file('./data/calculator_data.js', contents)
  end
end
