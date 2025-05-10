document.addEventListener('DOMContentLoaded', function() {
    console.log("Shoulder Press detay sayfası yükleniyor...");
    const exerciseName = 'shoulder-press';
    let weightData = [];
    let weightChart = null;
    
    // Chart.js'nin yüklenip yüklenmediğini kontrol et
    if (typeof Chart === 'undefined') {
        console.error("Chart.js kütüphanesi yüklenemedi!");
        alert("Grafik kütüphanesi yüklenemedi. Lütfen sayfayı yenileyin.");
    } else {
        console.log("Chart.js kütüphanesi başarıyla yüklendi.");
    }
    
    // Canvas elementini kontrol et
    const chartCanvas = document.getElementById('weightChart');
    if (!chartCanvas) {
        console.error("weightChart id'li canvas elementi bulunamadı!");
    } else {
        console.log("Canvas elementi bulundu.");
        // Canvas boyutunu ayarla
        chartCanvas.style.height = '400px';
        chartCanvas.style.width = '100%';
        chartCanvas.height = 400; // Piksel cinsinden yükseklik
        chartCanvas.width = chartCanvas.offsetWidth; // Konteyner genişliği kadar
    }
    
    // LocalStorage'dan verileri yükle
    loadData();
    
    // Form gönderme işlevi
    const weightForm = document.getElementById('weight-form');
    if (weightForm) {
        weightForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const dateInput = document.getElementById('workout-date');
            const weightInput = document.getElementById('workout-weight');
            const repsInput = document.getElementById('workout-reps');
            
            if (!dateInput || !weightInput || !repsInput) {
                console.error("Form elementleri bulunamadı!");
                return;
            }
            
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
    } else {
        console.error("weight-form id'li form elementi bulunamadı!");
    }
    
    // İlk yükleme
    updateChart();
    updateHistoryList();
    
    // Fonksiyonlar
    function loadData() {
        const savedData = localStorage.getItem(`${exerciseName}_workout_data`);
        console.log("LocalStorage'dan veri yükleme girişimi:", `${exerciseName}_workout_data`);
        
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
                console.log("Veriler başarıyla yüklendi:", weightData);
            } catch (error) {
                console.error("Veri yükleme hatası:", error);
                weightData = [];
            }
        } else {
            console.log("LocalStorage'da veri bulunamadı, boş bir dizi oluşturuluyor.");
            weightData = [];
        }
    }
    
    function saveData() {
        try {
            localStorage.setItem(`${exerciseName}_workout_data`, JSON.stringify(weightData));
            console.log("Veriler başarıyla kaydedildi:", weightData);
        } catch (error) {
            console.error("Veri kaydetme hatası:", error);
            alert("Veriler kaydedilirken bir hata oluştu.");
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
        console.log("Grafik güncelleniyor...");
        const ctx = document.getElementById('weightChart');
        
        if (!ctx) {
            console.error("Canvas elementi bulunamadı!");
            return;
        }
        
        const ctxContext = ctx.getContext('2d');
        if (!ctxContext) {
            console.error("Canvas 2D context alınamadı!");
            return;
        }
        
        console.log("Veri sayısı:", weightData.length);
        
        // Grafiği temizle
        if (weightChart) {
            console.log("Mevcut grafik temizleniyor...");
            weightChart.destroy();
            weightChart = null;
        }
        
        // Veri yoksa boş grafik göster
        if (weightData.length === 0) {
            console.log("Veri yok, boş grafik oluşturuluyor...");
            
            // Boş grafik oluştur
            weightChart = new Chart(ctxContext, {
                type: 'line',
                data: {
                    labels: ['Veri Yok'],
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
            
            // Boş grafik mesajı
            ctxContext.save();
            ctxContext.textAlign = 'center';
            ctxContext.textBaseline = 'middle';
            ctxContext.font = '16px Arial';
            ctxContext.fillStyle = '#757575';
            ctxContext.fillText('Henüz kayıt bulunmamaktadır. Yeni bir kayıt ekleyin.', ctx.width / 2, ctx.height / 2);
            ctxContext.restore();
            
            console.log("Boş grafik oluşturuldu.");
            return;
        }
        
        // Veri varsa grafik oluştur
        console.log("Veriler ile grafik oluşturuluyor...");
        
        const labels = weightData.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
        });
        
        const weights = weightData.map(item => item.weight);
        const reps = weightData.map(item => item.reps || 0);
        
        console.log("Tarih etiketleri:", labels);
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
        
        try {
            // Yeni chart oluştur
            weightChart = new Chart(ctxContext, {
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
            
            console.log("Grafik başarıyla oluşturuldu!");
        } catch (error) {
            console.error("Grafik oluşturma hatası:", error);
            alert("Grafik oluşturulurken bir hata oluştu. Lütfen sayfayı yenileyin.");
        }
    }
    
    function updateHistoryList() {
        console.log("Geçmiş listesi güncelleniyor...");
        const historyList = document.getElementById('history-list');
        
        if (!historyList) {
            console.error("history-list id'li element bulunamadı!");
            return;
        }
        
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