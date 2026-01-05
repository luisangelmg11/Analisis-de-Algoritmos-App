function generarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function busquedaLineal(estructura, valorABuscar) {
    const inicio = performance.now();
    for (let i = 0; i < estructura.length; i++) {
        if (estructura[i] === valorABuscar) {
            const fin = performance.now();
            return { posicion: i, tiempo: fin - inicio };
        }
    }
    const fin = performance.now();
    return { posicion: -1, tiempo: fin - inicio };
}

function busquedaBinariaIterativa(estructura, valorABuscar) {
    const inicio = performance.now();
    let min = 0;
    let max = estructura.length - 1;

    while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        if (estructura[mid] === valorABuscar) {
            const fin = performance.now();
            return { posicion: mid, tiempo: fin - inicio };
        } else if (estructura[mid] < valorABuscar) {
            min = mid + 1;
        } else {
            max = mid - 1;
        }
    }
    const fin = performance.now();
    return { posicion: -1, tiempo: fin - inicio };
}

function busquedaBinariaRecursiva(estructura, valorABuscar, min, max, inicio) {
    if (min > max) {
        const fin = performance.now();
        return { posicion: -1, tiempo: fin - inicio };
    }

    const mid = Math.floor((min + max) / 2);

    if (estructura[mid] === valorABuscar) {
        const fin = performance.now();
        return { posicion: mid, tiempo: fin - inicio };
    } else if (estructura[mid] < valorABuscar) {
        return busquedaBinariaRecursiva(estructura, valorABuscar, mid + 1, max, inicio);
    } else {
        return busquedaBinariaRecursiva(estructura, valorABuscar, min, mid - 1, inicio);
    }
}

function realizarBusqueda(tipo) {
    const resultadosTabla = document.getElementById('resultadosTabla');
    if (resultadosTabla) resultadosTabla.innerHTML = '';  // Limpiar tabla

    const minValue = parseInt(document.getElementById('minValue').value);
    const maxValue = parseInt(document.getElementById('maxValue').value);

    if (isNaN(minValue) || isNaN(maxValue) || minValue >= maxValue) {
        alert("Por favor, ingresa valores válidos donde el valor mínimo sea menor que el valor máximo.");
        return;
    }

    const resultados = [];
    const tiemposTotales = [];

    for (let prueba = 1; prueba <= 10; prueba++) {
        const estructura = [];
        for (let i = 0; i < maxValue; i++) {
            estructura.push(generarNumeroAleatorio(minValue, maxValue));
        }
        estructura.sort((a, b) => a - b);

        const valorMaximo = estructura[estructura.length - 1];
        const valorABuscar = Math.random() > 0.5 ? estructura[generarNumeroAleatorio(0, estructura.length - 1)] : generarNumeroAleatorio(minValue, maxValue);

        let resultadoBusqueda;
        if (tipo === 'lineal') {
            resultadoBusqueda = busquedaLineal(estructura, valorABuscar);
        } else if (tipo === 'binariaIterativa') {
            resultadoBusqueda = busquedaBinariaIterativa(estructura, valorABuscar);
        } else if (tipo === 'binariaRecursiva') {
            const inicioRecursiva = performance.now();
            resultadoBusqueda = busquedaBinariaRecursiva(estructura, valorABuscar, 0, estructura.length - 1, inicioRecursiva);
        }

        resultados.push({
            prueba: prueba,
            valorMaximo: valorMaximo,
            valorABuscar: valorABuscar,
            tiempoTomado: resultadoBusqueda.tiempo,
            posicion: resultadoBusqueda.posicion
        });

        tiemposTotales.push(resultadoBusqueda.tiempo);

        const row = `<tr>
            <td>${prueba}</td>
            <td>${valorMaximo}</td>
            <td>${valorABuscar}</td>
            <td>${resultadoBusqueda.tiempo.toFixed(2)}</td>
            <td>${resultadoBusqueda.posicion}</td>
        </tr>`;
        if (resultadosTabla) resultadosTabla.innerHTML += row;
    }

    graficarTiempos(tiemposTotales);
}

function graficarTiempos(tiemposTotales) {
    const ctx = document.getElementById('grafica').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Prueba 1', 'Prueba 2', 'Prueba 3', 'Prueba 4', 'Prueba 5', 'Prueba 6', 'Prueba 7', 'Prueba 8', 'Prueba 9', 'Prueba 10'],
            datasets: [
                {
                    label: 'Tiempos Totales de Búsqueda (ms)',
                    data: tiemposTotales,
                    borderColor: 'rgba(255, 99, 132, 1)',  // Cambiado a rojo
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Cambiado a rojo
                    fill: true,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function navigateTo(page) {
    window.location.href = page;
}

function clearResults() {
    const resultadosTabla = document.getElementById('resultadosTabla');
    if (resultadosTabla) resultadosTabla.innerHTML = '';  // Limpiar tabla

    const ctx = document.getElementById('grafica').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Limpiar las cajas de texto
    document.getElementById('minValue').value = '';
    document.getElementById('maxValue').value = '';
}
