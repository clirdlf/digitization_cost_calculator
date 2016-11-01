var estimate = {
  "extent": 0,
  //"total_scans": function(){ return (parseFloat(this.extent) * 1200); },
  "total_scans": function(){ return this.extent; },
  "scans_per_hundred": function(){ return (this.total_scans() / 100.0); },
  "total_estimate": function(){
    var costs = { "total_time": 0, "total": 0 };

    // TODO: iterate on these
    var total_time = this.capture_estimate().total_time;
    var total = this.capture_estimate().total;

    total_time += this.quality_control_estimate().total_time;
    total+= this.quality_control_estimate().total;

    total_time += this.preparation_estimate().total_time;
    total+= this.preparation_estimate().total;

    total_time += this.post_processing_estimate().total_time;
    total+= this.post_processing_estimate().total;

    total_time += this.post_preparation_estimate().total_time;
    total+= this.post_preparation_estimate().total;

    total_time += this.metadata_estimate().total_time;
    total += this.metadata_estimate().total;

    total_time += this.other_tasks_estimate().total_time;
    total += this.other_tasks_estimate().total;

    costs.total_time = total_time;
    costs.total = total;

    return costs;

  },
  "capture_device": '',
  "capture_by": '',
  "capture_estimate": function(){
      var costs = { "total_time": 0, "total": 0 };
      costs.total_time = this.scans_per_hundred() * this.capture_average();
      if(this.capture_by && this.capture_by.total_minute_rate){
        costs.total = this.capture_by.total_minute_rate * costs.total_time;
      }
      return costs;
  },
  "capture_average": function(){
    var average = 0;
    if(image_capture[this.capture_device] && image_capture[this.capture_device].average){
      average = image_capture[this.capture_device].average;
    }
    return average;
  },
  task_group_estimate: function(generic){
    var costs = { total_time: 0, total: 0, salaried: 0, hourly: 0 };
    var scans = this.scans_per_hundred();
    $.each(generic, function(task, obj){
      if(obj.by && obj.by.total_minute_rate) {
        var minute_rate = obj.by.total_minute_rate; // not being used?
        var time = (obj.percentage / 100.0) * scans * obj.average;
        // console.log(time);
        costs.total_time += time;
        switch(obj.by.type) {
          case 'hourly':
            // costs.hourly += (obj.average);
            costs.hourly += (time * obj.by.total_minute_rate);
            break;
          case 'salaried':
            // costs.salaried += (obj.average);
            costs.salaried += (time * obj.by.total_minute_rate);
            break;
        }
      }
    });

    costs.total = costs.hourly + costs.salaried;
    return costs;
  },
  "quality_control" : {
    level: '',
    percentage: '',
    by: '',
    average: function(){
      return quality_control_stats[this.quality_control.level].average;
    }
  },
  // "quality_control": 'level_1',
  quality_control_estimate: function(){
    var costs = { total_time: 0, total: 0, salaried: 0, hourly: 0, average: 0 };

    if(quality_control_stats[this.quality_control.level] && quality_control_stats[this.quality_control.level].average){
      var average = quality_control_stats[this.quality_control.level].average;
      costs.average = average;
      costs.total_time = average * (this.quality_control.percentage / 100) * this.scans_per_hundred();
      costs.total = this.quality_control.by.total_minute_rate * (this.quality_control.percentage / 100) * costs.total_time;
    }

    return costs;
  },
  // TODO: make a task factory method
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
  },
  preparation_estimate: function(){
    return this.task_group_estimate(this.preparation_of_materials);
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
  // "metadata": 'level_1',
  "metadata": {
      "level": '',
      "by": '',
      "percentage": '',
      "average": function(){
        return metadata_stats[this.metadata.level].average;
      }
  },
  "metadata_estimate": function(){
    var costs = { total_time: 0, total: 0, salaried: 0, hourly: 0, average: 0 };
    // console.log('key', metadata_stats[this.metadata]);
    if(metadata_stats[this.metadata.level] && metadata_stats[this.metadata.level].average){
      var average = metadata_stats[this.metadata.level].average;
      costs.average = average;
      costs.total_time = average * (this.metadata.percentage / 100) * this.scans_per_hundred();
      costs.total = this.metadata.by.total_minute_rate * (this.metadata.percentage / 100) * costs.total_time;
    }

    return costs;
  },
  "total_digitization_time": function(){
    return minutes_in_hours(this.total_scans() * this.capture_average());
  },
  "other_tasks": {},
  "other_tasks_estimate": function(){
    var costs = { total_time: 0, total: 0, salaried: 0, hourly: 0 };
    var keys = Object.keys(this.other_tasks);


    // console.log('keys', keys);
    return costs;
  }
};
