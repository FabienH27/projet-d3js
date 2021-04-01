const xScale = d3.scaleBand()
   .domain(data.map((dataPoint) => dataPoint.region))
   .rangeRound([0,250])
   .padding(0.1);
const yScale = d3
.scaleLinear()
.domain([0,15])
.range([200,0]);

const container = d3.select('svg')
   .classed('container',true);

const bars = container
   .selectAll('.bar')
   .data(data)
   .enter()
   .append('rect')
   .classed('bar',true)
   .attr('width',xScale.bandwidth())
   .attr("height", function(d) { return 200 - yScale(0); })
   .attr('x', data => xScale(data.region))
   .attr("y", function(d) { return yScale(0); });
   update();


container.append("g")
   .attr("transform", "translate(0," + 200 + ")")
   .call(d3.axisBottom(xScale))
   .selectAll("text")
   .attr("transform", "translate(-10,0)rotate(-45)")
   .style("text-anchor", "end");

container.append("g")
   .call(d3.axisLeft(yScale));

function update(){
   bars.transition()
      .duration(800)
      .attr("y", function(d) { return yScale(d.value); })
      .attr("height", function(d) { return 200 - yScale(d.value); })
}