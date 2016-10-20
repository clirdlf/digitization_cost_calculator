var estimate = {
  "extent": 0,
  "total_scans": function(){ return (parseFloat(this.extent) * 1200) / 100; },
  "capture_device": '',
  "capture_average": function(){
    var average = 0;
    if(image_capture[this.capture_device] && image_capture[this.capture_device].average){
      average = image_capture[this.capture_device].average;
    }
    return average;
  },
  task_group_estimate: function(generic){
    var costs = { total_time: 0, total: 0, salaried: 0, hourly: 0 };
    $.each(generic, function(task, obj){
      if(obj.by && obj.by.total_hourly_rate) {
        var hourly_rate = obj.by.total_hourly_rate;
        switch(obj.by.type) {
          case 'hourly':
            costs.hourly += (obj.average);
            break;
          case 'salaried':
            costs.hourly += (obj.average);
            break;
        }
      }
    });
    costs.total = costs.hourly + costs.salaried;
    return costs;
  },
  // "staff": function(){ return people; },
  preparation_estimate: function(){
    return this.task_group_estimate(this.preparation_of_materials);
  },
  "quality_control": 'level_1',
  quality_control_estimate: function(){
    var costs = { total_time: 0, total: 0, salaried: 0, hourly: 0 };
    if(quality_control_stats[this.quality_control] && quality_control_stats[this.quality_control].average){
      var average = quality_control_stats[this.quality_control].average;
      costs.total_time = average * this.extent;
      // are these salaried? and if so, which one?
    }

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
  "post_processing": {
    // ["alignment", "background_removal", "clean_up", "color_correction", "cropping", "stitching"]
    'alignment': {
      percentage: 0,
      by: '',
      average: post_processing_stats.alignment.average,
    },
    'background_removal': {
      percentage: 0,
      by: '',
      average: post_processing_stats.background_removal.average,
    },
    'clean_up': {
      percentage: 0,
      by: '',
      average: post_processing_stats.clean_up.average,
    },
    'color_correction': {
      percentage: 0,
      by: '',
      average: post_processing_stats.color_correction.average,
    },
    'cropping': {
      percentage: 0,
      by: '',
      average: post_processing_stats.cropping.average,
    },
    'stitching': {
      percentage: 0,
      by: '',
      average: post_processing_stats.stitching.average,
    },
  },
  post_processing_estimate: function(){
    return this.task_group_estimate(this.post_processing);
  },
  "post_preparation": {
      "desorting":{
        percentage: 0,
        by: '',
        average: post_preparation_stats.desorting.average,
      },
      "rebinding":{
        percentage: 0,
        by: '',
        average: post_preparation_stats.rebinding.average,
      },
      "refastening":{
        percentage: 0,
        by: '',
        average: post_preparation_stats.refastening.average,
      },
  },
  post_preparation_estimate: function() {
      return this.task_group_estimate(this.post_preparation);
  },
  "metadata": 'level_1',
  "metadata_estimate": function(){

  },
  "total_digitization_time": function(){
    return minutes_in_hours(this.total_scans() * this.capture_average());
  },
};
