// Calculate the hourly rate for salaried employee calculations
function calculate_hourly_rate(salary, hours_per_week) {
    var hpw = (typeof hours_per_week !== 'undefined') ? hours_per_week : 40;
    return (parseFloat(salary) / 52.0 / parseFloat(hpw)).toFixed(2);
}

function Person(id, name, type, rate, benefits, hours_per_week) {
    // sets the hours_per_week to 40
    var hpw = (typeof hours_per_week !== 'undefined') ? hours_per_week : 40;
    this.id = parseInt(id);
    this.name = name;
    this.type = type;
    this.rate = rate;
    this.slug = name.sluggify();
    this.benefits_percent = benefits / 100;
    this.hours_per_week = hpw;

    if (this.type === 'salaried') {
        this.rate = parseFloat(calculate_hourly_rate(rate, hpw));
    } else {
        this.rate = parseFloat(rate);
    }

    this.hourly_benefits = (this.rate * this.benefits_percent).toFixed(2);
    this.total_hourly_rate = parseFloat(this.rate) + parseFloat(this.hourly_benefits);
    this.total_minute_rate = (this.total_hourly_rate / 60.0).toFixed(2);
}
