//Constants for the SVG
var width = 800,
  height = 800;

//Set up the colour scale
var color = d3.scaleOrdinal(d3.schemeCategory10);

//Set up the force layout
var simulation = d3
  .forceSimulation()
  .force(
    "link",
    d3.forceLink().id(function (d) {
      return d.id;
    })
  )
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width / 2, height / 2));

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svgElement = d3
  .select("#network_highlight")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("data/miserables.json").then(function (graph) {
  var link = svgElement
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", function (d) {
      return Math.sqrt(d.value);
    });

  var node = svgElement
    .append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("g");

  var circles = node
    .append("circle")
    .attr("r", 10)
    .attr("fill", function (d) {
      return color(d.group);
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    )
    .on("click", connectedNodes)
    .on("dblclick", releasenode);

  var lables = node
    .append("text")
    .text(function (d) {
      return d.id;
    })
    .style("font-size", "11px")
    .attr("x", 10)
    .attr("y", 3);

  node.append("title").text(function (d) {
    return d.id;
  });

  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  function ticked() {
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

    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  }

  //Toggle stores whether the highlighting is on
  var toggle = 0;

  //Create an array logging what is connected to what
  var linkedByIndex = {};
  for (i = 0; i < graph.nodes.length; i++) {
    linkedByIndex[i + "," + i] = 1;
  }
  graph.links.forEach(function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
  });

  //This function looks up whether a pair are neighbours
  function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
  }
  
  function dragstarted() {
    simulation.stop();
  }
  
  function dragged(event, d) {
    d.px += event.dx;
    d.py += event.dy;
    d.x += event.dx;
    d.y += event.dy;
  }
  
  function dragended(event) {
    event.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
    simulation.restart();
  }

  function releasenode(event) {
    event.fixed = false; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
  }

  function connectedNodes() {
    if (toggle == 0) {
      //Reduce the opacity of all but the neighbouring nodes
      d = d3.select(this).node().__data__;
      node.style("opacity", function (o) {
        return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
      });

      link.style("opacity", function (o) {
        return (d.index == o.source.index) | (d.index == o.target.index)
          ? 1
          : 0.1;
      });
      toggle = 1;
    } else {
      //Put them back to opacity=1
      node.style("opacity", 1);
      link.style("opacity", 1);
      toggle = 0;
    }
  }
});