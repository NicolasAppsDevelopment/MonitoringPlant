async function lineChart(date_array, lum_array, hum_array, temp_array, o2_array, co2_array) {
  const myChart = document.getElementById('ChartCanvas');

  const tooltipLine =  {
    id: 'tooltipLine',
    beforeDraw: chart => {
      if (chart.tooltip._active && chart.tooltip._active.length) {
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
  
      const table = document.createElement('table');
      table.style.margin = '0px';
  
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
  
    return tooltipEl;
  };
  
  const externalTooltipHandler = (context) => {
    // Tooltip Element
    const {chart, tooltip} = context;
    const tooltipEl = getOrCreateTooltip(chart);
  
    // Hide if no tooltip
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
  
    // Set Text
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
  
        const td_mesure_type = document.createElement('td');
        const td_mesure_val = document.createElement('td');
        
        const data = body[0].split(" ");
        let data_name = data[0].replace(":", "");
        let data_val = data[1];

        switch (data_name) {
          case "O2":
            data_val += " mg/L";
            break;
          case "CO2":
            data_val += " g/L";
            break;
          case "Température":
            data_val += " °C";
            break;
          case "Luminosité":
            data_val += " Lm";
            break;
          case "Humidité":
            data_val += " %";
            break;
        
          default:
            break;
        }

        const text_mesure_type = document.createTextNode(data_name);
        const text_mesure_val = document.createTextNode(data_val);
  
        td_mesure_type.appendChild(span);
        td_mesure_type.appendChild(text_mesure_type);
        td_mesure_val.appendChild(text_mesure_val);
        tr.appendChild(td_mesure_type);
        tr.appendChild(td_mesure_val);
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

    if (positionX + tooltip.caretX > window.screen.width - tooltipEl.offsetWidth) {
      tooltipEl.style.left = positionX + tooltip.caretX - 12 - tooltipEl.offsetWidth + 'px';
    } else {
      tooltipEl.style.left = positionX + tooltip.caretX + 12 + 'px';
    }
    
    tooltipEl.style.top = positionY + 48 + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
  };

  new Chart(myChart, {
    type: 'line',
    data: {
      labels: date_array,
      datasets: [{
        label: 'CO2',
        data: co2_array,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "gray",
        backgroundColor: "gray",
      },{
        label: 'O2',
        data: o2_array,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "#eb1e4b",
        backgroundColor: "#eb1e4b",
      },{
        label: 'Température',
        data: temp_array,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "#f06937",
        backgroundColor: "#f06937",
      },{
        label: 'Humidité',
        data: hum_array,
        borderWidth: 3,
        pointStyle: 'dot',
        pointRadius: 0,
        pointHoverRadius: 5,
        borderColor: "#2d969b",
        backgroundColor: "#2d969b",
      },{
        label: 'Luminosité',
        data: lum_array,
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