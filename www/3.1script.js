document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let edges = [];
    let adjacencyMatrix = [];

    // Función para redimensionar el canvas
    function resizeCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        if (nodes.length > 0 && edges.length > 0) {
            drawGraph(nodes, edges, ctx);
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    document.getElementById('generateGraphBtn').addEventListener('click', () => {
        const numNodes = parseInt(document.getElementById('numNodes').value);
        const minWeight = parseInt(document.getElementById('minWeight').value);
        const maxWeight = parseInt(document.getElementById('maxWeight').value);

        if (isNaN(numNodes) || numNodes < 1 || isNaN(minWeight) || isNaN(maxWeight) || minWeight > maxWeight) {
            alert('Por favor, ingrese valores válidos.');
            return;
        }

        nodes = generateNodes(numNodes);
        edges = generateEdges(nodes, minWeight, maxWeight);
        adjacencyMatrix = generateAdjacencyMatrix(nodes, edges);
        drawGraph(nodes, edges, ctx);
        displayAdjacencyMatrix(adjacencyMatrix); // Llamamos a esta función para que se muestre la tabla de costos
    });

    function generateNodes(numNodes) {
        const nodes = [];
        const minDistance = 70; // Distancia mínima entre nodos
        const rows = Math.ceil(Math.sqrt(numNodes));  // Número de filas para la cuadrícula
        const cols = Math.ceil(numNodes / rows); // Número de columnas para la cuadrícula
        const spacingX = canvas.width / cols;  // Espaciado horizontal
        const spacingY = canvas.height / rows; // Espaciado vertical

        for (let i = 0; i < numNodes; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;

            const x = col * spacingX + spacingX / 2; // Centrar el nodo en su celda
            const y = row * spacingY + spacingY / 2; // Centrar el nodo en su celda
            nodes.push({ id: i + 1, x, y });
        }

        return nodes;
    }

    function generateEdges(nodes, minWeight, maxWeight) {
        const edges = [];

        // Conectar todos los nodos para asegurar que no queden aislados
        for (let i = 0; i < nodes.length - 1; i++) {
            const targetNode = nodes[i + 1];
            const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
            edges.push({ from: nodes[i].id, to: targetNode.id, weight });
        }

        const numEdges = Math.floor(nodes.length * (nodes.length - 1) / 4); // Puedes ajustar el número de aristas

        while (edges.length < numEdges) {
            const node1 = nodes[Math.floor(Math.random() * nodes.length)];
            const node2 = nodes[Math.floor(Math.random() * nodes.length)];

            // Asegurarse de que no sean el mismo nodo y que no haya una arista duplicada
            if (node1.id !== node2.id && !edges.some(edge => (edge.from === node1.id && edge.to === node2.id) || (edge.from === node2.id && edge.to === node1.id))) {
                const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
                edges.push({ from: node1.id, to: node2.id, weight });
                edges.push({ from: node2.id, to: node1.id, weight }); // Conexión bidireccional
            }
        }
        return edges;
    }

    function generateAdjacencyMatrix(nodes, edges) {
        const matrix = Array.from({ length: nodes.length }, () => Array(nodes.length).fill('∞'));
        nodes.forEach((node, index) => {
            matrix[index][index] = 0;
        });
        edges.forEach(edge => {
            const fromIndex = edge.from - 1;
            const toIndex = edge.to - 1;
            matrix[fromIndex][toIndex] = edge.weight;
            matrix[toIndex][fromIndex] = edge.weight;
        });
        return matrix;
    }

    function displayAdjacencyMatrix(matrix, pathEdges = []) {
        const tableHead = document.getElementById('adjacencyMatrixTable').querySelector('thead');
        const tableBody = document.getElementById('adjacencyMatrixTable').querySelector('tbody');
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        // Encabezados de columnas
        let headerRow = '<tr><th></th>';
        for (let i = 1; i <= matrix.length; i++) {
            headerRow += `<th>v${i}</th>`;
        }
        headerRow += '</tr>';
        tableHead.innerHTML = headerRow;

        // Filas de la tabla
        matrix.forEach((row, rowIndex) => {
            let rowHTML = `<tr><th>v${rowIndex + 1}</th>`;

            row.forEach((cell, colIndex) => {
                const cellContent = cell === 0 ? '0' : cell;
                // Revisar si la celda corresponde a una arista tomada por Dijkstra
                const edge = `${String.fromCharCode(65 + rowIndex)}-${String.fromCharCode(65 + colIndex)}`;
                const reverseEdge = `${String.fromCharCode(65 + colIndex)}-${String.fromCharCode(65 + rowIndex)}`;
                const className = pathEdges.includes(edge) || pathEdges.includes(reverseEdge) ? 'highlight' : '';
                rowHTML += `<td class="${className}">${cellContent}</td>`;
            });
            rowHTML += '</tr>';
            tableBody.innerHTML += rowHTML;
        });
    }

    function drawGraph(nodes, edges, ctx, path = []) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Ajustar el tamaño del nodo y del texto basado en el número de nodos
        const nodeSize = Math.max(40 - Math.floor(nodes.length / 3), 10); // Tamaño mínimo de 10
        const fontSize = Math.max(20 - Math.floor(nodes.length / 5), 10); // Tamaño mínimo de texto de 10
        ctx.font = `bold ${fontSize}px Arial`;

        edges.forEach(edge => {
            const fromNode = nodes.find(node => node.id === edge.from);
            const toNode = nodes.find(node => node.id === edge.to);
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.strokeStyle = path.includes(edge.from) && path.includes(edge.to) ? 'red' : 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.fillText(edge.weight, (fromNode.x + toNode.x) / 2, (fromNode.y + toNode.y) / 2);
        });

        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Dibujar el identificador del nodo con mayor tamaño de texto
            ctx.fillStyle = 'black';
            ctx.fillText(node.id, node.x - fontSize / 2, node.y + fontSize / 2);
        });
    }

    function dijkstra(adjacencyMatrix, startNode, endNode) {
        const numNodes = adjacencyMatrix.length;
        const distances = Array(numNodes).fill(Infinity);
        const visited = Array(numNodes).fill(false);
        const previousNodes = Array(numNodes).fill(null);
        distances[startNode - 1] = 0;

        for (let i = 0; i < numNodes; i++) {
            const currentNode = getClosestNode(distances, visited);
            if (currentNode === null) break;
            visited[currentNode] = true;

            for (let neighbor = 0; neighbor < numNodes; neighbor++) {
                if (!visited[neighbor] && adjacencyMatrix[currentNode][neighbor] !== 'Inf') {
                    const newDist = distances[currentNode] + adjacencyMatrix[currentNode][neighbor];
                    if (newDist < distances[neighbor]) {
                        distances[neighbor] = newDist;
                        previousNodes[neighbor] = currentNode;
                    }
                }
            }
        }

        const path = constructPath(previousNodes, startNode - 1, endNode - 1);
        const pathEdges = getPathEdges(path);  // Obtener las aristas del camino más corto
        return { path, distances, pathEdges };
    }

    // Función para construir las aristas del camino más corto
    function getPathEdges(path) {
        const edges = [];
        for (let i = 0; i < path.length - 1; i++) {
            const edge = `${String.fromCharCode(65 + path[i] - 1)}-${String.fromCharCode(65 + path[i + 1] - 1)}`;
            edges.push(edge);
        }
        return edges;
    }

    function getClosestNode(distances, visited) {
        let closestNode = null;
        let shortestDistance = Infinity;
        for (let i = 0; i < distances.length; i++) {
            if (!visited[i] && distances[i] < shortestDistance) {
                shortestDistance = distances[i];
                closestNode = i;
            }
        }
        return closestNode;
    }

    function constructPath(previousNodes, startNode, endNode) {
        const path = [];
        let currentNode = endNode;
        while (currentNode !== null) {
            path.unshift(currentNode + 1);
            currentNode = previousNodes[currentNode];
        }
        return path;
    }

    document.getElementById('startBtn').addEventListener('click', () => {
        const startNode = parseInt(document.getElementById('startNode').value);
        const endNode = parseInt(document.getElementById('endNode').value);

        if (isNaN(startNode) || isNaN(endNode)) {
            alert('Por favor, ingrese nodos válidos.');
            return;
        }

        if (startNode < 1 || endNode < 1 || startNode > nodes.length || endNode > nodes.length) {
            alert('Los nodos deben estar dentro del rango de nodos existentes.');
            return;
        }

        const { path, distances, pathEdges } = dijkstra(adjacencyMatrix, startNode, endNode);
        const totalWeight = distances[endNode - 1];
        document.getElementById('resultText').innerText = `El camino más corto de ${startNode} a ${endNode} es: ${path.join(' -> ')} con un peso total de ${totalWeight}`;
        drawGraph(nodes, edges, ctx, path);
        document.getElementById('tituloRes').innerText = 'Resultados';
        displayAdjacencyMatrix(adjacencyMatrix, pathEdges);
    });

    document.getElementById('cleanBtn').addEventListener('click', () => {
        // Limpiar los campos de entrada
        document.getElementById('numNodes').value = '';
        document.getElementById('minWeight').value = '';
        document.getElementById('maxWeight').value = '';
        document.getElementById('startNode').value = '';
        document.getElementById('endNode').value = '';

        // Limpiar el grafo y la adyacencia
        nodes = [];
        edges = [];
        adjacencyMatrix = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('adjacencyMatrixTable').querySelector('thead').innerHTML = '';
        document.getElementById('adjacencyMatrixTable').querySelector('tbody').innerHTML = '';
        document.getElementById('resultText').innerText = '';
        document.getElementById('tituloRes').innerText = '';
    });
});

function navigateTo(page) {
    window.location.href = page;
}