import * as Highcharts from 'highcharts';

export const columnChartOptions: Highcharts.Options = {
  chart: {
    type: 'column',
    animation: true,
  },
  exporting: {
    enabled: false,
    fallbackToExportServer: false,
  },
  title: {
    text: 'Completion Reports',
  },
  accessibility: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    type: 'category',
  },
  yAxis: [
    {
      title: {
        text: '<span style="font-weight: bold;font-size: 15px;font-family: arial;"><b>Count Completed (Percentage %)</b></span>',
      },
    },
    {
      opposite: true,
      title: {
        text: '',
      },
    },
  ],
  legend: {
    align: 'center',
    enabled: true,
    layout: 'horizontal',
    squareSymbol: true,
    symbolRadius: 0,
    verticalAlign: 'bottom',
  },
  plotOptions: {
    column: {
      shadow: false,
      borderWidth: 0,
      point: {
        events: {},
      },
    },
    series: {
      cursor: 'pointer',
      states: {
        inactive: {
          opacity: 1,
        },
        hover: {
          enabled: false,
          lineWidthPlus: 0,
        },
      },
    },
  },
  tooltip: {
    enabled: true,
    shared: false,
    useHTML: true,
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
    footerFormat: '</table>',
  },
  series: [
    {
      name: 'SOS Current Count',
      data: [],
      type: 'column',
      color: 'orange',
      visible: true,
      id: 'SOSInventory',
    },
    {
      name: 'UR Current Count',
      data: [],
      type: 'column',
      color: 'tan',
      visible: true,
      id: 'URInventory',
    },
  ],
  
};
