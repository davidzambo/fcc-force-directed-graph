const DATA_URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
    request = new XMLHttpRequest();

request.open("GET", DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.response);
    render(response);
};

const render = response => {
    const margin = {top: 50, right: 100, bottom: 50, left: 50},
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom,
        {nodes, links } = response;

    console.log(nodes, links);
    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const force = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody())
        .force("link", d3.forceLink(links))
        .force("center", d3.forceCenter());
    force.nodes(nodes)
        .force("link").links(links);

    const link = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link');

    const node = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 1);

    force.on('tick', function() {
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('x2', d => d.target.y);

        node.attr('cx', d => d.x)
            .attr('cy', d => d.y);

    });
};