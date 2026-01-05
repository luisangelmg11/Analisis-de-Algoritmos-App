document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let edges = [];
    let adjacencyMatrix = [];

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
        displayAdjacencyMatrix(adjacencyMatrix);
    });

    function generateNodes(numNodes) {
        const nodes = [];
        const padding = 50; // Margen alrededor del canvas
        const rows = Math.ceil(Math.sqrt(numNodes)); // Número de filas
        const cols = Math.ceil(numNodes / rows); // Número de columnas

        const cellWidth = (canvas.width - 2 * padding) / cols; // Ancho de cada celda
        const cellHeight = (canvas.height - 2 * padding) / rows; // Altura de cada celda

        let nodeIndex = 0;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (nodeIndex >= numNodes) break; // Evita agregar más nodos de los necesarios

                const x = padding + col * cellWidth + cellWidth / 2; // Centro de la celda en X
                const y = padding + row * cellHeight + cellHeight / 2; // Centro de la celda en Y

                nodes.push({ id: nodeIndex + 1, x, y });
                nodeIndex++;
            }
        }
        return nodes;
    }

    function generateEdges(nodes, minWeight, maxWeight) {
        const edges = [];
        const numEdges = Math.floor(nodes.length * (nodes.length - 1) / 2);

        while (edges.length < numEdges) {
            const node1 = nodes[Math.floor(Math.random() * nodes.length)];
            const node2 = nodes[Math.floor(Math.random() * nodes.length)];

            if (node1.id !== node2.id && !edges.some(edge => edge.from === node1.id && edge.to === node2.id)) {
                // Permitir pesos negativos: Los pesos se generan en el rango [minWeight, maxWeight]
                const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
                edges.push({ from: node1.id, to: node2.id, weight });

                if (Math.random() > 0.3) { // Arista bidireccional con probabilidad
                    const reverseWeight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
                    edges.push({ from: node2.id, to: node1.id, weight: reverseWeight });
                }
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
            matrix[toIndex][fromIndex] = edge.weight; // Añadir para aristas bidireccionales
        });
        return matrix;
    }

    function displayAdjacencyMatrix(matrix, highlightPath = []) {
        const tableHead = document.getElementById('adjacencyMatrixTable').querySelector('thead');
        const tableBody = document.getElementById('adjacencyMatrixTable').querySelector('tbody');
        tableHead.innerHTML = '';  // Limpiar encabezado
        tableBody.innerHTML = '';  // Limpiar cuerpo de la tabla

        // Crear encabezado de la tabla
        const headerRow = document.createElement('tr');
        const emptyTh = document.createElement('th');
        headerRow.appendChild(emptyTh); // Deja espacio vacío en la esquina superior izquierda
        for (let i = 1; i <= matrix.length; i++) {
            const th = document.createElement('th');
            th.textContent = `v${i}`;
            headerRow.appendChild(th);
        }
        tableHead.appendChild(headerRow);

        // Crear cuerpo de la tabla con los valores de la matriz
        matrix.forEach((row, rowIndex) => {
            const rowElement = document.createElement('tr');
            const rowHeader = document.createElement('th');
            rowHeader.textContent = `v${rowIndex + 1}`;
            rowElement.appendChild(rowHeader);

            row.forEach((cell, colIndex) => {
                const td = document.createElement('td');
                const cellContent = cell === Infinity ? 'Inf' : cell;

                td.textContent = cellContent;
                if (cell === Infinity) {
                    td.classList.add('infinity-cell');
                }

                // Resaltar celdas que representan el camino más corto
                const edge = { from: rowIndex + 1, to: colIndex + 1 };
                if (highlightPath.some(pathEdge =>
                    (pathEdge.from === edge.from && pathEdge.to === edge.to) ||
                    (pathEdge.from === edge.to && pathEdge.to === edge.from))) {
                    td.classList.add('highlight-cell');
                }
                rowElement.appendChild(td);
            });
            tableBody.appendChild(rowElement);
        });
    }

    function drawGraph(nodes, edges, ctx, highlightPath = []) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const nodeSize = Math.max(40 - nodes.length, 20);
        const fontSize = Math.max(20 - Math.floor(nodes.length / 5), 10);
        ctx.font = `bold ${fontSize}px Arial`;

        edges.forEach(edge => {
            const fromNode = nodes.find(node => node.id === edge.from);
            const toNode = nodes.find(node => node.id === edge.to);

            // Calcular ángulo de la línea
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const angle = Math.atan2(dy, dx);

            // Determinar si es bidireccional
            const isBidirectional = edges.some(e => e.from === edge.to && e.to === edge.from);

            // Ajustar posición para evitar amontonamiento
            const offsetFactor = isBidirectional ? 10 : 0;
            const offsetX = offsetFactor * Math.sin(angle);
            const offsetY = offsetFactor * -Math.cos(angle);

            const startX = fromNode.x + Math.cos(angle) * nodeSize + offsetX;
            const startY = fromNode.y + Math.sin(angle) * nodeSize + offsetY;
            const endX = toNode.x - Math.cos(angle) * nodeSize + offsetX;
            const endY = toNode.y - Math.sin(angle) * nodeSize + offsetY;

            // Dibujar línea (resaltar si está en el camino más corto)
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = highlightPath.some(
                pathEdge => pathEdge.from === edge.from && pathEdge.to === edge.to
            )
                ? 'red' // Color rojo para el camino resaltado
                : 'black'; // Color negro para las demás aristas
            ctx.lineWidth = 2;
            ctx.stroke();

            // Dibujar flecha
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(
                endX - 10 * Math.cos(angle - Math.PI / 6),
                endY - 10 * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                endX - 10 * Math.cos(angle + Math.PI / 6),
                endY - 10 * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fillStyle = highlightPath.some(
                pathEdge => pathEdge.from === edge.from && pathEdge.to === edge.to
            )
                ? 'red'
                : 'black';
            ctx.fill();

            // Mostrar peso en la línea
            const midX = (fromNode.x + toNode.x) / 2 + offsetX;
            const midY = (fromNode.y + toNode.y) / 2 + offsetY;
            const textOffset = isBidirectional ? 10 : 0; // Desplazamiento adicional para pesos bidireccionales

            ctx.fillStyle = 'black';
            ctx.fillText(edge.weight, midX, midY - textOffset);
        });

        // Dibujar nodos
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.fillText(node.id, node.x - fontSize / 2, node.y + fontSize / 2);
        });
    }

    function bellmanFord(adjacencyMatrix, edges, startNode) {
        const numNodes = adjacencyMatrix.length;
        const distances = Array(numNodes).fill(Infinity);
        const predecessors = Array(numNodes).fill(null);
        distances[startNode - 1] = 0;

        // Relajar las aristas (V-1 veces)
        for (let i = 0; i < numNodes - 1; i++) {
            edges.forEach(edge => {
                const fromIndex = edge.from - 1;
                const toIndex = edge.to - 1;
                const weight = edge.weight;

                // Relajar la arista solo si se puede mejorar la distancia
                if (distances[fromIndex] !== Infinity && distances[fromIndex] + weight < distances[toIndex]) {
                    distances[toIndex] = distances[fromIndex] + weight;
                    predecessors[toIndex] = fromIndex;
                }
            });
        }

        // Verificar ciclos negativos: Si en el último paso se puede relajar una arista, hay un ciclo negativo
        let hasNegativeCycle = false;
        edges.forEach(edge => {
            const fromIndex = edge.from - 1;
            const toIndex = edge.to - 1;
            const weight = edge.weight;

            if (distances[fromIndex] !== Infinity && distances[fromIndex] + weight < distances[toIndex]) {
                hasNegativeCycle = true;
            }
        });

        if (hasNegativeCycle) {
            alert("El grafo contiene un ciclo negativo. Se puede continuar, pero los resultados pueden no ser confiables.");
        }
        return { distances, predecessors };
    }

    function reconstructPath(predecessors, startNode, endNode) {
        const path = [];
        let currentNode = endNode - 1;

        while (currentNode !== null && currentNode !== startNode - 1) {
            path.unshift(currentNode + 1); // Agregar nodo al inicio de la ruta
            currentNode = predecessors[currentNode];
        }

        if (currentNode === startNode - 1) {
            path.unshift(startNode); // Agregar el nodo inicial
            return path;
        }
        return null; // No hay ruta
    }

    document.getElementById('startBtn').addEventListener('click', () => {
        const startNode = parseInt(document.getElementById('startNode').value);
        const endNode = parseInt(document.getElementById('endNode').value);

        if (
            isNaN(startNode) || startNode < 1 || startNode > nodes.length ||
            isNaN(endNode) || endNode < 1 || endNode > nodes.length
        ) {
            alert('Por favor, ingrese nodos de inicio y fin válidos.');
            return;
        }

        try {
            const { distances, predecessors } = bellmanFord(adjacencyMatrix, edges, startNode);
            const path = reconstructPath(predecessors, startNode, endNode);

            if (path) {
                const cost = distances[endNode - 1];
                document.getElementById('resultText').innerText =
                    `La ruta más corta desde el nodo ${startNode} hacia ${endNode} es: ${path.join(' -> ')}` +
                    `\nCon un costo de: ${cost}`;

                // Determinar las aristas del camino más corto
                const highlightPath = [];
                for (let i = 0; i < path.length - 1; i++) {
                    highlightPath.push({ from: path[i], to: path[i + 1] });
                }

                // Redibujar el grafo con las aristas resaltadas
                drawGraph(nodes, edges, ctx, highlightPath);
            } else {
                document.getElementById('resultText').innerText =
                    `No existe una ruta desde el nodo ${startNode} hacia ${endNode}.`;
            }
        } catch (error) {
            alert(error.message);
        }
    });

    document.getElementById('cleanBtn').addEventListener('click', () => {
        document.getElementById('numNodes').value = '';
        document.getElementById('minWeight').value = '';
        document.getElementById('maxWeight').value = '';
        document.getElementById('startNode').value = '';
        document.getElementById('endNode').value = '';

        nodes = [];
        edges = [];
        adjacencyMatrix = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('resultText').innerText = '';
        document.getElementById('adjacencyMatrixTable').querySelector('thead').innerHTML = '';
        document.getElementById('adjacencyMatrixTable').querySelector('tbody').innerHTML = '';
    });
});

function navigateTo(page) {
    window.location.href = page;
}