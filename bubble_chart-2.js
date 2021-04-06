var yScaleTitle = "Length";
var xScaleTitle = "Weight";

var fontFamilyAxis = "Poppins";
var fontFamilyTitle = "Open Sans";
var fontWeightTitle = 700;
var fontWeightAxis = 700;


// set the dimensions and margins of the graph
var margin = {top: 40, right: 30, bottom: 300, left: 30},
    width = window.innerWidth / 2 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .classed("svg-style", true) 
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.json("data/cars.json").then(function(data) {
  // ---------------------------//
  //       AXIS  AND SCALE      //
  // ---------------------------//

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 5000])
    .range([ 0, width ]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(4))
    .attr("font-weight", fontWeightAxis)
    .attr("font-family", fontFamilyAxis);;

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+50 )
      .attr("font-weight", fontWeightTitle)
      .attr("font-family", fontFamilyTitle)
      .text(xScaleTitle);

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([140, 240])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .attr("font-weight", fontWeightAxis)
    .attr("font-family", fontFamilyAxis);

  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text(yScaleTitle)
      .attr("text-anchor", "start")
      .attr("font-weight", fontWeightTitle)
      .attr("font-family", fontFamilyTitle);

  // Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([3000, 16000])
    .range([ 2, 30]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(["AMC", "Buick", "Cadillac", "Chevrolet", "Dodge","Ford","Lincoln","Mercury","Olds","Plymouth","Pontiac","Audi","BMW","Datsun","Fiat","Honda"
    ,"Mazda","Honda","Renault","Peugeot","Subaru","Toyota","Volkswagen","Volvo"])
    .range(d3.schemeTableau10);
    

  // ---------------------------//
  //      TOOLTIP               //
  // ---------------------------//

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#my_dataviz")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(event,d) {
    var tooltipContent = "Maker: " + d.maker + "<br>Price: " + d.price + " €";
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html(tooltipContent)
      .style("left", (d3.pointer(event)[0]+30) + "px")
      .style("top", (d3.pointer(event)[1]+30) + "px")
  }
  var moveTooltip = function(event, d) {
    tooltip
      .style("left", (d3.pointer(event)[0]+30) + "px")
      .style("top", (d3.pointer(event)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  var highlight = function(event,d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 0.8)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 0.8)
  }

  // ---------------------------//
  //       CIRCLES              //
  // ---------------------------//
       //BRUSHING
       var clip = svg.append("defs").append("svg:clipPath")
       .attr("id", "clip")
       .append("svg:rect")
       .attr("width", width + 40 )
       .attr("height", height )
       .attr("x", 0)
       .attr("y", 0);

     // Add brushing
     var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
         .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
         .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
   
     var bubble = svg.append('g')
       .attr("clip-path", "url(#clip)")


      // Add the brushing
     bubble
     .append("g")
       .attr("class", "brush")
       .call(brush);
   
     // Add circles
     bubble
       .selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
         .attr("class", function(d) { return "bubbles " + d.maker })
         .attr("cx", function (d) { return x(d.weight); } )
         .attr("cy", function (d) { return y(d.length); } )
         .attr("r", function (d) { return z(d.price); } )
         .style("fill", function (d) { return myColor(d.maker); } )
         .attr("pointer-events", "all")
         .style("opacity", 0.8)
         .on("mouseover", showTooltip)
         .on("mousemove", moveTooltip)
         .on("mouseleave", hideTooltip)
   
     // A function that set idleTimeOut to null
     var idleTimeout
     function idled() { idleTimeout = null; }
   
     // A function that update the chart for given boundaries
     function updateChart(event) {
       extent = event.selection;
   
       // If no selection, back to initial coordinate. Otherwise, update X axis domain
       if(!extent){
         if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
         x.domain([0, 5000])
         x.range([ 0, width ])
       }else{
         x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
         bubble.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
       }
   
       // Update axis and circle position
       xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(4))
       bubble
         .selectAll("circle")
         .transition().duration(1000)
         .attr("cx", function (d) { return x(d.weight); } )
         .attr("cy", function (d) { return y(d.length); } )
   
       }

    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add legend: circles
    var valuesToShow = [5000, 10000, 15000]
    var xCircle = 650;
    var xLabel = 700;
    var yCircle = 550;
    var yLabel = 570;
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d){ return yCircle - z(d) } )
        .attr("r", function(d){ return z(d) })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
        .attr('x1', function(d){ return xCircle + z(d) } )
        .attr('x2', xLabel)
        .attr('y1', function(d){ return yCircle - z(d) } )
        .attr('y2', function(d){ return yCircle - z(d) } )
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr('x', xLabel)
        .attr('y', function(d){ return yCircle - z(d) } )
        .text( function(d){ return d } )
        .attr("font-weight", fontWeightAxis)
        .attr("font-family", fontFamilyAxis)
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svg.append("text")
      .attr('x', xCircle)
      .attr("y", yLabel)
      .text("Prix")
      .attr("font-weight", fontWeightAxis)
      .attr("font-family", fontFamilyAxis)
      .attr("text-anchor", "middle")

    // Add one dot in the legend for each name.
    var size = 20
    var allgroups = ["AMC", "Buick", "Cadillac", "Chevrolet", "Dodge","Ford","Lincoln","Mercury","Olds","Plymouth","Pontiac","Audi","BMW","Datsun","Fiat","Honda"
      ,"Mazda","Renault","Peugeot","Subaru","Toyota","Volkswagen","Volvo"]

    const group = svg.append("g").classed("group",true)
  
    var previous = 0;
    var yPosCircle = 400;
    var yPosText = 400;
    var xPos = 0;

    group.selectAll("myrect")
      .data(allgroups)
      .enter()
      .append("circle")
        .attr("cx", function(d,i){
          if(i % 2 == 0){
            return 200;
          }else{
            return xPos;
          } })
        .attr("cy", function(d,i){
            if(i % 2 == 0){
              yPosCircle = yPosCircle + 20;
              return yPosCircle;
            }else{
              return yPosCircle;
            }
          })
        .attr("r", 7)
        .style("fill", function(d){ return myColor(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
  
    group.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", function(d,i){
          if(i % 2 == 0){
            return 220;
          }else{
            return xPos + 20;
          } })
        .attr("y", function(d,i){
          if(i % 2 == 0){
            yPosText = yPosText + 20;
            return yPosText;
          }else{
            return yPosText;
          }
        })
        .style("fill", function(d){ return myColor(d)})
        .text(function(d){ return d})
        .attr("font-weight", fontWeightAxis)
        .attr("font-family", fontFamilyAxis)
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
        
  })

