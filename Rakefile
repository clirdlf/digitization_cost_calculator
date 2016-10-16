require 'erb'
require 'json'
require 'pp'

require 'colorize'
require 'dotenv'
require 'dotenv/tasks'
require 'google_drive'

Dotenv.load

##
# Login to Google Drive with credentials

def login
  system('clear')
  puts 'Authorizing...'.green

  @session ||= GoogleDrive.saved_session('config.json')
  spreadsheet
end

##
# Set the spreadsheet to use
def spreadsheet
  @ws ||= @session.spreadsheet_by_key(ENV['SPREADSHEET_KEY']).worksheets[0]
end

##
# Render an erb template

def render(template_path)
  template = File.open(template_path, 'r').read
  erb = ERB.new(template)
  erb.result(binding)
end

##
# Write the file for JavaScript

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

##
# Clean extra text from header values in the spreadsheet

def clean_scanner_header(header)
  header.gsub(/Image Capture-/,'').gsub(/-Minutes per 100 scans/,'')
end

def clean_prep_header(header)
  header.gsub!(/Preparation of original materials -/,'')
  header.gsub!(/ per 100 scans/, '')
  header.gsub!(/ of materials on which process was performed \(i.e., "20" do not use the \% sign\)/,'')
  header
end

def prep_times
  @prep_times ||= {}
  # 24 condition review % processed
  # 25 condition review time (per 100 scans)
  # 26 Disbinding-Percent
  # 27 Disbinding time
  # 28 Fastener removal %
  # 29 Fastener removal time
  # 30 Flattening %
  # 31 Flattening time
  # 32 Right review %
  # 33 Rights review time
  # 34 Sort Material %
  # 35 Sort Material Time
  # 34 Supporting Material %
  # 35 Supporting Material Time
  # 36 uuid %
  # 35 uuid time
  (24..35).each do |column|
    # Preparation of original materials -Flattening-Percent of materials on which process was performed (i.e., "20" do not use the % sign)
    # Preparation of original materials -Flattening-Minutes per 100 scans
    raw_header = clean_prep_header(@ws[1, column])
    # split on -; [0] is the key
    key = raw_header.split('-')[0]
    @prep_times.merge!("#{key}" => {'average' => 0, 'raw_times' => []})
  end
end

##
# Create a hash of scanner types from the values in the spreadsheet

def scanner_types
  @scanner_types ||= {} # hash of scanner types
  # iterate over each row
  (2..@ws.num_rows).each do |row|
    col = 40 # scanner type column (Image capture If you collected time data for image capture, please select the capture device for...)
    header = clean_scanner_header(@ws[row, col])
    # @scanner_types.merge!("#{header}" => {'min'=>0, 'max'=> 0, 'average' => 0,'median'=>0, 'raw_times' => []}) unless @ws[row,col].empty?
    @scanner_types.merge!("#{header}" => {'raw_times' => []}) unless @ws[row,col].empty?
  end
end

def median(array)
  sorted = array.sort
  len = sorted.length
  (sorted[(len - 1) / 2].to_f + sorted[len / 2].to_f) / 2.0
end

def average(array)
  array.inject(0.0) { |sum, val| sum + val / array.length }
end

def stats(hash)
  hash.each do |key, val|
    val['min'] = val['raw_times'].min
    val['max'] = val['raw_times'].max
    val['average'] = average(val['raw_times'])
    val['median'] = median(val['raw_times'])
  end
end

def render_vals(hash)
  # TODO: refactor to
  hash.each do |key, val|
    val['min'] = val['raw_times'].min
    val['max'] = val['raw_times'].max
    val['average'] = average(val['raw_times'])
    val['median'] = median(val['raw_times'])
  end

  contents = render('templates/calculator_data.js.erb')
  write_file('./data/calculator_data.js', contents)

end

def preparation_stats
  prep_times

  # 24 condition review % processed
  # 25 condition review time (per 100 scans)
  # 26 Disbinding-Percent
  # 27 Disbinding time
  # 28 Fastener removal %
  # 29 Fastener removal time
  # 30 Flattening %
  # 31 Flattening time
  # 32 Right review %
  # 33 Rights review time
  # 34 Sort Material %
  # 35 Sort Material Time
  # 34 Supporting Material %
  # 35 Supporting Material Time
  # 36 uuid %
  # 37 uuid time
  (2..@ws.num_rows).each do |row|
    (24..37).step(2) do |column|
      raw_header = clean_prep_header(@ws[1, column])
      # hash to put these values in
      values = {}

      key = raw_header.split('-')[0]
      value = raw_header.split('-')[1] # percentage or minutes

      values = {
        percentage: @ws[row,column],
        time: @ws[row,column + 1],
        regularized: regularize_time(@ws[row,column], @ws[row,column + 1])
      } unless @ws[row,column].empty?

      @prep_times[key]['raw_times'] << values unless values.empty?
    end
  end
  # calculate average times from raw_times
end



def calculate_prep_averages
  @prep_times.each do |key,value|
      sum = 0
      average = 0
      value['raw_times'].each do |instance|
        sum += instance[:regularized]
        # puts instance[:regularized]
      end
      average = sum / value['raw_times'].length unless value['raw_times'].length == 0
      puts average
      @prep_times[average] = average
  end

end

def regularize_time(percentage, time)
  100.0 * time.to_f / percentage.to_f
end

##
# Generate image capture stats file
def image_capture_stats
  scanner_types

  (2..@ws.num_rows).each do |row|
    # column mappings
    # 40 = Image Capture device
    # 41 = model
    # 42 = not submitting
    # 43 = Film or transparency
    # 44 = Flatbed
    # 45 = DSLR
    # 46 = Medium Format
    # 47 = Overhead
    # 48 = Sheet feeding
    (42..48).each do |column|
      header = clean_scanner_header(@ws[1, column]) # header
      type = @scanner_types[header]['raw_times']
      time = @ws[row, column]
      type << time.to_f unless time.empty?
    end
  end
  # TODO refactor so all the hashes get written at the same time
  render_vals(@scanner_types)
end

task default: 'convert:all'

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
    # puts "Rendering calculator data".green
    #contents = render('templates/calculator_data.js.erb')
    #write_file('./data/calculator_data.js', contents)
  end
end
