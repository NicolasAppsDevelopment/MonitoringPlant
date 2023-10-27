async function lineChart() {
  const myChart = document.getElementById('ChartCanvas');
  console.log(myChart);
  
  new Chart(myChart, {
    type: 'line',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};


document.addEventListener("DOMContentLoaded", () => {
  lineChart();
});