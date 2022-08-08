// Load the full build.
const _ = require('lodash');

async function drawScatter(bee_data) {

  // Accessors
  const yAccessor = d => d.temp_mean;
  const dateParser = d3.timeParse("%Y-%m-%d %H:%M:%S");
  const xAccessor = d => dateParser(d.timestamp);
  const colorAccessor = d => d.humid_mean;
  const sizeAccessor = d => d.weight_mean;

  // format the data
  /*await bee_data.forEach(function(d) {
    d.timestamp = xAccessor(d.timestamp);
    console.log(d3.timeFormat('%B/%d/%Y')(new Date(d.timestamp)))
  });*/ 

  console.log(bee_data[2].timestamp)
  console.log(d3.timeParse(bee_data[2].timestamp))
  console.log(xAccessor(bee_data[2]))
  console.log(d3.extent(bee_data, xAccessor))
  console.log("size")
  console.log(d3.extent(bee_data, sizeAccessor))


  // 2. Create chart dimensions
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 500,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  }

  // bounded wraps the data points
  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  // 3. Draw canvas
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

  // 4. Create scales
  const xScale = d3.scaleTime()
    .domain(d3.extent(bee_data, xAccessor))
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain([-5, 38])
    .range([dimensions.boundedHeight, 0])

    console.log(d3.extent(bee_data, yAccessor))

  const colorScale = d3.scaleLinear()
  .domain(d3.extent(bee_data, colorAccessor))
  .range(["skyblue", "darkslategrey"])

  const sizeScale = await d3.scaleLinear()
    .domain(d3.extent(bee_data, sizeAccessor))
    .range([0, 3])

    console.log("scale")
    console.log(sizeScale(sizeAccessor(d3.min(bee_data))))
    console.log(sizeScale(sizeAccessor(d3.max(bee_data))))
    console.log(sizeScale(d3.extent(bee_data, sizeAccessor)[0]))
    //bee_data.forEach(b => console.log(sizeScale(b.weight_mean)))

    // 5. Draw data
  const dots = bounds.selectAll("circle")
    .data(bee_data)
    .enter().append("circle")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", d => sizeScale(sizeAccessor(d)))
      .attr("fill", d => colorScale(colorAccessor(d)))
      .attr("tabindex", "0")

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
      .html("Timestamp")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(12)
  
  const yAxis = bounds.append("g")
      .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .text("Temperature")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")
}

function drawDots(dataset, color) {
  const dots = bounds.selectAll("circle").data(bee_data)
    dots
      .enter().append("circle")
      .attr("cx", d => xScale(xAccessor(d)))
      .attr("cy", d => yScale(yAccessor(d)))
      .attr("r", 5)
      .attr("fill", color)
}

async function startHive(){
  // 1. Access data
  const dataset = await d3.json("./../../w_data.json");
  bee_data = dataset["bee_data"].slice(0,100);
  console.log(bee_data)
  forEach(bee_data, function(key){
    setTimeout(() => {
      console.log(key)
    })
  });
}

startHive()