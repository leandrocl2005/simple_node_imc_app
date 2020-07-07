$.get("http://localhost:5000/api/hg", function (data, status) {
  console.log(status);
  Highcharts.chart("chart", {
    title: {
      text: "Solar Employment Growth by Sector, 2010-2016",
    },

    subtitle: {
      text: "Source: thesolarfoundation.com",
    },

    yAxis: {
      title: {
        text: "Number of Employees",
      },
    },

    xAxis: {
      accessibility: {
        rangeDescription: "Range: 2010 to 2017",
      },
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: 2010,
      },
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
      },
    },

    series: [
      {
        name: "Limite inferior",
        data: data.lim_inf,
      },
      {
        name: "Limite superior",
        data: data.lim_sup,
      },
      {
        name: "Contagem acumulada",
        data: data.cum_count,
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  });
});
