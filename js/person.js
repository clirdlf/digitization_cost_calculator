// Calculate the hourly rate for salaried employee calculations
function calculate_hourly_rate(salary, hours_per_week) {
    var hpw = (typeof hours_per_week !== 'undefined') ? hours_per_week : 40;
    return parseFloat(salary) / 52 / parseFloat(hpw);
}

function Person(id, name, type, rate, benefits, hours_per_week) {
    // sets the hours_per_week to 40
    var hpw = (typeof hours_per_week !== 'undefined') ? hours_per_week : 40;
    this.id = parseInt(id);
    this.name = name;
    this.type = type;
    this.slug = name.sluggify();
    this.benefits_percent = benefits;

    if (this.type === 'salaried') {
        this.rate = calculate_hourly_rate(rate, hpw);
    } else {
        this.rate = parseFloat(rate);
    }

    this.benefits = calculate_hourly_rate(this.benefits_percent * this.rate);
    this.total_hourly_rate = (this.rate + this.benefits).toFixed(2);
}
