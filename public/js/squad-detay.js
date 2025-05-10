document.addEventListener('DOMContentLoaded', function() {
    console.log("Squat detay sayfası yükleniyor...");
    const exerciseName = 'squat';
    let weightData = [];
    let weightChart = null;
    
    // Canvas elementi için önce görünür boyut ayarlama
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.innerHTML = '<canvas id="weightChart" width="800" height="400"></canvas>';
    }
    
    // Chart.js yüklenme kontrolü
    if (window.Chart) {
        console.log("Chart.js kütüphanesi bulundu.");
        
        // Veri yükleme
        loadData();
        initChartAfterDelay();
    } else {
        console.error("Chart.js kütüphanesi bulunamadı!");
        // Chart.js kütüphanesini dinamik olarak yükle
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        chartScript.onload = function() {
            console.log("Chart.js başarıyla yüklendi.");
            loadData();
            initChartAfterDelay();
        };
        chartScript.onerror = function() {
            console.error("Chart.js yüklenemedi!");
            alert("Grafik kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.");
        };
        document.head.appendChild(chartScript);
    }
    
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
    
    // Grafik oluşturmayı kısa bir gecikmeyle başlat (DOM'un tamamen yüklenmesini bekle)
    function initChartAfterDelay() {
        setTimeout(() => {
            updateChart();
            updateHistoryList();
        }, 200); // 200ms sonra grafik oluştur
    }
    
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
        
        // Canvas elementini yeniden oluştur (grafik hatalarını önlemek için)
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = '<canvas id="weightChart" width="800" height="400"></canvas>';
        }
        
        const canvas = document.getElementById('weightChart');
        if (!canvas) {
            console.error("Canvas elementi bulunamadı!");
            return;
        }
        
        // Grafiği temizle
        if (weightChart) {
            weightChart.destroy();
            weightChart = null;
        }
        
        // Canvas boyutlarını ayarla
        canvas.style.width = '100%';
        canvas.style.height = '400px';
        canvas.width = canvas.offsetWidth;
        canvas.height = 400;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Canvas 2D context alınamadı!");
            return;
        }
        
        console.log("Veri sayısı:", weightData.length);
        
        // Veri yoksa boş grafik göster ve mesaj ekle
        if (weightData.length === 0) {
            console.log("Veri yok, boş grafik oluşturuluyor...");
            
            // Boş grafik için basit bir şema oluştur
            try {
                weightChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [''],
                        datasets: [{
                            label: 'Kaldırılan Ağırlık (kg)',
                            data: [],
                        }, {
                            label: 'Tekrar Sayısı',
                            data: [],
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                
                // Boş grafik mesajı
                ctx.font = '16px Arial';
                ctx.fillStyle = '#757575';
                ctx.textAlign = 'center';
                ctx.fillText('Henüz kayıt bulunmamaktadır. Yeni bir kayıt ekleyin.', canvas.width / 2, canvas.height / 2);
            } catch (error) {
                console.error("Boş grafik oluşturma hatası:", error);
            }
            
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
                weightLineColors.push('#757575');
                repLineColors.push('#9E9E9E');
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
        }
        
        try {
            // Chart.js'nin en temel yapılandırması ile başla
            weightChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Kaldırılan Ağırlık (kg)',
                            data: weights,
                            borderWidth: 3,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: '#4CAF50',
                            tension: 0.3,
                            pointBackgroundColor: weightPointColors,
                            pointBorderColor: '#fff',
                            yAxisID: 'y'
                        },
                        {
                            label: 'Tekrar Sayısı',
                            data: reps,
                            borderWidth: 2,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: '#FF9800',
                            borderDash: [5, 5],
                            pointBackgroundColor: repPointColors,
                            pointBorderColor: '#fff',
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Ağırlık (kg)'
                            },
                            beginAtZero: true
                        },
                        y1: {
                            type: 'linear', 
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Tekrar Sayısı'
                            },
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
            
            console.log("Grafik başarıyla oluşturuldu!");
        } catch (error) {
            console.error("Grafik oluşturma hatası:", error);
            // Hata durumunda daha basit bir grafik deneme
            try {
                weightChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Kaldırılan Ağırlık (kg)',
                            data: weights,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    }
                });
                console.log("Basitleştirilmiş grafik oluşturuldu.");
            } catch (fallbackError) {
                console.error("Basitleştirilmiş grafik oluşturma hatası:", fallbackError);
                alert("Grafik oluşturulamadı. Lütfen sayfayı yenileyin.");
            }
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