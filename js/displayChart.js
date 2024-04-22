let chart;
let mouseX = 0;

/**
 * Mouse mouve listener to track the mouse X position.
 * In order to display correctly the tooltip.
 */
document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
});

function destroyChart() {
  if (chart != null || chart != undefined){
    chart.destroy();
  }
}

/**
 * Adds values to the chart of the selected measurement campaign. Used to update the chart from a refresh context.
 * @param {String[]} dateArray All measurement dates of the selected measurement campaign
 * @param {String[]} lumArray All luminosity values of the selected measurement campaign
 * @param {String[]} humArray All humidity values of the selected measurement campaign
 * @param {String[]} tempArray All temperature values of the selected measurement campaign
 * @param {String[]} o2Array All O2 values of the selected measurement campaign
 * @param {String[]} co2Array All CO2 values of the selected measurement campaign
 */
async function addValuesChart(dateArray, lumArray, humArray, tempArray, o2Array, co2Array) { 
  if (dateArray.length == 0) {
    return;
  } 

  dateArray.forEach(date => {
    chart.data.labels.push(date);
  });
  
  chart.data.datasets.forEach((dataset) => {
    switch (dataset.label) {
      case "O2":
        o2Array.forEach(o2 => {
          dataset.data.push(o2);
        });
        break;

      case "CO2":
        co2Array.forEach(co2 => {
          dataset.data.push(co2);
        });
        break;


      case "Température":
        tempArray.forEach(temp => {
          dataset.data.push(temp);
        });
        break;

      case "Humidité":
        humArray.forEach(hum => {
          dataset.data.push(hum);
        });
        break;

      case "Luminosité":
        lumArray.forEach(lum => {
          dataset.data.push(lum);
        });
        break;
    
      default:
        break;
    }
  });

  chart.update('none');
} 

/**
 * Setups the chart and adds values to the chart of the selected measurement campaign.
 * @param {String[]} dateArray All measurement dates of the selected measurement campaign
 * @param {String[]} lumArray All luminosity values of the selected measurement campaign
 * @param {String[]} humArray All humidity values of the selected measurement campaign
 * @param {String[]} tempArray All temperature values of the selected measurement campaign
 * @param {String[]} o2Array All O2 values of the selected measurement campaign
 * @param {String[]} co2Array All CO2 values of the selected measurement campaign
 * @returns {(Element|void)}  returns a html element, the tooltip
 */
async function initChart(dateArray, lumArray, humArray, tempArray, o2Array, co2Array) {
  const myChart = document.getElementById('ChartCanvas');

  const tooltipLine =  {
    id: 'tooltipLine',
    afterDraw: chart => {
      if (chart.tooltip._active?.length) {
        const ctx = chart.ctx;
        ctx.save();
        
        const activePoint = chart.tooltip._active[0];
        ctx.beginPath();
        ctx.setLineDash([7, 7]);
        ctx.moveTo(activePoint.element.x, chart.chartArea.top);
        ctx.lineTo(activePoint.element.x, chart.chartArea.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "gray";
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.classList.add("tooltipChart_container");

      document.getElementById('ChartCanvas').addEventListener('touchstart', (ev) => {
        tooltipEl.style.opacity = 0;
      }, false);
  
      const table = document.createElement('table');
      table.style.margin = '0px';
  
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
  };
  
  /**
   * Handler for the measure detail tooltip displayed when the mouse is over the graph
   */
  const externalTooltipHandler = (context) => {
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);
  
    // Hides if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Sets tooltip Text
    if (tooltip.body) {
      const titleLines = tooltip.title || [];
      const bodyLines = tooltip.body.map(b => b.lines);
  
      const tableHead = document.createElement('thead');
  
      titleLines.forEach(title => {
        const tr = document.createElement('tr');
  
        const th = document.createElement('th');
        const text = document.createTextNode(title);
  
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
  
      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body, i) => {
        const colors = tooltip.labelColors[i];
  
        const span = document.createElement('span');
        span.style.background = colors.backgroundColor;
  
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
  
        const tdMesureType = document.createElement('td');
        const tdMesureValue = document.createElement('td');
        
        const data = body[0].split(" ");
        let dataName = data[0].replace(":", "");
        let dataValue = data[1];

        switch (dataName) {
          case "O2":
            dataValue += " %";
            break;
          case "CO2":
            dataValue += " vol%";
            break;
          case "Température":
            dataValue += " °C";
            break;
          case "Luminosité":
            dataValue += " %";
            break;
          case "Humidité":
            dataValue += " %";
            break;
        
          default:
            break;
        }

        const textMesureType = document.createTextNode(dataName);
        const textMesureValue = document.createTextNode(dataValue);
  
        tdMesureType.appendChild(span);
        tdMesureType.appendChild(textMesureType);
        tdMesureValue.appendChild(textMesureValue);
        tr.appendChild(tdMesureType);
        tr.appendChild(tdMesureValue);
        tableBody.appendChild(tr);
      });
  
      const tableRoot = tooltipEl.querySelector('table');
  
      // Remove old children
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
  
      // Add new children
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
  
    const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;

    if (mouseX + 12 + tooltipEl.offsetWidth > document.body.clientWidth - 12) {
      tooltipEl.style.left = positionX + tooltip.caretX - 12 - tooltipEl.offsetWidth + 'px';
    } else {
      tooltipEl.style.left = positionX + tooltip.caretX + 12 + 'px';
    }
    
    tooltipEl.style.top = positionY + 48 + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
  };

  myChart.innerHTML = "";
  chart = new Chart(myChart, {
    type: 'line',
    data: {
      labels: dateArray,
      datasets: [{
        label: 'CO2',
        data: co2Array,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "gray",
        backgroundColor: "gray",
      },{
        label: 'O2',
        data: o2Array,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "#eb1e4b",
        backgroundColor: "#eb1e4b",
      },{
        label: 'Température',
        data: tempArray,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "#f06937",
        backgroundColor: "#f06937",
      },{
        label: 'Humidité',
        data: humArray,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "#2d969b",
        backgroundColor: "#2d969b",
      },{
        label: 'Luminosité',
        data: lumArray,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "#f5dc50",
        backgroundColor: "#f5dc50",
      }]
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        axis: 'x'
      },
      scales: {
        y: {
          beginAtZero: true
        },
      },
      plugins: {
        tooltipLine,
        tooltip: {
          enabled: false,
          position: 'average',
          external: externalTooltipHandler
        },
      }
    },
    plugins: [tooltipLine],
  });
};