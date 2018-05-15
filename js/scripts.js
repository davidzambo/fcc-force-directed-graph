const DATA_URL = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",
    request = new XMLHttpRequest();

request.open("GET", DATA_URL, true);
request.send();
request.onload = () => {
    const response = JSON.parse(request.response);
    render(response);
};

const render = response => {
    console.log(response);
    const margin = {top: 50, right: 100, bottom: 50, left: 50},
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom,
        {nodes, links }= response;

    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const simulation = d3.forceSimulation()
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .on("tick", tick)
        .linkDistance(300)
        .start();

    const link = svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link');

    const node = svg.selectAll('.node')
        .data(force.nodes())
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', width * 0.04);

    const tick = () => {
        node.attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .call(force.drag);

        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('x2', d => d.target.y)
    }
};