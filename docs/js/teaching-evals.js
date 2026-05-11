document.addEventListener('DOMContentLoaded', function() {
  renderGroupedEvaluationChart();
  renderPolytechniqueEvaluationChart();
});

function renderGroupedEvaluationChart() {
  const svg = document.getElementById('bar-chart');
  if (!svg) return;

  const data = [
    {
      question: 'Seemed well prepared\nfor class meetings',
      personal: 4.93,
      college: 4.825,
      university: 4.8
    },
    {
      question: 'Explained material\nclearly',
      personal: 4.89,
      college: 4.725,
      university: 4.7
    },
    {
      question: 'Treated students\nwith respect',
      personal: 4.91,
      college: 4.825,
      university: 4.8
    }
  ];

  const width = 800;
  const height = 400;
  const margin = { top: 40, right: 150, bottom: 120, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const yMin = 4.5;
  const yMax = 5.0;
  const yScale = (value) => margin.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
  const barWidth = 40;
  const groupWidth = barWidth * 3 + 20;
  const startX = margin.left + (chartWidth - groupWidth * data.length) / 2;

  clearSvg(svg);
  drawAxes(svg, { margin, chartWidth, chartHeight, yMin, yMax, yScale, tickCount: 10, labelEvery: 2 });

  data.forEach(function(item, index) {
    const groupX = startX + index * groupWidth;
    const bars = [
      { value: item.personal, className: 'bar-personal', label: item.personal.toFixed(2), x: groupX },
      { value: item.college, className: 'bar-college', label: item.college.toFixed(3), x: groupX + barWidth + 5 },
      { value: item.university, className: 'bar-university', label: item.university.toFixed(1), x: groupX + 2 * barWidth + 10 }
    ];

    bars.forEach(function(bar) {
      drawBar(svg, {
        x: bar.x,
        y: yScale(bar.value),
        width: barWidth,
        height: yScale(yMin) - yScale(bar.value),
        className: bar.className
      });
      drawText(svg, {
        x: bar.x + barWidth / 2,
        y: yScale(bar.value) - 5,
        text: bar.label,
        className: 'value-text',
        anchor: 'middle'
      });
    });

    drawMultilineLabel(svg, {
      lines: item.question.split('\n'),
      x: groupX + groupWidth / 2 - 10,
      y: margin.top + chartHeight + 20,
      className: 'question-text'
    });
  });

  drawLegend(svg, {
    x: margin.left + chartWidth + 20,
    y: margin.top + 50,
    items: [
      { label: 'Thomas Lloyd', className: 'bar-personal' },
      { label: 'College Median', className: 'bar-college' },
      { label: 'University Median', className: 'bar-university' }
    ]
  });
}

function renderPolytechniqueEvaluationChart() {
  const svg = document.getElementById('bar-chart-2');
  if (!svg) return;

  const data = [
    { label: 'Thomas Lloyd', value: 4.55, className: 'bar-personal' },
    { label: 'Course Average\nAcross Instructors', value: 3.85, className: 'bar-college' }
  ];

  const width = 400;
  const height = 350;
  const margin = { top: 40, right: 40, bottom: 100, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const yMin = 3.0;
  const yMax = 5.0;
  const yScale = (value) => margin.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
  const barWidth = 40;
  const groupSpacing = 80;
  const startX = margin.left + (chartWidth - (barWidth * 2 + groupSpacing)) / 2;

  clearSvg(svg);
  drawAxes(svg, { margin, chartWidth, chartHeight, yMin, yMax, yScale, tickCount: 8, labelEvery: 2 });

  data.forEach(function(item, index) {
    const barX = startX + index * (barWidth + groupSpacing);

    drawBar(svg, {
      x: barX,
      y: yScale(item.value),
      width: barWidth,
      height: yScale(yMin) - yScale(item.value),
      className: item.className
    });

    drawText(svg, {
      x: barX + barWidth / 2,
      y: yScale(item.value) - 5,
      text: item.value.toFixed(2),
      className: 'value-text',
      anchor: 'middle'
    });

    drawMultilineLabel(svg, {
      lines: item.label.split('\n'),
      x: barX + barWidth / 2,
      y: margin.top + chartHeight + 20,
      className: 'question-text'
    });
  });
}

function drawAxes(svg, config) {
  const { margin, chartWidth, chartHeight, yMin, yMax, yScale, tickCount, labelEvery } = config;

  for (let i = 0; i <= tickCount; i++) {
    const value = yMin + (i / tickCount) * (yMax - yMin);
    const y = yScale(value);

    drawLine(svg, {
      x1: margin.left,
      y1: y,
      x2: margin.left + chartWidth,
      y2: y,
      className: 'grid-line'
    });

    if (i % labelEvery === 0) {
      drawText(svg, {
        x: margin.left - 10,
        y: y + 4,
        text: value.toFixed(1),
        className: 'axis-text',
        anchor: 'end'
      });
    }
  }

  drawLine(svg, {
    x1: margin.left,
    y1: margin.top,
    x2: margin.left,
    y2: margin.top + chartHeight,
    className: 'axis-line'
  });

  drawLine(svg, {
    x1: margin.left,
    y1: margin.top + chartHeight,
    x2: margin.left + chartWidth,
    y2: margin.top + chartHeight,
    className: 'axis-line'
  });
}

function drawLegend(svg, config) {
  config.items.forEach(function(item, index) {
    const y = config.y + index * 25;

    drawBar(svg, {
      x: config.x,
      y,
      width: 15,
      height: 15,
      className: item.className
    });

    drawText(svg, {
      x: config.x + 20,
      y: y + 12,
      text: item.label,
      className: 'legend-text'
    });
  });
}

function drawMultilineLabel(svg, config) {
  config.lines.forEach(function(line, index) {
    drawText(svg, {
      x: config.x,
      y: config.y + index * 14,
      text: line,
      className: config.className,
      anchor: 'middle'
    });
  });
}

function drawBar(svg, config) {
  const rect = createSvgElement('rect');
  rect.setAttribute('x', config.x);
  rect.setAttribute('y', config.y);
  rect.setAttribute('width', config.width);
  rect.setAttribute('height', config.height);
  rect.setAttribute('class', config.className);
  svg.appendChild(rect);
}

function drawLine(svg, config) {
  const line = createSvgElement('line');
  line.setAttribute('x1', config.x1);
  line.setAttribute('y1', config.y1);
  line.setAttribute('x2', config.x2);
  line.setAttribute('y2', config.y2);
  line.setAttribute('class', config.className);
  svg.appendChild(line);
}

function drawText(svg, config) {
  const text = createSvgElement('text');
  text.setAttribute('x', config.x);
  text.setAttribute('y', config.y);
  text.setAttribute('class', config.className);
  if (config.anchor) text.setAttribute('text-anchor', config.anchor);
  text.textContent = config.text;
  svg.appendChild(text);
}

function clearSvg(svg) {
  while (svg.firstChild) {
    svg.removeChild(svg.firstChild);
  }
}

function createSvgElement(tagName) {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}
