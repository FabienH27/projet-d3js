function h(a, d3) {
    var c = [];
    c.push("0,0");
    c.push(r.w + ",0");
    c.push(r.w + r.t + "," + r.h / 2);
    c.push(r.w + "," + r.h);
    c.push("0," + r.h);
    d3 > 0 && c.push(r.t + "," + r.h / 2);
    return c.join(" ");
  }
  function i(a) {
    a[a.length - 1]._color, a.length;
    var c = d3
        .select("#datas-chart-breadcrumb .trail")
        .selectAll("g")
        .remove();
    c = d3
        .select("#datas-chart-breadcrumb .trail")
        .selectAll("g")
        .data(a, function (a) { return a.key + a.depth });
    var d = c.enter().append("svg:g");
    d
        .append("svg:polygon")
        .attr("points", h)
        .style("fill", function (a) { return a._color }), 
    d
        .append("svg:text")
        .attr("x", r.w / 2 + 2)
        .attr("y", r.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("class", "breadcumb-text")
        .style("fill", function (a) { return getcolor(d3.rgb(a._color)) < 150 ? "#fff" : "#000" })
        .text(function (a) { return a.key }),
    c
        .attr("transform", function (a, b) { return "translate(" + b * (r.w + r.s) + ", 0)" }), 
    c.exit().remove(), 
    d3.select(".trail").style("visibility", "")
  }
  
  /*const width = window.innerWidth,
    height = window.innerHeight,*/
  const width = 580,
  height = 580,
  maxRadius = Math.min(width, height) / 2 - 5;
  
  const formatNumber = d3.format(",d");
  
  const x = d3
    .scaleLinear()
    .range([0, 2 * Math.PI])
    .clamp(true);
  
  const y = d3.scaleSqrt().range([maxRadius * 0.1, maxRadius]);
  
  const color = d3.scaleOrdinal();
  
  var coloralternative = 0;
  function k(a) {
    var c = ["#1E40AF", "#2563EB", "#60A5FA","#3185FC"],
        d = [-.1, -.05, .005,0];
    if(a.depth == 0){
        var e = c[coloralternative % 4];
        return coloralternative++, e
    }
    if (1 == a.depth) {
        var e = c[coloralternative % 4];
        return coloralternative++, e
    }
    if (a.depth >= 1) {
        var f = d[a.value % 1];
        return d3.rgb(a.parent._color).brighter(.2 * a.depth + f * a.depth)
    }
  }
  
  r = {
    w: 116,
    h: 30,
    s: 3,
    t: 7
  };
  
  const partition = d3.partition();
  
  const arc = d3
    .arc()
    .startAngle((d) => x(d.x0))
    .endAngle((d) => x(d.x1))
    .innerRadius((d) => Math.max(0, y(d.y0)))
    .outerRadius((d) => Math.max(0, y(d.y1)));
  
  const middleArcLine = (d) => {
    const halfPi = Math.PI / 2;
    const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
  
    const middleAngle = (angles[1] + angles[0]) / 2;
    const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
    if (invertDirection) {
      angles.reverse();
    }
  
    const path = d3.path();
    path.arc(0, 0, r, angles[0], angles[1], invertDirection);
    return path.toString();
  };
  
  const textFits = (d) => {
    const CHAR_SPACE = 6;
  
    const deltaAngle = x(d.x1) - x(d.x0);
    const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
    const perimeter = r * deltaAngle;
  
    return d.data.name.length * CHAR_SPACE < perimeter;
  };
  
  const svg = d3
    .select(".data-sunburst")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
    .on("click", () => focusOn()); // Reset zoom on canvas click
  
  d3.json(
    "data/skills.json",
    (error, root) => {
      if (error) throw error;
  
      root = d3.hierarchy(root);
      root.count((d) => d.size);
  
      const slice = svg.selectAll("g.slice").data(partition(root).descendants());
  
      slice.exit().remove();
  
      const newSlice = slice
        .enter()
        .append("g")
        .attr("class", "slice")
        .on("click", (d) => {
          d3.event.stopPropagation();
          focusOn(d);
        });
  
      newSlice
        .append("title")
        .text((d) => d.data.name + "\n" + formatNumber(d.value));
      q = k;
      newSlice
        .append("path")
        .attr("class", "main-arc")
        .attr("fill", function (a) { return a._color = q(a), a._color })
        .attr("d", arc);
  
      newSlice
        .append("path")
        .attr("class", "hidden-arc")
        .attr("id", (_, i) => `hiddenArc${i}`)
        .attr("d", middleArcLine);
  
      const text = newSlice
        .append("text")
        .attr("fill", "white")
        .attr("display", (d) => (textFits(d) ? null : "none"));
  
      // Add white contour
      text
        .append("textPath")
        .attr("startOffset", "50%")
        .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
        .text((d) => d.data.name)
        .style("fill", "none")
        .style("stroke", "#fff")
        .style("stroke-width", 0)
        .style("stroke-linejoin", "round");
  
      text
        .append("textPath")
        .attr("startOffset", "50%")
        .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
        .text((d) => d.data.name);
    }
  );
  
  function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
    // Reset to top-level if no data point specified
  
    const transition = svg
      .transition()
      .duration(750)
      .tween("scale", () => {
        const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]);
        return (t) => {
          x.domain(xd(t));
          y.domain(yd(t));
        };
      });
  
    transition
      .selectAll("path.main-arc")
      .attrTween("d", (d) => () => arc(d));
  
    transition
      .selectAll("path.hidden-arc")
      .attrTween("d", (d) => () => middleArcLine(d));
  
    transition
      .selectAll("text")
      .attrTween("display", (d) => () => (textFits(d) ? null : "none"));
  
    moveStackToFront(d);
  
    function moveStackToFront(elD) {
      svg
        .selectAll(".slice")
        .filter((d) => d === elD)
        .each(function (d) {
          this.parentNode.appendChild(this);
          if (d.parent) {
            moveStackToFront(d.parent);
          }
        });
    }
  }
  