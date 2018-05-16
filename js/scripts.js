const DATA_URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
    request = new XMLHttpRequest();

request.open("GET", DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.response);
    console.log(response);
    render(response);
};

const render = response => {
    const margin = {top: 50, right: 100, bottom: 50, left: 50},
        width = window.innerWidth,
        height = window.innerHeight,
        {nodes, links } = response;

    console.log(nodes, links);
    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-10).distanceMin(85).distanceMax(width/2))
        .force("link", d3.forceLink(links))
        .force("center", d3.forceCenter(width/2, height/2));

    const link = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link');

    const node = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('image')
        .attr('xlink:href', 'images/blank.gif')
        .attr('width', 16)
        .attr('height', 11)
        .attr('x', d => d.x+'px')
        .attr('y', d => d.y+'px')
        .attr('class', d => 'flag flag-'+d.code);

    simulation.on('tick', function() {
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('x', d => d.x)
            .attr('y', d => d.y);

    });
};