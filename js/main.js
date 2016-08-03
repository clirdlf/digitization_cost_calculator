(function() {
    "use strict";

    // jQuery(function($) {

        const SCANS_PER_LINEAR_FOOT = 1200;
        const HOURS_IN_YEAR = 2080; // 52 weeks in a year @ 40 hours per week = 2080

        var linear_feet = 0,
            scanner = '',
            studentpay = 0,
            studentben = 0,
            staffpay = 0,
            staffben = 0,
            metadata = '',
            fastener = '',
            condition = '',
            ip = '',
            sort = '',
            flatten = '',
            fragile = '',
            disbind = '';

        // magic numbers
        var fastener_1000 = 75,
            conditionreview_1000 = 26.5,
            ipreview_1000 = 50.3,
            qualitycontrol_1000 = 300.8,
            $sort_1000 = 120,
            $flatten_1000 = 50,
            $fragile_1000 = 150,
            $disbind_1000 = 70,
            $scan_zeutschel_1000 = 756,
            $scan_phaseone_1000 = 976,
            $scan_fujitsu_1000 = 144,
            $scan_flatbed_1000 = 4000,
            $metadata0 = 0,
            $metadata1 = 5,
            $metadata2 = 25,
            $metadata3 = 50,
            $metadata4 = 70,
            $total_time = 0,
            $total_student = 0,
            $total_staff = 0;

        function calculate_linear_feet(extent) {
            return SCANS_PER_LINEAR_FOOT * parseInt(extent);
        }

        function calculate_student_rate(payrate, benefits) {
            return payrate + payrate * benefits;
        }

        function calculate_staff_rate(payrate, benefits) {
            return calculate_student_rate(payrate, benefits) / HOURS_IN_YEAR;
        }




    // });
}());
