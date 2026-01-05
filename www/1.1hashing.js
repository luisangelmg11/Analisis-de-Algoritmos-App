function processValues() {
    var inputText = document.getElementById('inputText').value;
    var values = inputText.split(',').map(value => value.trim());
    var originalValues = [];
    var hashedValues = [];

    values.forEach(function (value) {
        originalValues.push(value);
        hashedValues.push(hashFunction(value));
    });

    displayResults(originalValues, hashedValues);
}

function hashFunction(value) {
    var hash = 0;
    for (var i = 0; i < value.length; i++) {
        var char = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
}

function displayResults(originalValues, hashedValues) {
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    for (var i = 0; i < originalValues.length; i++) {
        resultsDiv.innerHTML += `<div class="result"><strong>Sin Encriptar:</strong> ${originalValues[i]} - <strong>Encriptados:</strong> ${hashedValues[i]}</div>`;
    }
}

function clearResults() {
    document.getElementById('inputText').value = '';
    document.getElementById('results').innerHTML = '';
}

function navigateTo(page) {
    window.location.href = page;
}
function navigateBack() {
    window.history.back();
}