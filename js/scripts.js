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

    d3.select('.container')
        .append('svg')
        .style("display", "none")
        .append('svg:image')
        .attr('id', 'flag-icons')
        .attr('width', 256)
        .attr('height', 176)
        .attr('xlink:href', './images/flags.png');

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
        .append('g')
        .attr('clip-path', 'url(#flag-icons');

    node.append('use')
        .attr('xlink:href', "#flag-icons")
        .attr('class', d => 'flag flag-'+d.code);

    node.selectAll('use')
        .attr('transform', function(){
            const pos = d3.select(this)
                .style("background-position")
                .replace(/[px]/g, "")
                .replace(" ", ",");
            return `translate (${pos})`;
        });

    node.attr('transform', d => `translate(${d.x - 5}, ${d.y - 2})`)
        .on('mouseover', d => console.log(d.country));

    simulation.on('tick', function() {
        link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('x', d => d.x)
            .attr('y', d => d.y);

    });
};