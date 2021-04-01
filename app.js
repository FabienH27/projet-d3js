const countries = [
    {id: 'd1', value: 10, region: 'USA'},
    {id: 'd2', value: 12, region: 'India'},
    {id: 'd3', value: 11, region: 'France'},
    {id: 'd4', value: 6, region: 'Germany'}
  ];
  
  const chartMargin = {
    top: 20,
    bottom: 10
  };
  
  const chartSize = {
    width: 600,
    height: 400 - chartMargin.top - chartMargin.bottom
  };
  
  let selectedCountries = countries;
  let unselectedCountryIds = [];
  
  const x = d3
    .scaleBand()
    .rangeRound([0, chartSize.width])
    .padding(0.1);
  
  const y = d3
    .scaleLinear()
    .range([chartSize.height, 0]);
  
  const chartContainer = d3
    .select('svg')
    .attr('width', chartSize.width)
    .attr('height', chartSize.height + chartMargin.top + chartMargin.bottom);
  
    x.domain(countries.map(country => country.region));
    y.domain([0, d3.max(countries, country => country.value) + 3]);
  
  const chart = chartContainer.append('g');
  
  chart
    .append('g')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .attr('transform', `translate(0, ${chartSize.height})`)
    .attr('color', 'maroon');
  
  const countryItems = d3
    .select('#data')  
    .select('ul')
    .selectAll('li')
    .data(countries)
    .enter()
    .append('li');
  
  countryItems
    .append('span')
    .text(country => country.region);
  
  countryItems
    .append('input')
    .attr('type', 'checkbox')
    .attr('checked', true)
    .attr('id', country => country.id)
    .on('change', (event) => {
      if (unselectedCountryIds.indexOf(event.target.id) == -1) {
        unselectedCountryIds.push(event.target.id);
      } else {
        unselectedCountryIds = unselectedCountryIds.filter(id => id != event.target.id);
      }
  
      selectedCountries = countries.filter(
        country => unselectedCountryIds.indexOf(country.id) == -1
      );
  
      renderChart();
    });
  
    function renderChart() {
      chart
        .selectAll('.bar')
        .data(selectedCountries, country => country.id)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', x.bandwidth())
        .attr('height', country => chartSize.height - y(country.value))
        .attr('x', country => x(country.region))
        .attr('y', country => y(country.value));
    
      chart
        .selectAll('.bar')
        .data(selectedCountries, country => country.id)
        .exit()
        .remove();
    
      chart
        .selectAll('.label')
        .data(selectedCountries, country => country.id)
        .enter()
        .append('text')
        .text(country => country.value)
        .attr('x', country => x(country.region) + x.bandwidth() / 2)
        .attr('y', country => y(country.value) - 20)
        .attr('text-anchor', 'middle')
        .classed('label', true);
      
      chart
        .selectAll('.label')
        .data(selectedCountries, country => country.id)
        .exit()
        .remove();
    }
    
renderChart();