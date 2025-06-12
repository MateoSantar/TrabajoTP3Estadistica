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
        }else {
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
            asistHistoryDic[asistencia.fecha] += asistencia.asistencia;
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

window.onload = () => {
    studentsGraph();
    communicateGraph();
    asistanceHistoryGraph();
}