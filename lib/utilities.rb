##
# Login to Google Drive with credentials

def login
  system('clear')
  puts 'Authorizing...'.green

  @session ||= GoogleDrive.saved_session('config.json')
  spreadsheet
end

def map_headers
  @headers = {}
  (1..@ws.num_cols).each do |c|
    @headers[@ws[1, c]] = c
  end
end

##
# Set the spreadsheet to use
def spreadsheet
  @ws ||= @session.spreadsheet_by_key(ENV['SPREADSHEET_KEY']).worksheets[0]
  map_headers
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
  file = File.open(path, 'w')
  file.write(contents)
rescue IOError => error
  puts 'File not writeable. Check your permissions.'.red
  puts error.inspect
ensure
  file.close unless file.nil?
end

##
# Clean extra text from header values in the spreadsheet

def clean_scanner_header(header)
  header.gsub(/Image Capture-/, '').gsub(/-Minutes per 100 scans/, '')
end

def clean_prep_header(header)
  header.gsub!(/Preparation of original materials -/, '')
  header.gsub!(/ per 100 scans/, '')
  header.gsub!(/ of materials on which process was performed \(i.e., "20" do not use the \% sign\)/, '')
  header.tr!(' ', '_')
  header.downcase
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
  columns = [
    'Preparation of original materials -Condition review-Minutes per 100 scans',
    'Preparation of original materials -Disbinding-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Disbinding-Minutes per 100 scans',
    'Preparation of original materials -Fastener removal-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Fastener removal-Minutes per 100 scans',
    'Preparation of original materials -Flattening-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Flattening-Minutes per 100 scans',
    'Preparation of original materials -Rights review-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Rights review-Minutes per 100 scans',
    'Preparation of original materials -Sort materials into items-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Sort materials into items-Minutes per 100 scans',
    'Preparation of original materials -Supporting-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Supporting-Minutes per 100 scans',
    'Preparation of original materials -Unique identifier assignment-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Unique identifier assignment-Minutes per 100 scans'
  ]

  # (24..35).each do |column|
  columns.each do |column|
    # Preparation of original materials -Flattening-Percent of materials on which process was performed (i.e., "20" do not use the % sign)
    # Preparation of original materials -Flattening-Minutes per 100 scans
    col = @headers[column]
    raw_header = clean_prep_header(@ws[1, col])
    # split on -; [0] is the key
    key = raw_header.split('-')[0]
    @prep_times.merge!(key.to_s => { 'average' => 0, 'raw_times' => [] })
  end
end

def quality_control_stats
  @quality_control_stats ||= {}

  (1..3).each do |i|
    @quality_control_stats.merge!("level_#{i}" => { 'average' => 0, 'raw_times' => [] })
  end

  # Quality Control fields
  # 49: Quality control -I'm not submitting quality control data
  # 50: Quality control -Level 1
  # 51: Quality control -Level 2
  # 52: Quality control -Level 3
  # 53: Quality control-I'm not submitting quality control data-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 54: Quality control-I'm not submitting quality control data-Minutes per 100 scans
  # 55: Quality control-Level 1-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 56: Quality control-Level 1-Minutes per 100 scans
  # 57: Quality control-Level 2-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 58: Quality control-Level 2-Minutes per 100 scans
  # 59: Quality control-Level 3-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 60: Quality control-Level 3-Minutes per 100 scans

  # skip 49, 53 and 55 (no data)
  # 50 => 55, 56
  # 51 => 57, 58
  # 52 => 59, 60

  columns = [
    'Quality control-Level 1-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Quality control-Level 1-Minutes per 100 scans',
    'Quality control-Level 2-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Quality control-Level 2-Minutes per 100 scans',
    'Quality control-Level 3-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Quality control-Level 3-Minutes per 100 scans'
  ]

  (2..@ws.num_rows).each do |row|
    (0..columns.length).step(2) do |col|
      # (55..59).step(2) do |column|
      column = @headers[columns[col]]
      # unless @ws[row, column].empty?
      unless column.nil? || @ws[row, column].empty?

        v = {
          id: @ws[row, @headers['ID']],
          institution: @ws[row, @headers['Submitter information-Institution']],
          percentage: @ws[row, column],
          time:  @ws[row, column + 1],
          normalized: normalize_time(@ws[row, column], @ws[row, column + 1]),
          row: row
        }

        # puts v
        # case column
        case columns[col]
        when 'Quality control-Level 1-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)'
          # when 55
          @quality_control_stats['level_1']['raw_times'] << v
          break
        # when 57
        when 'Quality control-Level 2-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
          @quality_control_stats['level_2']['raw_times'] << v
          break
        # when 59
        when 'Quality control-Level 3-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
          @quality_control_stats['level_3']['raw_times'] << v
          break
        end
      end

      # puts v
    end
  end
  # calculate_normalized_average @quality_control_stats
  @quality_control_stats.each do |key, value|
    sum = 0
    average = 0
    min = 0 # TODO: set to first value in the value['raw_times'].first
    min = value['raw_times'].first[:time].to_f unless value['raw_times'].empty?
    max = 0
    @quality_control_stats[key]['raw_times'].sort_by! { |h| h[:institution] }
    @quality_control_stats[key]['raw_times'].each do |instance|
      sum += instance[:normalized]
      min = instance[:normalized].to_f if instance[:normalized].to_f < min
      max = instance[:normalized].to_f if instance[:normalized].to_f > max
    end
    average = sum / @quality_control_stats[key]['raw_times'].length unless @quality_control_stats[key]['raw_times'].empty?
    @quality_control_stats[key]['average'] = average
    @quality_control_stats[key]['min'] = min
    @quality_control_stats[key]['max'] = max
  end

  # TODO: write to js file
