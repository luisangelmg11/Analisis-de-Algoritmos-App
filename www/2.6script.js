// Función de Insertion Sort
function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// Función de Optimized Bubble Sort
function optimizedBubbleSort(arr) {
    let n = arr.length;
    let swapped;
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}

// Función de Selection Sort
function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            let temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
        }
    }
}

// Función de Quick Sort
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)];
}

// Función de Merge Sort
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Función para formatear el tiempo
function formatTime(timeInMs) {
    return `${timeInMs.toFixed(2)} ms`;
}

// Función para generar un arreglo aleatorio
function generateRandomArray(size, minValue, maxValue) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    }
    return arr;
}

let chart; // Variable global para el gráfico

// Iniciar pruebas con botón
document.getElementById('startBtn').addEventListener('click', () => {
    const minValue = parseInt(document.getElementById('minValue').value);
    const maxValue = parseInt(document.getElementById('maxValue').value);

    // Validar los valores ingresados
    if (isNaN(minValue) || isNaN(maxValue) || minValue >= maxValue) {
        alert("Por favor, ingresa valores válidos donde el valor mínimo sea menor que el valor máximo.");
        return;
    }

    let numTests = 10;
    let increment = Math.floor((maxValue - minValue) / (numTests - 1));

    let testSizes = [];
    let timesInsertionSort = [];
    let timesBubbleSort = [];
    let timesSelectionSort = [];
    let timesQuickSort = [];
    let timesMergeSort = [];

    let resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = ''; // Limpiar tabla de resultados

    // Realizar pruebas con los 5 algoritmos
    for (let i = 1; i <= numTests; i++) {
        let arraySize;

        if (i === numTests) {
            arraySize = maxValue;
        } else {
            arraySize = minValue + (i - 1) * increment;
        }

        let arrInsertion = generateRandomArray(arraySize, minValue, maxValue);
        let arrBubble = [...arrInsertion]; // Copia del array para el segundo algoritmo
        let arrSelection = [...arrInsertion]; // Copia del array para el tercer algoritmo
        let arrQuick = [...arrInsertion]; // Copia del array para Quick Sort
        let arrMerge = [...arrInsertion]; // Copia del array para Merge Sort

        // Medir tiempo de Insertion Sort
        let startTime = performance.now();
        insertionSort(arrInsertion);
        let endTime = performance.now();
        let timeTaken = endTime - startTime;
        timesInsertionSort.push(timeTaken);

        // Medir tiempo de Optimized Bubble Sort
        startTime = performance.now();
        optimizedBubbleSort(arrBubble);
        endTime = performance.now();
        timeTaken = endTime - startTime;
        timesBubbleSort.push(timeTaken);

        // Medir tiempo de Selection Sort
        startTime = performance.now();
        selectionSort(arrSelection);
        endTime = performance.now();
        timeTaken = endTime - startTime;
        timesSelectionSort.push(timeTaken);

        // Medir tiempo de Quick Sort
        startTime = performance.now();
        quickSort(arrQuick);
        endTime = performance.now();
        timeTaken = endTime - startTime;
        timesQuickSort.push(timeTaken);

        // Medir tiempo de Merge Sort
        startTime = performance.now();
        mergeSort(arrMerge);
        endTime = performance.now();
        timeTaken = endTime - startTime;
        timesMergeSort.push(timeTaken);

        // Mostrar resultados en la tabla
        let formattedTimeInsertion = formatTime(timesInsertionSort[i - 1]);
        let formattedTimeBubble = formatTime(timesBubbleSort[i - 1]);
        let formattedTimeSelection = formatTime(timesSelectionSort[i - 1]);
        let formattedTimeQuick = formatTime(timesQuickSort[i - 1]);
        let formattedTimeMerge = formatTime(timesMergeSort[i - 1]);

        let row = `<tr>
                    <td>${i}</td>
                    <td>${arraySize}</td>
                    <td>${formattedTimeInsertion}</td>
                    <td>${formattedTimeBubble}</td>
                    <td>${formattedTimeSelection}</td>
                    <td>${formattedTimeQuick}</td>
                    <td>${formattedTimeMerge}</td>
                  </tr>`;
        resultTable.innerHTML += row;

        testSizes.push(i);
    }

    // Renderizar la gráfica con los cinco algoritmos
    renderChart(testSizes, timesInsertionSort, timesBubbleSort, timesSelectionSort, timesQuickSort, timesMergeSort);
});

// Limpiar resultados con botón
document.getElementById('cleanBtn').addEventListener('click', () => {
    document.getElementById('resultTable').innerHTML = '';
    if (chart) {
        chart.destroy(); // Destruir el gráfico existente
    }

    // Limpiar las cajas de texto
    document.getElementById('minValue').value = '';
    document.getElementById('maxValue').value = '';
});

// Función para renderizar el gráfico
function renderChart(labels, dataInsertion, dataBubble, dataSelection, dataQuick, dataMerge) {
    const ctx = document.getElementById('timeChart').getContext('2d');
    if (chart) {
        chart.destroy(); // Destruir el gráfico existente antes de crear uno nuevo
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Etiquetas (número de prueba)
            datasets: [
                {
                    label: 'Insertion Sort',
                    data: dataInsertion,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Bubble Sort',
                    data: dataBubble,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Selection Sort',
                    data: dataSelection,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Quick Sort',
                    data: dataQuick,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderWidth: 1
                },
                {
                    label: 'Merge Sort',
                    data: dataMerge,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Número de Prueba'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Tiempo (ms)'
                    }
                }
            }
        }
    });
}

function navigateTo(page) {
    window.location.href = page;
}
