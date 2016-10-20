var estimate = {
  "extent": 0,
  "total_scans": function(){ return parseFloat(this.extent) * 1200; },
  "capture_device": '',
  "capture_average": function(){
    var average = 0;
    if(image_capture[this.capture_device] && image_capture[this.capture_device].average){
      average = image_capture[this.capture_device].average;
    }
    return average;
  },
  // "staff": function(){ return people; },
  total_preperation_time: function(){
    costs = { total: 0, salaried: 0, hourly: 0 };
    $.each(this.preparation_of_materials, function(key, value){
      console.log(key);
    });
    return costs;
  },
  "preparation_of_materials": {
    // preparation
    //["condition_review", "disbinding", "fastener_removal", "flattening", "rights_review", "sort_materials_into_items"]
    'condition_review': {
      percentage: 0,
      by: '',
      average: preparation_stats.condition_review.average,
    },
    'disbanding': {
      percentage: 0,
      by: '',
      average: preparation_stats.disbinding.average,
    },
    'fastener_removal': {
      percentage: 0,
      by: '',
      average: preparation_stats.fastener_removal.average,
    },
    'flattening': {
      percentage: 0,
      by: '',
      average: preparation_stats.flattening.average,
    },
    'rights_review':{
      percentage: 0,
      by: '',
      average: preparation_stats.rights_review.average,
    },
    'sort_materials_into_items':{
      percentage: 0,
      by: '',
      average: preparation_stats.sort_materials_into_items.average,
    },
    'supporting':{
      percentage: 0,
      by: '',
      average: 0, // no data
    },
    'unique_id':{
      percentage: 0,
      by: '',
      average: 0, // no data
    },
    // 'condition_review_percent': 0,
    // 'condition_review_by': 0,
    // 'condition_review_average': preparation_stats.condition_review.average,
    // 'disbinding_percent': 0,
    // 'disbinding_by': 0,
    // 'disbinding_average': preparation_stats.disbinding.average,
    // 'fastener_removal_percent': 0,
    // 'fastener_removal_by': 0,
    // 'fastener_removal_average': preparation_stats.fastener_removal.average,
    // 'flattening_percent': 0,
    // 'flattening_by': 0,
    // 'flattening_average': preparation_stats.flattening.average,
    // 'rights_review_percent': 0,
    // 'rights_review_by': 0,
    // 'rights_review_average': preparation_stats.rights_review.average,
    // 'sort_materials_into_items_percent': 0,
    // 'sort_materials_into_items_by': 0,
    // 'sort_materials_into_items_average': preparation_stats.sort_materials_into_items.average,
    // 'unique_id_percent': 0,
    // 'unique_id_by': 0,
    // 'unique_id_average': 0, // no data
  },
  // post-processing
  'alignment_percent': 0,
  'alignment_average': 0,
  'alignment_by': 0,
  'background_removal_percent': 0,
  'background_removal_by': 0,
  'clean_up_percent': 0,
  'clean_up_by': 0,
  'color_correction_percent': 0,
  'color_correction_by': 0,
  'cropping_percent': 0,
  'cropping_by': 0,
  'stitching_percent': 0,
  'stitching_by': 0,
  "total_digitization_time": function(){
    return minutes_in_hours(this.total_scans() * this.capture_average());
  },
};
