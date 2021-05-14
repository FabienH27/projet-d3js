//Constants for the SVG
var width = 800,
  height = 800;

//Set up the colour scale
var color = d3.scale.category20();

//Set up the force layout
var force = d3.layout
  .force()
  .charge(-120)
  .linkDistance(30)
  .size([width, height]);

//---Insert-------
var node_drag = d3.behavior
  .drag()
  .on("dragstart", dragstart)
  .on("drag", dragmove)
  .on("dragend", dragend);

function dragstart(d, i) {
  force.stop(); // stops the force auto positioning before you start dragging
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
}

//---End Insert------

//Append a SVG to the body of the html page. Assign this SVG as an object to svg
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//Read the data from the mis element
var mis = document.getElementById("mis").innerHTML;
graph = JSON.parse(mis);

//Creates the graph data structure out of the json data
force.nodes(graph.nodes).links(graph.links).start();

//Create all the line svgs but without locations yet
var link = svg
  .selectAll(".link")
  .data(graph.links)
  .enter()
  .append("line")
  .attr("class", "link")
  .style("stroke-width", function (d) {
    return Math.sqrt(d.value);
  });

//Do the same with the circles for the nodes - no
var node = svg
  .selectAll(".node")
  .data(graph.nodes)
  .enter()
  .append("g")
  .attr("class", "node")
node
  .append("circle")
  .attr("r", 8)
  .style("fill", function (d) {
    return color(d.group);
  })
  .on("dblclick", releasenode)
  .on("click", connectedNodes)
  .call(node_drag); //Added

node
  .append("text")
  .attr("dx", 10)
  .attr("dy", ".35em")
  .text(function (d) {
    return d.name;
  });
 

//Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
force.on("tick", function () {
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

    d3.selectAll("circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });
  d3.selectAll("text")
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    });
});

//Toggle stores whether the highlighting is on
var toggle = 0;

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

    //Reduce the op

    toggle = 1;
  } else {
    //Put them back to opacity=1
    node.style("opacity", 1);
    link.style("opacity", 1);
    toggle = 0;
  }
}