async function drawScatter() {
  // your code goes here
  let dataset = await d3.json("./../../my_weather_data.json")
  
  // access points
  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity
  const colorAccessor = d => d.cloudCover  
  
  // define dimensions
  // 0.1 (10%) whitespace around the chart
  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])
  
  // use width variables to define the chart dimensions
  // margins around the bounds allocates space for our static chart elements
  // (axes and legends) while dynamically sizing chart area
  let dimensions = {
  	width: width,
  	height: width,
  	margin: {
  	  top: 10,
  	  right: 10,
  	  bottom: 50,
  	  left: 50,
  	},
  }
  
  // bounds live inside of the wrapper (index.html), containing the data elements
  dimensions.boundedWidth = dimensions.width
  	- dimensions.margin.left
  	- dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
  	- dimensions.margin.top
  	- dimensions.margin.bottom
  	
  
  // draw canvas (SVG elements)
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`)
  
  // scales
  const xScale = d3.scaleLinear()
  	.domain(d3.extent(dataset, xAccessor))
  	.range([0, dimensions.boundedWidth])
  	.nice()
  	
  const yScale = d3.scaleLinear()
  	.domain(d3.extent(dataset, yAccessor))
  	// invert so 0 starts at bottom
  	.range([dimensions.boundedHeight, 0])
  	.nice()
    
  // colors
  const colorScale = d3.scaleLinear() 
  	.domain(d3.extent(dataset, colorAccessor)) 
  	.range(["skyblue", "darkslategrey"])
  
  // draw
  
  // not a good way, will loop over if function called again
  //dataset.forEach(d => {
  //bounds
  //  .append("circle")
  //  .attr("cx", xScale(xAccessor(d)))
  //  .attr("cy", yScale(yAccessor(d)))
  //  .attr("r", 5)
  //})

// we’re joining our selected elements with our array of data points
  const dots = bounds.selectAll("circle") 
  	.data(dataset)
  	.enter().append("circle")
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr("r", 4)
    .attr("tabindex", "0")
    .attr("fill", d => colorScale(colorAccessor(d)))
    // one color .attr("r", 5).attr("fill", "cornflowerblue")
  
  //drawDots(dataset.slice(0, 200), "darkgrey")
  ////setTimeout(() => {
  ////  drawDots(dataset, "cornflowerblue")
  ////  }, 1000)
    
  ////function drawDots(dataset, color) {
////
////
  ////  const dots = bounds.selectAll("circle").data(dataset)
  ////
  ////    dots.join("circle") // will do same as merge(dots)
  ////      //.enter().append("circle")
  ////    // all will be blue if added bounds.selectAll("circle")
  ////    // start grey, turn all blue when added  .merge(dots)
  ////      .attr("cx", d => xScale(xAccessor(d)))
  ////      .attr("cy", d => yScale(yAccessor(d)))
  ////      .attr("r", 5)
  ////      .attr("fill", color)
  ////}
  
  // 6. Draw peripherals

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
     .attr("x", dimensions.boundedWidth / 2)
     .attr("y", dimensions.margin.bottom - 10)
     .attr("fill", "black")
     .style("font-size", "1.4em")
     .html("Dew point (&deg;F)")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

 const yAxis = bounds.append("g")
     .call(yAxisGenerator)

 const yAxisLabel = yAxis.append("text")
     .attr("x", -dimensions.boundedHeight / 2)
     .attr("y", -dimensions.margin.left + 10)
     .attr("fill", "black")
     .style("font-size", "1.4em")
     .text("Relative humidity")
     .style("transform", "rotate(-90deg)")
     .style("text-anchor", "middle")
  
}




drawScatter()
