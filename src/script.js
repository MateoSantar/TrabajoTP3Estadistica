async function getData(URL) {
    data = await fetch(URL);
    dataJson = await data.json();
    return dataJson;
}

function dataToDic(dataJson) {
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

async function studentsGraph() {
    data = await getData('https://apidemo.geoeducacion.com.ar/api/testing/estudiantes/1');
    dataDic = dataToDic(data.data);
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

window.onload = () => {
    studentsGraph();
}