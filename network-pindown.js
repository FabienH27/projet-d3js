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

//---Insert-------
/*var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

    function dragstart(d, i) {
        force.stop() // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy; 
    }

    function dragend(d, i) {
        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        force.resume();
    }

    function releasenode(d) {
        d.fixed = false; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        //force.resume();
    }*/
//---End Insert------

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("data/miserables.json").then(function (graph) {
  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", function (d) {
      return Math.sqrt(d.value);
    });

  var node = svg
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
  function dragstarted() {
    simulation.stop();
  }

  function dragged(event,d) {
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
});