end

def sub_hash_stats(hash)
  hash.each do |key, value|
    sum = 0
    average = 0
    min = 0
    min = value['raw_times'].first[:time].to_f unless value['raw_times'].empty?
    max = 0

    # <% data['raw_times'].sort_by! {|h| h[:institution]} %>
    hash[key]['raw_times'].sort_by! { |h| h[:institution] }

    hash[key]['raw_times'].each do |instance|
      sum += instance[:normalized]
      min = instance[:normalized].to_f if instance[:normalized].to_f < min
      max = instance[:normalized].to_f if instance[:normalized].to_f > max
    end
    average = sum / value['raw_times'].length unless value['raw_times'].empty?
    hash[key]['average'] = average
    hash[key]['min'] = min
    hash[key]['max'] = max
    # hash['average'] = average
  end
end

##
# Create a hash of scanner types from the values in the spreadsheet
def scanner_types
  @scanner_types ||= {} # hash of scanner types
  # iterate over each row
  label = 'Image capture If you collected time data for image capture, please select the capture device for...'
  (2..@ws.num_rows).each do |row|
    col = @headers[label]
    value = @ws[row, col]
    @scanner_types.merge!(value.to_s => { 'raw_times' => [] }) unless value.empty?
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
  hash.each do |_key, val|
    val['min'] = val['raw_times'].min
    val['max'] = val['raw_times'].max
    val['average'] = average(val['raw_times'])
    val['median'] = median(val['raw_times'])
  end
end

def render_vals(hash)
  # TODO: refactor to
  hash.each do |_key, val|
    val['min'] = val['raw_times'].min
    val['max'] = val['raw_times'].max
    val['average'] = average(val['raw_times'])
    val['median'] = median(val['raw_times'])
  end
  # contents = render('templates/calculator_data.js.erb')
  # write_file('./data/calculator_data.js', contents)
end

def write_js
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
  columns = [
    'Preparation of original materials -Condition review-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Condition review-Minutes per 100 scans',
    'Preparation of original materials -Disbinding-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Disbinding-Minutes per 100 scans',
    'Preparation of original materials -Fastener removal-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Fastener removal-Minutes per 100 scans',
    'Preparation of original materials -Flattening-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Flattening-Minutes per 100 scans',
    'Preparation of original materials -Rights review-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Rights review-Minutes per 100 scans',
    'Preparation of original materials -Sort materials into items-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Sort materials into items-Minutes per 100 scans',
    'Preparation of original materials -Supporting-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Supporting-Minutes per 100 scans',
    'Preparation of original materials -Unique identifier assignment-Percent of materials on which process was performed (i.e., "20" do not use the % sign)',
    'Preparation of original materials -Unique identifier assignment-Minutes per 100 scans'
  ]

  counter = 0

  (2..@ws.num_rows).each do |row|
    # (24..37).step(2) do |column|
    (0..columns.length - 1).step(2) do |iterator|
      header = columns[iterator]
      column = @headers[header]
      raw_header = clean_prep_header(@ws[1, column])

      # hash to put these values in
      values = {}

      key = raw_header.split('-')[0]
      key.downcase.tr!(' ', '_') # clean up the parameters
      value = raw_header.split('-')[1] # percentage or minutes

      unless @ws[row, column].empty?
        values = {
          id: @ws[row, @headers['ID']],
          institution: @ws[row, @headers['Submitter information-Institution']],
          percentage: @ws[row, column],
          time: @ws[row, column + 1],
          normalized: normalize_time(@ws[row, column], @ws[row, column + 1]),
          row: row
        }
      end

      @prep_times[key]['raw_times'] << values unless values.empty?
    end
  end
  # TODO: calculate average times from raw_times
  calculate_prep_averages
