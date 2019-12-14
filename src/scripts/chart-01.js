import * as d3 from 'd3'

let margin = { top: 100, left: 50, right: 100, bottom: 30 }

let height = 600 - margin.top - margin.bottom

let width = 800 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let parseTime = d3.timeParse('%m-%d')

let xPositionScale = d3.scaleLinear().range([0, width])
let yPositionScale = d3.scaleLinear().domain([0, 52]).range([height, 0])

let colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
  ])

let line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.count)
  })

d3.csv(require('/data/protests.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.date)
  })
  let dates = datapoints.map(d => d.datetime)
  xPositionScale.domain(d3.extent(dates))

  let nested = d3
    .nest()
    .key(function(d) {
      return d.category
    })
    .entries(datapoints)

  console.log(nested)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  // svg
  //   .selectAll('circle')
  //   .data(nested)
  //   .enter()
  //   .append('circle')
  //   .attr('fill', function(d) {
  //     return colorScale(d.key)
  //   })
  //   .attr('r', 4)
  //   .attr('cy', function(d) {
  //     return yPositionScale(d.values[0].price)
  //   })
  //   .attr('cx', function(d) {
  //     return xPositionScale(d.values[0].datetime)
  //   })

  // svg
  //   .selectAll('text')
  //   .data(nested)
  //   .enter()
  //   .append('text')
  //   .attr('y', function(d) {
  //     return yPositionScale(d.values[0].price)
  //   })
  //   .attr('x', function(d) {
  //     return xPositionScale(d.values[0].datetime)
  //   })
  //   .text(function(d) {
  //     return d.key
  //   })
  //   .attr('dx', 6)
  //   .attr('dy', 4)
  //   .attr('font-size', '12')

  // svg
  //   .append('text')
  //   .attr('font-size', '24')
  //   .attr('text-anchor', 'middle')
  //   .text('U.S. housing prices fall in winter')
  //   .attr('x', width / 2)
  //   .attr('y', -40)
  //   .attr('dx', 40)

  // let rectWidth =
  //   xPositionScale(parseTime('February-17')) -
  //   xPositionScale(parseTime('November-16'))

  // svg
  //   .append('rect')
  //   .attr('x', xPositionScale(parseTime('December-16')))
  //   .attr('y', 0)
  //   .attr('width', rectWidth)
  //   .attr('height', height)
  //   .attr('fill', '#C2DFFF')
  //   .lower()

  let xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %d'))
    .ticks(10)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  let yAxis = d3.axisLeft(yPositionScale).ticks(7)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

    // function render() {
    //   // Calculate height/width
    //   let screenWidth = svg.node().parentNode.parentNode.offsetWidth
    //   let screenHeight = window.innerHeight
    //   let newWidth = screenWidth - margin.left - margin.right
    //   let newHeight = screenHeight - margin.top - margin.bottom
  
    //   // Update your SVG
    //   let actualSvg = d3.select(svg.node().parentNode)
    //   actualSvg
    //     .attr('height', newHeight + margin.top + margin.bottom)
    //     .attr('width', newWidth + margin.left + margin.right)
  
    //   // Update scales (depends on your scales)
    //   xPositionScale.range([0, newWidth])
    //   yPositionScale.range([newHeight, 0])
  
    //   // Reposition/redraw your elements
    //   svg.selectAll('.region-line')
    //     .attr('d', function(d) {
    //       return line(d.values)
    //     })
  
    //   svg.selectAll('.region-circle')
    //     .attr('cy', function(d) {
    //       return yPositionScale(d.values[0].price)
    //     })
    //     .attr('cx', function(d) {
    //       return xPositionScale(d.values[0].datetime)
    //     })
  
    //   svg.selectAll('.region-text')
    //     .attr('y', function(d) {
    //       return yPositionScale(d.values[0].price)
    //     })
    //     .attr('x', function(d) {
    //       return xPositionScale(d.values[0].datetime)
    //     })
  
    //   svg.select('.title')
    //     .attr('x', newWidth / 2)
  
    //   let rectWidth =
    //     xPositionScale(parseTime('February-17')) -
    //     xPositionScale(parseTime('November-16'))
  
    //   svg.select('.winter-rect')
    //     .attr('x', xPositionScale(parseTime('December-16')))
    //     .attr('width', rectWidth)
    //     .attr('height', newHeight)
  
    //   // Update axes if necessary
    //   svg.select('.x-axis')
    //     .attr('transform', 'translate(0,' + newHeight + ')')
  
    //   svg.select('.x-axis').call(xAxis)
    //   svg.select('.y-axis').call(yAxis)
    // }
  
    // window.addEventListener('resize', render)
    // render()
}