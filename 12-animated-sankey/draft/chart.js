async function drawChart() {

  // 1. Access data

  const dataset = await d3.json("education.json")

  const sexAccessor = d => d.sex

  // list of types of sex to use when sampling
  const sexes = ["female", "male"]
  const sexIds = d3.range(sexes.length) // range of sexes 

  // same for education
  // can use unique(dataset) but this way we manage order
  const educationAccessor = d => d.education 
  const educationNames = [
    "<High School",
    "High School",
    "Some Post-secondary",
    "Post-secondary",
    "Associate’s",
    "Bachelor’s and up"
  ]
  const educationIds = d3.range(educationNames.length)

  // for social economic status
  const sesAccessor = d => d.ses
  const sesNames = ["low", "middle", "high"] 
  const sesIds = d3.range(sesNames.length)

  // need to access both sex and ses
  const getStatusKey = ({sex, ses}) => [sex, ses].join("--")

  // education buckets (in order), adding the current probability to 
  // the stacked probability, then returning the current sum.
  const stackedProbabilities = {} 
  dataset.forEach(startingPoint => {
    const key = getStatusKey(startingPoint)
    let stackedProbability = 0
    stackedProbabilities[key] = educationNames.map((education, i) => {
    stackedProbability += (startingPoint[education] / 100) 
    if (i == educationNames.length - 1) {
      // account for rounding error
      return 1 
    }  
    else {
      return stackedProbability }
    }) 
  })

  function generatePerson() {
    const sex = getRandomValue(sexIds) 
    const ses = getRandomValue(sesIds)
    
    // grab the matching stacked probabilities
    const statusKey = getStatusKey({
      sex: sexes[sex],
      ses: sesNames[ses],
    })
    const probabilities = stackedProbabilities[statusKey]
    // find number that will fit the probabilities
    const education = d3.bisect(probabilities, Math.random())

    return { 
      // same as {sex: sex}
      sex, 
      ses,
      education: "?",
    }
  }

  // test
  //console.log(generatePerson())
  //console.log(generatePerson())
  //console.log(generatePerson())

  // 2. Create chart dimensions

  const width = d3.min([
    window.innerWidth * 0.9,
    1200
  ])
  let dimensions = {
    width: width,
    height: 500,
    margin: {
      top: 10,
      right: 200,
      bottom: 10,
      left: 120,
    },
    pathHeight: 50,
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

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
  // converts a person's progress from left-to-right into an x-position
  // represented from 0 (start) to 1 (finish)
  const xScale = d3.scaleLinear()
    .domain([0,1])
    .range([0, dimensions.boundedWidth])
    .clamp(true) // only will return 0 to 1

    // start with ses
    const startYScale = d3.scaleLinear()
      .domain([sesIds.length, -1])
      .range([0, dimensions.boundedHeight])
      // [3, -1] we want highest y position (closer to bottom of page) 
      // to coorespond to lowest ID

    // end with education
    const endYScale = d3.scaleLinear()
      .domain([educationIds.length, -1])
      .range([0, dimensions.boundedHeight])

  // 5. Draw data
  // const linkLineGenerator = d3.line()
  //   .x((d, i) => i * (dimensions.boundedWidth/5)) // 1/5 of our horizontal space to the y-position transition
  //   .y((d, i) => i <= 2
  //     ? startYScale(d[0])
  //     : endYScale(d[1])
  //   ).curve(d3.curveMonotoneX) // smooth the paths

  // // six item array for each permutation of starting and ending ids
  // // merge flattens into one array
  // const linkOptions = d3.merge( 
  //   sesIds.map(
  //     startId => (
  //       educationIds.map(
  //         endId => (
  //           new Array(6).fill([startId, endId])
  //     )) 
  //   ))
  // )

  const linkLineGenerator = d3.line()
    .x((d, i) => i * (dimensions.boundedWidth / 5))
    .y((d, i) => i <= 2
      ? startYScale(d[0])
      : endYScale(d[1])
    )
    .curve(d3.curveMonotoneX)
  const linkOptions = d3.merge(
    sesIds.map(startId => (
      educationIds.map(endId => (
        new Array(6).fill([startId, endId])
      ))
    ))
  )
  const linksGroup = bounds.append("g")
  const links = linksGroup.selectAll(".category-path")
    .data(linkOptions)
    .enter().append("path")
      .attr("class", "category-path")
      .attr("d", linkLineGenerator)
      .attr("stroke-width", dimensions.pathHeight)


  // create a path for each lineOptions and generate their d attr
  // using the line generator
  //const linksGroup = bounds.append("g")
  //const links = linksGroup.selectAll(".category-path")
  //  .data(linkOptions)
  //  .enter().append("path")
  //    .attr("class", "category-path")
   //   .attr("d", linkLineGenerator)
    //  .attr("stroke-width", dimensions.pathHeight)
  
  // 6. Draw peripherals

  // labels, create <g> element to position labels x-positions
  const startingLabelsGroup = bounds.append("g")
    .style("transform", "translateX(-20px") // -20px from our bounds
  
  const startingLabels = startingLabelsGroup.selectAll(".start-label")
    .data(sesIds)
    .enter().append("text")
        .attr("class", "label start-label")
        .attr("y", (d, i) => startYScale(i))
        .text((d, i) => sentenceCase(sesNames[i]))

  // "Socioeconmic Status" stacked
  const startLabel = startingLabelsGroup.append("text") .attr("class", "start-title")
    .attr("y", startYScale(sesIds[sesIds.length - 1]) - 65) .text("Socioeconomic")
  const startLabelLineTwo = startingLabelsGroup.append("text") .attr("class", "start-title")
    .attr("y", startYScale(sesIds[sesIds.length - 1]) - 50) .text("Status")
  
  const endingLabelsGroup = bounds.append("g") 
    .style("transform", `translateX(${
      dimensions.boundedWidth + 20 
      }px)`)
    
  const endingLabels = endingLabelsGroup.selectAll(".end-label") 
    .data(educationNames)
    .enter().append("text")
      .attr("class", "label end-label")
      .attr("y", (d, i) => endYScale(i) - 15)
      .text(d => d)      
  
  const trianglePoints = [ 
    "-7, 6",
    " 0, -6",
    "7, 6",
  ].join(" ")

  const femaleMarkers = endingLabelsGroup.selectAll(".female-marker") 
    .data(educationIds)
      .enter().append("polygon")
      .attr("class", "ending-marker female-marker") 
      .attr("points", trianglePoints)
      .attr("transform", d => `translate(5, ${endYScale(d) + 20})`)

  const maleMarkers = endingLabelsGroup.selectAll(".male-marker")
    .data(educationIds)
      .enter().append("circle")
        .attr("class", "ending-marker male-marker")
        .attr("r", 5.5)
        .attr("cx", 5)
        .attr("cy", d => endYScale(d) + 5)
  
    // 7. Set up interactions
    let people = []

    const markersGroup = bounds.append("g")
      .attr("class", "markers-group")

    const males = markersGroup.selectAll(".marker-circle") 
      .data(people.filter(d => sexAccessor(d) == 0))
        males.enter().append("circle")
          .attr("class", "ending-marker marker-circle")
          .attr("r", 5.5)

    const females = markersGroup.selectAll(".marker-triangle") 
      .data(people.filter(d => sexAccessor(d) == 1))
        females.enter().append("polygon")
          .attr("class", "ending-marker marker-triangle")
          .attr("points", trianglePoints)

    const markers = d3.selectAll(".marker")
      markers.style("transform", d => {
        const x = -10
        const y = startYScale(sesAccessor(d)) 
        return `translate(${ x }px, ${ y }px)`
      })
    
    function updateMarkers(elapsed) { 
        //console.log(elapsed)
    }
          
    d3.timer(updateMarkers)
}
drawChart()


// utility functions

const getRandomNumberInRange = (min, max) => Math.random() * (max - min) + min

const getRandomValue = arr => arr[Math.floor(getRandomNumberInRange(0, arr.length))]

const sentenceCase = str => [
  str.slice(0, 1).toUpperCase(),
  str.slice(1),
].join("")