end

# def calculate_normalized_average(hash)
#   hash.each do |key,value|
#     hash[key].each do |k,v|
#     sum = 0
#     average = 0
#     v['raw_times'].each do |instance|
#       sum += instance[:normalized]
#     end
#     average = sum / value['raw_times'].length unless value['raw_times'].length == 0
#       hash['key']['average'] = average
#     end
#   end
# end

def calculate_prep_averages
  @prep_times.each do |_key, value|
    sum = 0
    average = 0

    min = 0
    min = value['raw_times'].first[:time].to_f unless value['raw_times'].empty?

    max = 0
    median = 0
    value['raw_times'].each do |instance|
      sum += instance[:normalized]
      min = instance[:normalized] if instance[:normalized].to_f < min
      max = instance[:normalized] if instance[:normalized].to_f > max
    end
    average = sum / value['raw_times'].length unless value['raw_times'].empty?
    value['average'] = average
    value['min'] = min
    value['max'] = max
  end
end

def calcuate_image_capture_averages
  @scanner_types.each do |_key, value|
    sum = 0
    average = 0

    min = 0.0
    min = value['raw_times'].first[:time].to_f unless value['raw_times'].empty?
    max = 0.0
    median = 0.0

    value['raw_times'].sort_by! { |h| h[:institution] }

    value['raw_times'].each do |instance|
      sum += instance[:time].to_f
      # puts instance[:time].to_f < min
      min = instance[:time].to_f if instance[:time].to_f < min
      max = instance[:time].to_f if instance[:time].to_f > max
      # TODO: median
    end
    average = sum / value['raw_times'].length unless value['raw_times'].empty?
    value['average'] = average
    value['min'] = min
    value['max'] = max
  end
end

def normalize_time(percentage, time)
  100.0 * time.to_f / percentage.to_f
end

def post_processing_times
  @post_processing_times ||= {
    'alignment' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'background_removal' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'clean_up' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'color_correction' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'cropping' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'stitching' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] }
  }
end

def post_preparation_times
  @post_preparation_times ||= {
    'desorting' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'rebinding' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'refastening' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] }
  }
end

def post_preparation_stats
  post_preparation_times

  # 79: Post-preparation-De-sorting
  # 80: Post-preparation-Re-binding
  # 81: Post-preparation-Re-fastening
  # 82: Post-preparation.-De-sorting-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 83: Post-preparation.-De-sorting-Minutes per 100 scans
  # 84: Post-preparation.-Re-binding-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 85: Post-preparation.-Re-binding-Minutes per 100 scans
  # 86: Post-preparation.-Re-fastening-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 87: Post-preparation.-Re-fastening-Minutes per 100 scans

  columns = [
    'Post-preparation-De-sorting',
    'Post-preparation-Re-binding',
    'Post-preparation-Re-fastening'
  ]
  (2..@ws.num_rows).each do |row|
    # (79..81).each do |column|
    (0..columns.length).each do |col|
      column = @headers[columns[col]]
      next if (column.nil? || @ws[row, column].empty? )
      v = {
        id: @ws[row, @headers['ID']],
        institution: @ws[row, @headers['Submitter information-Institution']],
        percentage: @ws[row, column + 3],
        time: @ws[row, column + 4],
        normalized: normalize_time(@ws[row, column + 3], @ws[row, column + 4]),
        row: row
      }
      puts columns[col]
      # case column
      case columns[col]
      # when 79
      when 'Post-preparation-De-sorting'
        @post_preparation_times['desorting']['raw_times'] << v
        break
      # when 80
      when 'Post-preparation-Re-binding'
        @post_preparation_times['rebinding']['raw_times'] << v
        break
      # when 81
      when 'Post-preparation-Re-fastening'
        @post_preparation_times['refastening']['raw_times'] << v
        break
      end
    end
  end
  sub_hash_stats(@post_preparation_times)
