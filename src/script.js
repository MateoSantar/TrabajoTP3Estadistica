async function getData(URL) { // This function fetches data from the given URL and returns the JSON response
    data = await fetch(URL);
    dataJson = await data.json();
    return dataJson;
}

function studentsToDictionary(dataJson) { // This function converts student data into a dictionary with course as key and count as value
    let dic = {};
    dataJson.forEach(estudiante => {
        if (!dic[estudiante.curso]) {
            dic[estudiante.curso] = 1;
        } else {
            dic[estudiante.curso] += 1;
        }
    });
    return dic;
}

async function studentsGraph() { // This function fetches student data and creates a bar chart
    data = await getData('https://apidemo.geoeducacion.com.ar/api/testing/estudiantes/1');
    dataDic = studentsToDictionary(data.data);
    const ctx = document.getElementById('students-graph').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dataDic),
            datasets: [{
                label: 'Cantidad de estudiantes por curso',
                data: Object.values(dataDic),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    precision: 0
                }
            }
        }
    });

}

async function communicateGraph() { // This function fetches communication data and creates a bar chart
    data = await getData('https://apidemo.geoeducacion.com.ar/api/testing/comunicados/1');
    communicationsData = data.data[0];
    const labels = ['total', 'entregaods', 'pendientes', 'error'];
    const values = [
        communicationsData.total,
        communicationsData.entregados,
        communicationsData.pendientes,
        communicationsData.error
    ];
    const ctx = document.getElementById('communicate-graph').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Comunicados'],
            datasets: [
                {
                    label: 'Entregados',
                    data: [communicationsData.entregados],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)'
                },
                {
                    label: 'Pendientes',
                    data: [communicationsData.pendientes],
                    backgroundColor: 'rgba(255, 205, 86, 0.7)'
                },
                {
                    label: 'Error',
                    data: [communicationsData.error],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: communicationsData.total
                }
            }
        }
    });
}

async function asistanceHistoryGraph() { // This function fetches assistance history data and creates a line chart
    data = await getData('https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1');
    let asistHistoryDic = {};
    data.data.forEach(asistencia => {
        if (!asistHistoryDic[asistencia.mes]) {
            asistHistoryDic[asistencia.mes] = asistencia.asistencia; //NO HAY NOVIEMBRE
        } else {
            asistHistoryDic['Error en nombre'] += asistencia.asistencia;
        }
    }
    );
    console.log(data.data);

    const ctx = document.getElementById('history-graph').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(asistHistoryDic),
            datasets: [{
                label: 'Asistencia por mes',
                data: Object.values(asistHistoryDic),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    precision: 0
                }
            }
        }
    });

}
async function asistanceGraph() {
    const data = await getData('https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1');
    const asistanceList = data.data;

    let presentes = 0;
    let ausentes = 0;

    asistanceList.forEach(asistencia => {
        presentes += asistencia.presentes;
        ausentes += asistencia.ausentes;
    });

    const ctx = document.getElementById("asistance-graph").getContext("2d");

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Presentes', 'Ausentes'],
            datasets: [{
                label: 'Asistencia general',
                data: [presentes, ausentes],
                backgroundColor: ['#4CAF50', '#F44336'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Asistencia General'
                }
            }
        }
    });
}

async function gradesGraph() {
    const data = await getData('https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1');
    const gradesList = data.data;

    let aprobados = 0;
    let desaprobados = 0;

    gradesList.forEach(calif => {
        aprobados += calif.aprobados;
        desaprobados += calif.desaprobados;
    });

    const ctx = document.getElementById("grades-graph").getContext("2d");

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Aprobados', 'Desaprobados'],
            datasets: [{
                label: 'Calificaciones generales',
                data: [aprobados, desaprobados],
                backgroundColor: ['#2196F3', '#FF9800'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Calificaciones Generales'
                }
            }
        }
    });
}

window.onload = () => {
    studentsGraph();
    communicateGraph();
    asistanceHistoryGraph();
    asistanceGraph();
    gradesGraph();
}