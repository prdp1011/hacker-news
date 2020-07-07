export const INIT_DATA =  {
  labels: [],
  datasets: [
      {
          data: [],
          fill: false,
          borderColor: '#4bc0c0'
      }
  ]
};

export const CHART_OPTION =  {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Votes'
        }
      }],
      xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'ID'
            }
          }]
  }
};
export const LOAD_STATE = {
   LOADING: 'loading',
   EMPTY: 'empty',
   LOADED: 'loaded'
 };
