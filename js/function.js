async function lineChart() {
  const myChart = document.getElementById('ChartCanvas');
  
  new Chart(myChart, {
    type: 'line',
    data: {
      labels: ['Février', 'Mars', 'Avril', 'Mai', 'Juin','Juillet'],
      datasets: [{
        label: 'CO2',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      },{
        label: 'O2',
        data: [5, 2, 7],
        borderWidth: 1
      },{
        label: 'Température',
        data: [5,9,3,4,2,3],
        borderWidth: 1
      },{
        label: 'Humidité',
        data: [14,16,11, ,15,12],
        borderWidth: 1
      },{
        label: 'Luminosité',
        data: [7,5,3,4,9,0],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  });
};


document.addEventListener("DOMContentLoaded", () => {
  lineChart();
});