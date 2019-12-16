import * as d3 from 'd3'

let margin = { top: 100, left: 50, right: 100, bottom: 30 }

let height = 580 - margin.top - margin.bottom

let width = 750 - margin.left - margin.right

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
    '#018571',
    '#a6611a',
    '#80cdc1'
  ])

let line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.count)
  })

d3.csv(require('/data/protests2.csv'))
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
    .attr('class', 'c-line')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  svg
    .append('text')
    .attr('class', 'red-text')
    .attr('font-size', '12')
    //.attr('text-anchor', 'middle')
    .text('% of respondents have no trust in police')
    .attr('fill', '#a6611a')

  svg
    .append('text')
    .attr('class', 'blue-text')
    .attr('font-size', '12')
    .text('No. of protests by week')
    .attr('fill', '#018571')

    svg
    .append('text')
    .attr('class', 'tg-text')
    .attr('font-size', '12')
    .text('Tear gas usage')
    .attr('fill', '#80cdc1')

    svg
    .append('text')
    .attr('class', 'title')
    .attr('font-size', '20')
    .attr('font-weight', '600')
    .attr('text-anchor', 'middle')
    .text('Perception of HK Police Worsened as Protests Intensified')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)


  let rectWidth1 =
    xPositionScale(parseTime('08-13')) -
    xPositionScale(parseTime('06-20'))

    svg
    .append('rect')
    .attr('class', 'first-rect')
    .attr('x', xPositionScale(parseTime('06-20')))
    .attr('y', 0)
    .attr('width', rectWidth1)
    .attr('height', height)
    .attr('fill', '#f4a582')
    .attr('opacity', 0.5)
    .lower()
    .attr('visibility', 'hidden')

  let rectWidth2 =
  xPositionScale(parseTime('09-11')) -
  xPositionScale(parseTime('08-13'))

  svg
  .append('rect')
  .attr('class', 'sec-rect')
  .attr('x', xPositionScale(parseTime('08-13')))
  .attr('y', 0)
  .attr('width', rectWidth2)
  .attr('height', height)
  .attr('fill', '#f4a582')
  .attr('opacity', 0.5)
  .lower()
  .attr('visibility', 'hidden')

  let rectWidth3 =
  xPositionScale(parseTime('10-14')) -
  xPositionScale(parseTime('09-11'))

  svg
  .append('rect')
  .attr('class', 'third-rect')
  .attr('x', xPositionScale(parseTime('09-11')))
  .attr('y', 0)
  .attr('width', rectWidth3)
  .attr('height', height)
  .attr('fill', '#f4a582')
  .attr('opacity', 0.5)
  .lower()
  .attr('visibility', 'hidden')

  let rectWidth4 = width - xPositionScale(parseTime('10-14'))

  svg
  .append('rect')
  .attr('class', 'four-rect')
  .attr('x', xPositionScale(parseTime('10-14')))
  .attr('y', 0)
  .attr('width', rectWidth4)
  .attr('height', height)
  .attr('fill', '#f4a582')
  .attr('opacity', 0.5)
  .lower()
  .attr('visibility', 'hidden')

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

    d3.select('#first-stage').on('stepin', () => {
      svg.select('.first-rect').style('visibility', 'visible')
      svg.select('.sec-rect').style('visibility', 'hidden')      
      svg.select('.third-rect').style('visibility', 'hidden')
      svg.select('.four-rect').style('visibility', 'hidden')
    })

    d3.select('#second-stage').on('stepin', () => {
      svg.select('.first-rect').style('visibility', 'hidden')
      svg.select('.sec-rect').style('visibility', 'visible')
      svg.select('.third-rect').style('visibility', 'hidden')
      svg.select('.four-rect').style('visibility', 'hidden')
    })

    d3.select('#third-stage').on('stepin', () => {
      svg.select('.first-rect').style('visibility', 'hidden')
      svg.select('.sec-rect').style('visibility', 'hidden')
      svg.select('.third-rect').style('visibility', 'visible')
      svg.select('.four-rect').style('visibility', 'hidden')
    })

    d3.select('#fourth-stage').on('stepin', () => {
      svg.select('.first-rect').style('visibility', 'hidden')
      svg.select('.sec-rect').style('visibility', 'hidden')
      svg.select('.third-rect').style('visibility', 'hidden')
      svg.select('.four-rect').style('visibility', 'visible')
    })

    function render() {
      // Calculate height/width
      let screenWidth = svg.node().parentNode.parentNode.offsetWidth
      let screenHeight = window.innerHeight
      let newWidth = screenWidth - margin.left - margin.right
      let newHeight = screenHeight - margin.top - margin.bottom
  
      // Update your SVG
      let actualSvg = d3.select(svg.node().parentNode)
      actualSvg
        .attr('height', newHeight + margin.top + margin.bottom)
        .attr('width', newWidth + margin.left + margin.right)
  
      // Update scales (depends on your scales)
      xPositionScale.range([0, newWidth])
      yPositionScale.range([newHeight, 0])
  
      // Reposition/redraw your elements
      svg.selectAll('.c-line')
        .attr('d', function(d) {
          return line(d.values)
        })

      svg.select('.blue-text')
      .attr('y', function(d) {
        return yPositionScale(37)
      })
      .attr('x', function(d) {
        return xPositionScale(parseTime('10-08'))
      })

      svg.select('.red-text')
      .attr('y', function(d) {
        return yPositionScale(49)
      })
      .attr('x', function(d) {
        return xPositionScale(parseTime('10-08'))
      })
       
      svg.select('.tg-text')
      .attr('y', function(d) {
        return yPositionScale(1)
      })
      .attr('x', function(d) {
        return xPositionScale(parseTime('10-08'))
      })
     
      svg.select('.title')
        .attr('x', newWidth / 2)
  
        let rectWidth1 =
        xPositionScale(parseTime('08-13')) -
        xPositionScale(parseTime('06-20'))
  
      svg.select('.first-rect')
        .attr('x', xPositionScale(parseTime('06-20')))
        .attr('width', rectWidth1)
        .attr('height', newHeight)

        let rectWidth2 =
        xPositionScale(parseTime('09-11')) -
        xPositionScale(parseTime('08-13'))

      svg.select('.sec-rect')
        .attr('x', xPositionScale(parseTime('08-13')))
        .attr('width', rectWidth2)
        .attr('height', newHeight)

        let rectWidth3 =
        xPositionScale(parseTime('10-14')) -
        xPositionScale(parseTime('09-11'))
      
      svg.select('.third-rect')
        .attr('x', xPositionScale(parseTime('09-11')))
        .attr('width', rectWidth3)
        .attr('height', newHeight)

        let rectWidth4 = newWidth - xPositionScale(parseTime('10-14'))

      svg.select('.four-rect')
        .attr('x', xPositionScale(parseTime('10-14')))
        .attr('width', rectWidth4)
        .attr('height', newHeight)
  
     // Update axes if necessary
      svg.select('.x-axis')
        .attr('transform', 'translate(0,' + newHeight + ')')
  
      svg.select('.x-axis').call(xAxis)
      svg.select('.y-axis').call(yAxis)
    }
  
    window.addEventListener('resize', render)
    render()
}