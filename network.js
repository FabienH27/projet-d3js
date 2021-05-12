var margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#network_viz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3
  .select("#network_viz")
  .append("div")
  .style("position", "absolute")
  .style("visibility", "hidden");

var showTooltip = (event, d) => {
  var tooltipContent = "Item n°" + d;
  tooltip
    .style("visibility", "visible")
    .html(tooltipContent)
    .style("left", d3.event.pageX + 20 + "px")
    .style("top", d3.event.pageY + 20 + "px");
};
var moveTooltip = (event, d) => {
  tooltip
    .style("left", d3.event.pageX + 20 + "px")
    .style("top", d3.event.pageY + 20 + "px");
};
var hideTooltip = (d) => {
  tooltip.style("visibility", "hidden");
};

var color = d3.scaleOrdinal(d3.schemeCategory10);


d3.json("data/network.json", function (data) {
    // Initialize the links
    var link = svg
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .style("stroke", "#aaa");

    // Initialize the nodes
    var node = svg
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 20)
      .on("mouseover", showTooltip)
      .on("mouseover", showHierarchy)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)
      .style("fill", color)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

    // Let's list the force we wanna apply on the network
    var simulation = d3
      .forceSimulation(data.nodes) // Force algorithm is applied to data.nodes
      .force(
        "link",
        d3.forceLink() // This force provides links between nodes
          .id(function (d) {
            return d.id;
          }) // This provide the id of a node
          .links(data.links) // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .on("tick", tick);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function tick() {
      link
        .attr("x1", function (d) {
          return d.source.x;
        })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });
      node
        .attr("cx", function (d) {
          return d.x + 6;
        })
        .attr("cy", function (d) {
          return d.y - 6;
        });
    }

    function showHierarchy(d) {
      for(var i=1; i<data.links.length; i++) {
        if(d == data.links[i].source) 
          breadcrumb.html("<p>" + d.id + " >> " + data.links[i].target.id + "</p>");
        else if(d == data.links[i].target)
          breadcrumb.html("<p>" + d.id + " << " + data.links[i].source.id + "</p>");
      }
    }

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
);
