document.addEventListener('DOMContentLoaded', function() {
    // Tüm egzersiz kartları için gecikme efekti
    setTimeout(() => {
        const exerciseCards = document.querySelectorAll('.exercise-card');
        exerciseCards.forEach((card, index) => {
            // Her kart için farklı bir gecikme süresi verelim
            setTimeout(() => {
                card.classList.remove('loading');
                card.classList.add('fade-in');
            }, index * 300); // Her kart için ekstra 300ms gecikme
        });
    }, 1000); // İlk kart için 1 saniye ana gecikme
    
    // Egzersiz kartlarına tıklama işlevi
    const exerciseCards = document.querySelectorAll('.exercise-card');
    exerciseCards.forEach(card => {
        card.addEventListener('click', function() {
            const exercise = card.getAttribute('data-exercise');
            console.log(`${exercise} kartına tıklandı`);
            
            // Egzersiz tipine göre farklı sayfaya yönlendir
            if (exercise === 'bench-press') {
                window.location.href = 'bench-press-detay.html';
            } else if (exercise === 'deadlift') {
                window.location.href = 'deadlift-detay.html';
            } else if (exercise === 'dips') {
                window.location.href = 'dips-detay.html';
            } else if (exercise === 'hip-thrust') {
                window.location.href = 'hip-thrust-detay.html';
            } else if (exercise === 'pull-up') {
                window.location.href = 'pull-up-detay.html';
            } else if (exercise === 'shoulder-press') {
                window.location.href = 'shoulder-press-detay.html';
            } else if (exercise === 'squat') {
                window.location.href = 'squad-detay.html';
            } else {
                alert("Egzersiz detay sayfasına gidilecek");
            }
        });
    });
});