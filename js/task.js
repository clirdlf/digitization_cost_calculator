function calculateTaskTime(average_per_100, percentage, by, extent ){
  var costs = { total_time: 0, total: 0 };

  // var minute_rate = obj.by.total_minute_rate; // not being used?
  // var time = (obj.percentage / 100.0) * scans * obj.average;
  costs.total_time = percentage * extent * average_per_100;
  if(by.total_minute_rate){
    costs.total = costs.total_time * by.total_hourly_rate;
  }
  return costs;
}

function Task(category, label, percentage, time_per_100, by, extent) {
  this.category = category;
  this.label = label;
  this.by = by;
  this.percentage = percentage / 100;
  this.time_per_100 = time_per_100;
  this.time_per_minute = this.time_per_100 / 60;
  this.extent = extent;
  this.scans_per_hundred = this.extent / 100;
  this.costs = calculateTaskTime(this.time_per_100, this.percentage, this.by, this.scans_per_hundred);
  console.log(this);
}