end

def post_processing_stats
  post_processing_times

  # 61: Post-processing -Alignment/rotation
  # 62: Post-processing -Background removal (books/texts)
  # 63: Post-processing -Clean up/dust removal
  # 64: Post-processing -Color correction and tonal adjustment
  # 65: Post-processing -Cropping
  # 66: Post-processing -Stitching
  # 67: Post-processing-Alignment/rotation-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 68: Post-processing-Alignment/rotation-Minutes per 100 scans
  # 69: Post-processing-Background removal (books/texts)-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 70: Post-processing-Background removal (books/texts)-Minutes per 100 scans
  # 71: Post-processing-Clean up/dust removal-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 72: Post-processing-Clean up/dust removal-Minutes per 100 scans
  # 73: Post-processing-Color correction and tonal adjustment-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 74: Post-processing-Color correction and tonal adjustment-Minutes per 100 scans
  # 75: Post-processing-Cropping-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 76: Post-processing-Cropping-Minutes per 100 scans
  # 77: Post-processing-Stitching-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)
  # 78: Post-processing-Stitching-Minutes per 100 scans

  columns = [
    # 'Post-processing -Alignment/rotation',
    # 'Post-processing -Background removal (books/texts)',
    # 'Post-processing -Clean up/dust removal',
    # 'Post-processing -Color correction and tonal adjustment',
    # 'Post-processing -Cropping',
    # 'Post-processing -Stitching',
    'Post-processing-Alignment/rotation-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Post-processing-Alignment/rotation-Minutes per 100 scans',
    'Post-processing-Background removal (books/texts)-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Post-processing-Background removal (books/texts)-Minutes per 100 scans',
    'Post-processing-Clean up/dust removal-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Post-processing-Clean up/dust removal-Minutes per 100 scans',
    'Post-processing-Color correction and tonal adjustment-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Post-processing-Color correction and tonal adjustment-Minutes per 100 scans',
    'Post-processing-Cropping-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Post-processing-Cropping-Minutes per 100 scans',
    'Post-processing-Stitching-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
    'Post-processing-Stitching-Minutes per 100 scans'
  ]

  (2..@ws.num_rows).each do |row|
    # TODO: bug in this logic to populate the arrays
    # (67..78).step(2).each do |column|
    (0..columns.length).step(2).each do |col|
      column = @headers[columns[col]]

      next if column.nil? || @ws[row, column].empty?
      v = {
        id: @ws[row, @headers['ID']],
        institution: @ws[row, @headers['Submitter information-Institution']],
        percentage: @ws[row, column],
        time: @ws[row, column + 1],
        normalized: normalize_time(@ws[row, column], @ws[row, column + 1]),
        row: row
      }

      # case column
      case columns[col]
      # when 67
      when 'Post-processing-Alignment/rotation-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)'
        @post_processing_times['alignment']['raw_times'] << v
      # when 69
      when 'Post-processing-Background removal (books/texts)-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)'
        @post_processing_times['background_removal']['raw_times'] << v
      # when 71
      when 'Post-processing-Clean up/dust removal-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)'
        @post_processing_times['clean_up']['raw_times'] << v
      # when 73
      when 'Post-processing-Color correction and tonal adjustment-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)'
        @post_processing_times['color_correction']['raw_times'] << v
      # when 75
      when 'Post-processing-Cropping-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)'
        @post_processing_times['cropping']['raw_times'] << v
      # when 77
      when 'Post-processing-Stitching-Percent of materials on which process was performed (i.e., "20"; do not use the % sign)',
        @post_processing_times['stitching']['raw_times'] << v
      end
    end
  end

  sub_hash_stats(@post_processing_times)
end

