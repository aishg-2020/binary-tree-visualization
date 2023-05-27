
// Function to draw the binary tree visualization
function drawTree() {
    const input = document.getElementById('tree-input').value;
    const treeArray = input.split(',').map(Number);

    const container = document.getElementById('tree-container');
    container.innerHTML = '';

    const svg = d3.select('#tree-container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .append('g')
        .attr('transform', 'translate(50,50)');

    const treeRoot = buildTree(treeArray);

    const treeLayout = d3.tree().size([500, 500]);
    const treeData = treeLayout(d3.hierarchy(treeRoot));

    const nodes = treeData.descendants();
    const links = treeData.links();

    svg.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke',"#4A4A4A")
        .attr('stroke-width',"2");

    const nodeGroup = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        // .style('fill', '#17A9BF')
        .on('click', highlightNodes);

    nodeGroup.append('circle')
        .attr('r', 20);

    nodeGroup.append('text')
        .text(d => d.data.data)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .style('fill', '#000')
        .style('font-size', '14px');

    // Function to highlight the clicked node and its ancestors
    function highlightNodes(clickedNode) {
        svg.selectAll('.node')
            .classed('highlighted', false);

        d3.select(this)
            .classed('highlighted', true)
            .each(function () {
                const ancestors = d3.select(this).datum().ancestors();
                svg.selectAll('.node')
                    .filter(d => ancestors.includes(d))
                    .classed('highlighted', true);
            });
    }
    // Function to build the binary tree from the input array
    function buildTree(array) {
        const root = { data: array[0], children: [] };
        const queue = [root];

        for (let i = 1; i < array.length; i++) {
            const parent = queue[0];

            if (array[i] !== null) {
                const child = { data: array[i], children: [] };
                parent.children.push(child);
                queue.push(child);
            }

            if (parent.children.length === 2) {
                queue.shift();
            }
        }

        return root;
    }
}
