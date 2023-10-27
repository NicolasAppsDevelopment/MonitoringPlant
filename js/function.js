async function lineChart() {
  const myChart = document.getElementById('ChartCanvas');
  console.log(myChart);
  
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