##
# Generate image capture stats file
def image_capture_stats
  scanner_types
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
  type_lookup = 'Image CaptureÂ Exact type of scanner (make and model)'.freeze
  columns = [
    'Image Capture-Film or transparency scanner (i.e., Epson V700, Nikon Coolscan, Flextight X5)-Minutes per 100 scans',
    'Image Capture-Flatbed scanner (i.e., an Epson 11000XL)-Minutes per 100 scans',
    'Image Capture-Manual DSLR camera (i.e. Canon EOS 5D, Nikon D7200)-Minutes per 100 scans',
    'Image Capture-Medium format camera (i.e. PhaseOne, Hasselblad)-Minutes per 100 scans',
    'Image Capture-Overhead scanner (i.e., a Zeutschel, i2S Quartz or Digibook, Cruse)-Minutes per 100 scans',
    'Image Capture-Sheet feeding scanner (i.e., a Fujitsu)-Minutes per 100 scans',
    'Image Capture-V-Cradle scanner (i.e., ATIZ BookDrive Pro, Book2Net Cobra)-Minutes per 100 scans'
  ]
  (2..@ws.num_rows).each do |row|
    columns.each do |column|
      header = clean_scanner_header(column)
      type = @scanner_types[header]['raw_times']
      col = @headers[column]
      time = @ws[row, col]

      v = {
        institution: @ws[row, @headers['Submitter information-Institution']],
        time: time,
        row: row,
        id: @ws[row, @headers['ID']]
      }
      @scanner_types[header]['raw_times'] << v unless time.empty?
    end

    # (42..48).each do |column|
    #   header = clean_scanner_header(@ws[1, column]) # header
    #   type = @scanner_types[header]['raw_times']
    #   time = @ws[row, column]
    #
    #   v = {
    #     institution: @ws[row, @headers['Submitter information-Institution']],
    #     time: time,
    #     row: row
    #   }
    #   # type << time.to_f unless time.empty?
    #   @scanner_types[header]['raw_times'] << v unless time.empty?
    # end
  end
  @scanner_types.delete("I'm not submitting image capture data")
  calcuate_image_capture_averages
  # render_vals(@scanner_types)
end

def metadata_times
  values = { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] }

  @metadata_times ||= {
    'level_1' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'level_2' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] },
    'level_3' => { 'average' => 0, 'min' => 0, 'max' => 0, 'median' => 0, 'raw_times' => [] }
  }
end

def metadata_stats
  metadata_times

  # 88: Descriptive metadata creation -I'm not submitting metadata data
  # 89: Descriptive metadata creation -Level 1
  # 90: Descriptive metadata creation -Level 2
  # 91: Descriptive metadata creation -Level 3
  # 92: Descriptive metadata creation-I'm not submitting metadata data-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)
  # 93: Descriptive metadata creation-I'm not submitting metadata data-Minutes per 100 scans
  # 94: Descriptive metadata creation -Level 1-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)
  # 95: Descriptive metadata creation -Level 1-Minutes per 100 scans
  # 96: Descriptive metadata creation-Level 2-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)
  # 97: Descriptive metadata creation-Level 2-Minutes per 100 scans
  # 98: Descriptive metadata creation-Level 3-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)
  # 99: Descriptive metadata -Level 3-Minutes per 100 scans

  columns = [
    'Descriptive metadata creation -Level 1-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)',
    'Descriptive metadata creation -Level 1-Minutes per 100 scans',
    'Descriptive metadata creation-Level 2-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)',
    'Descriptive metadata creation-Level 2-Minutes per 100 scans',
    'Descriptive metadata creation-Level 3-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)',
    'Descriptive metadata -Level 3-Minutes per 100 scans'
  ]

  (2..@ws.num_rows).each do |row|
    # (94..99).step(2).each do |column|
    (0..columns.length).step(2).each do |col|
      column = @headers[columns[col]]
      next if ( column.nil? || @ws[row, column].empty? )
      v = {
        id: @ws[row, @headers['ID']],
        institution: @ws[row, @headers['Submitter information-Institution']],
        percentage: @ws[row, column],
        time: @ws[row, column + 1],
        normalized: normalize_time(@ws[row, column], @ws[row, column + 1]),
        row: row
      }

      # case column
      case columns[col]
      # when 94
      when 'Descriptive metadata creation -Level 1-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)'
        @metadata_times['level_1']['raw_times'] << v
        break
      # when 96
      when 'Descriptive metadata creation-Level 2-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)'
        @metadata_times['level_2']['raw_times'] << v
        break
      # when 98
      when 'Descriptive metadata creation-Level 3-Percent of scans on which process was performed (i.e., "20"; do not use the % sign)'
        @metadata_times['level_3']['raw_times'] << v
        break
      end
    end
  end

  sub_hash_stats(@metadata_times)
  # TODO: write to JS
  # puts @metadata_times
end
