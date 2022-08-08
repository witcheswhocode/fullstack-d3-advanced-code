

function toggleMove(){
  box = d3.select("circle").attr("class","move");
  console.log(box);
}   
function toggleMoveBack(){
  box = d3.select("circle.move").attr("class",".move-back");
  console.log(box);
}   

async function drawChart() {

  // 1. Access data
  //const dataset = await d3.json("./../../my_weather_data.json")

  // Accessors
  //const yAccessor = d => d.
  //const xAccessor = d => dateParser(d.date)

  // 2. Create chart dimensions
  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
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

  // bee start
  const circle = bounds.append("circle").attr("cx", -100).attr("cy", dimensions.height/2).attr("r", 25).style("fill", "cornflowerblue");

  // 4. Create scales
  // 6. Draw peripherals
  
  /*const newDots = dots.enter()
      .append("box")
      .attr("r", 0)
      .attr("cx", d => xScale(1))
      .attr("cy", d => yScale(1))
      .attr("fill", "purple")*/


}

drawChart()

setTimeout(()=>
  {
    console.log("timer");
    toggleMove();

    setTimeout(()=>{
      toggleMoveBack();
    }, 1500);
  }, 1000);
