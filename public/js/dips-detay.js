document.addEventListener('DOMContentLoaded', function() {
    const exerciseName = 'dips';
    let weightData = [];
    let weightChart = null;
    
    // LocalStorage'dan verileri yükle
    loadData();
    
    // Form gönderme işlevi
    document.getElementById('weight-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const dateInput = document.getElementById('workout-date');
        const weightInput = document.getElementById('workout-weight');
        const repsInput = document.getElementById('workout-reps');
        
        const date = dateInput.value;
        const weight = parseFloat(weightInput.value);
        const reps = parseInt(repsInput.value);
        
        if (!date || isNaN(weight) || isNaN(reps)) {
            alert('Lütfen geçerli bir tarih, ağırlık ve tekrar sayısı giriniz.');
            return;
        }
        
        console.log("Yeni veri ekleniyor:", date, weight, reps);
        
        // Yeni veriyi ekle
        addWorkoutData(date, weight, reps);
        
        // Formu sıfırla
        dateInput.value = '';
        weightInput.value = '';
        repsInput.value = '';
        
        // Sayfayı güncelle
        updateChart();
        updateHistoryList();
        saveData();
    });
    
    // İlk yükleme
    updateChart();
    updateHistoryList();
    
    // Fonksiyonlar
    function loadData() {
        const savedData = localStorage.getItem(`${exerciseName}_workout_data`);
        if (savedData) {
            try {
                weightData = JSON.parse(savedData);
                // Eski verileri kontrol et ve tekrar sayısı ekle
                weightData = weightData.map(item => {
                    if (item.reps === undefined) {
                        item.reps = 0;  // Eski verilere varsayılan değer
                    }
                    return item;
                });
                console.log("Yüklenen veriler:", weightData);
            } catch (error) {
                console.error("Veri yükleme hatası:", error);
                weightData = [];
            }
        }
    }
    
    function saveData() {
        try {
            localStorage.setItem(`${exerciseName}_workout_data`, JSON.stringify(weightData));
            console.log("Veriler kaydedildi:", weightData);
        } catch (error) {
            console.error("Veri kaydetme hatası:", error);
        }
    }
    
    function addWorkoutData(date, weight, reps) {
        // Aynı tarihte bir kayıt var mı kontrol et
        const existingIndex = weightData.findIndex(item => item.date === date);
        
        if (existingIndex !== -1) {
            if (confirm('Bu tarihte zaten bir kayıt var. Üzerine yazmak istiyor musunuz?')) {
                weightData[existingIndex].weight = weight;
                weightData[existingIndex].reps = reps;
                console.log("Mevcut kayıt güncellendi:", weightData[existingIndex]);
            } else {
                return;
            }
        } else {
            // Tarihleri sırala ve yeni veriyi ekle
            const newData = { date, weight, reps };
            weightData.push(newData);
            weightData.sort((a, b) => new Date(a.date) - new Date(b.date));
            console.log("Yeni kayıt eklendi:", newData);
        }
    }
    
    function updateChart() {
        const ctx = document.getElementById('weightChart').getContext('2d');
        
        console.log("Grafik güncelleniyor, veri sayısı:", weightData.length);
        
        if (weightData.length === 0) {
            if (weightChart) {
                weightChart.destroy();
                weightChart = null;
            }
            
            // Boş grafik oluştur
            weightChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Kaldırılan Ağırlık (kg)',
                        data: [],
                        borderWidth: 3,
                        tension: 0.3,
                    }, {
                        label: 'Tekrar Sayısı',
                        data: [],
                        borderWidth: 2,
                        tension: 0.3,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Değer'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tarih'
                            }
                        }
                    }
                }
            });
            
            ctx.font = '16px Arial';
            ctx.fillStyle = '#757575';
            ctx.textAlign = 'center';
            ctx.fillText('Henüz kayıt bulunmamaktadır. Yeni bir kayıt ekleyin.', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }
        
        const labels = weightData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        });
        
        const weights = weightData.map(item => item.weight);
        const reps = weightData.map(item => item.reps || 0); // Eski kayıtlarda tekrar sayısı yoksa 0 kullan
        
        console.log("Ağırlık verileri:", weights);
        console.log("Tekrar verileri:", reps);
        
        // Kilo için renk belirleme
        const weightPointColors = [];
        const weightLineColors = [];
        
        // Tekrar sayısı için renk belirleme
        const repPointColors = [];
        const repLineColors = [];
        
        for (let i = 0; i < weights.length; i++) {
            if (i === 0) {
                // İlk değerler nötr renk
                weightPointColors.push('#757575');
                repPointColors.push('#9E9E9E');
            } else {
                // Kilo değişimi
                if (weights[i] > weights[i-1]) {
                    weightPointColors.push('#4CAF50');
                    weightLineColors.push('#4CAF50');
                } else if (weights[i] < weights[i-1]) {
                    weightPointColors.push('#F44336');
                    weightLineColors.push('#F44336');
                } else {
                    weightPointColors.push('#757575');
                    weightLineColors.push('#757575');
                }
                
                // Tekrar sayısı değişimi
                if (reps[i] > reps[i-1]) {
                    repPointColors.push('#8BC34A');
                    repLineColors.push('#8BC34A');
                } else if (reps[i] < reps[i-1]) {
                    repPointColors.push('#FF9800');
                    repLineColors.push('#FF9800');
                } else {
                    repPointColors.push('#9E9E9E');
                    repLineColors.push('#9E9E9E');
                }
            }
            
            // Bir sonraki çizgi için eklenecek renk
            if (i === weights.length - 1 && weights.length > 1) {
                weightLineColors.push(weightLineColors[weightLineColors.length - 1] || '#757575');
                repLineColors.push(repLineColors[repLineColors.length - 1] || '#9E9E9E');
            }
        }
        
        // Eğer chart zaten varsa onu yok et
        if (weightChart) {
            weightChart.destroy();
        }
        
        // Yeni chart oluştur
        weightChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Kaldırılan Ağırlık (kg)',
                        data: weights,
                        borderWidth: 3,
                        tension: 0.3,
                        fill: false,
                        pointBackgroundColor: weightPointColors,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        yAxisID: 'y',
                        segment: {
                            borderColor: ctx => {
                                const index = ctx.p0DataIndex;
                                return weightLineColors[index] || '#757575';
                            }
                        },
                        order: 1, // Önemli çizgiyi öne getir
                        zIndex: 2
                    },
                    {
                        label: 'Yapılan Tekrar',
                        data: reps,
                        borderWidth: 2,
                        borderDash: [5, 5], // Kesikli çizgi
                        tension: 0.3,
                        fill: false,
                        pointBackgroundColor: repPointColors,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        yAxisID: 'y1',
                        segment: {
                            borderColor: ctx => {
                                const index = ctx.p0DataIndex;
                                return repLineColors[index] || '#9E9E9E';
                            }
                        },
                        order: 2, // Arka planda göster
                        zIndex: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const datasetLabel = context.dataset.label || '';
                                const value = context.parsed.y;
                                if (datasetLabel.includes('Ağırlık')) {
                                    return `${datasetLabel}: ${value} kg`;
                                } else {
                                    return `${datasetLabel}: ${value} tekrar`;
                                }
                            },
                            title: function(context) {
                                return weightData[context[0].dataIndex].date;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Ağırlık (kg)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false, // Sadece tik işaretleri göster
                        },
                        title: {
                            display: true,
                            text: 'Tekrar Sayısı'
                        },
                        beginAtZero: true
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tarih'
                        }
                    }
                }
            }
        });
        
        console.log("Grafik oluşturuldu");
    }
    
    function updateHistoryList() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        
        if (weightData.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-dumbbell"></i>
                    <p>Henüz kayıt bulunmamaktadır.<br>Yeni bir kayıt ekleyin.</p>
                </div>
            `;
            return;
        }
        
        // Tarihe göre sıralama (en yeniden en eskiye)
        const sortedData = [...weightData].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedData.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(item.date);
            const formattedDate = date.toLocaleDateString('tr-TR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            
            let weightChangeClass = 'neutral';
            let weightChangeIcon = 'fa-minus';
            
            let repsChangeClass = 'neutral';
            let repsChangeIcon = 'fa-minus';
            
            // Bir önceki kayıtla karşılaştır (tersine sıralı olduğu için index + 1)
            if (index < sortedData.length - 1) {
                const prevItem = sortedData[index + 1];
                
                // Ağırlık değişimi
                if (item.weight > prevItem.weight) {
                    weightChangeClass = 'increase';
                    weightChangeIcon = 'fa-arrow-up';
                } else if (item.weight < prevItem.weight) {
                    weightChangeClass = 'decrease';
                    weightChangeIcon = 'fa-arrow-down';
                }
                
                // Tekrar sayısı değişimi
                if (item.reps !== undefined && prevItem.reps !== undefined) {
                    if (item.reps > prevItem.reps) {
                        repsChangeClass = 'increase';
                        repsChangeIcon = 'fa-arrow-up';
                    } else if (item.reps < prevItem.reps) {
                        repsChangeClass = 'decrease';
                        repsChangeIcon = 'fa-arrow-down';
                    }
                }
            }
            
            historyItem.innerHTML = `
                <div class="history-date">${formattedDate}</div>
                <div class="history-stats">
                    <div class="history-weight ${weightChangeClass}">
                        <i class="fas ${weightChangeIcon}"></i>
                        <span>${item.weight} kg</span>
                    </div>
                    <div class="history-reps ${repsChangeClass}">
                        <i class="fas ${repsChangeIcon}"></i>
                        <span>${item.reps !== undefined ? item.reps : '-'} tekrar</span>
                    </div>
                </div>
            `;
            
            // Silme düğmesi ekle
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-btn';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.addEventListener('click', function() {
                if (confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
                    const dateToDelete = item.date;
                    weightData = weightData.filter(data => data.date !== dateToDelete);
                    saveData();
                    updateChart();
                    updateHistoryList();
                }
            });
            
            historyItem.appendChild(deleteButton);
            historyList.appendChild(historyItem);
        });
    }
});