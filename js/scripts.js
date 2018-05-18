const DATA_URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
    request = new XMLHttpRequest();

request.open("GET", DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.response);
    render(response);
    window.addEventListener('resize', () => render(response));
};

const render = response => {
    const margin = {top: 50, right: 100, bottom: 50, left: 100},
        width = window.innerWidth,
        height = window.innerHeight -140,
        {nodes, links } = response;

    d3.select('.container').html('');
    d3.select('.container')
        .append('div')
        .attr('id', 'tooltip')
        .attr('class', 'hidden')
        .append('h3')
        .attr('id', 'countryName');

    d3.select('.container').append('h1').text('National Contiguity with a Force Directed Graph');

    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const flags = d3.select('.container')
        .append('div')
        .attr('class', 'flag-container');

    const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-10))
        .alpha(0.5)
        .force("link", d3.forceLink(links))
        .force("center", d3.forceCenter(width/2, height/2));

    const link = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link');

    const node = flags.selectAll('.node')
        .data(nodes)
        .enter()
        .append('div')
        .attr('class', d => 'node flag flag-'+d.code)
        .on('mouseover', d => {
            d3.select('#tooltip')
                .style('left', d.x - 30 + "px")
                .style('top', d.y + 20 + "px")
                .classed('hidden', false);
            d3.select('#countryName').text(d.country);
        })
        .on('mouseout', d => {
            console.log('out');
            d3.select('#tooltip').attr('class', 'hidden');
        })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    simulation.on('tick', function() {
        node.style('transform', d => `translate(${d.x - 5}px, ${d.y + 73}px)`);

        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('x', d => d.x)
            .attr('y', d => d.y);

    });

    function dragstarted(d){
        if (!d3.event.active)
            simulation.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d){
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d){
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    d3.select('.container')
        .append('footer')
        .html('<a href="https://www.dcmf.hu" target="_blank"><span>codedBy</span><img src="https://www.dcmf.hu/images/dcmf-letters.png" alt="dcmf-logo" /></a>');

};