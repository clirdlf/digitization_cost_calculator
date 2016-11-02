$(function(){
  'use strict';
  $("#exportButton").click(function () {
    // parse the HTML table element having an id=exportTable
    var dataSource = shield.DataSource.create({
      data: "#exportTable",
      schema: {
        type: "table",
        fields: {
          Task: { type: String },
          "Sub-Task": { type: String },
          "% Materials": { type: Number },
          "Performed By": { type: String },
          "Time (minutes)": { type: Number },
          Cost: { type: Number }
        }
      }
    });

    // when parsing is done, export the data to Excel
    dataSource.read().then(function (data) {
      console.log('data', data);
      new shield.exp.OOXMLWorkbook({
        author: "Digitization Cost Calculator",
        worksheets: [
          {
            name: "Estimate",
            rows: [
              {
                cells: [
                  {
                    style: {
                      bold: true
                    },
                    type: String,
                    value: "Task"
                  },
                  {
                    style: {
                      bold: true
                    },
                    type: String,
                    value: "Sub-Task"
                  },
                  {
                    style: {
                      bold: true
                    },
                    type: String,
                    value: "% Materials"
                  },
                  {
                    style: {
                      bold: true
                    },
                    type: String,
                    value: "Performed By"
                  },
                  {
                    style: {
                      bold: true
                    },
                    type: String,
                    value: "Time (minutes)"
                  },
                  {
                    style: {
                      bold: true
                    },
                    type: String,
                    value: "Cost"
                  }
                ]
              }
            ].concat($.map(data, function(item) {
              console.log(item);
              return {
                cells: [
                  { type: String, value: item.Task },
                  { type: String, value: item["Sub-Task"] },
                  { type: Number, value: item["% Materials"]},
                  { type: String, value: item["Performed By"] },
                  { type: Number, value: item["Time (minutes)"] },
                  { type: Number, value: item.Cost }
                ]
              };
            }))
          }
        ]
      }).saveAs({
        fileName: "DigitazationCostEstimate"
      });
    });
  });
});
