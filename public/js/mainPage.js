// Mobil menü toggle işlevselliği
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('#mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Sayfa kaydırıldığında navbar arka planını değiştirme
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 0) {
            navbar.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Aktif menü itemini vurgulama
    const currentLocation = location.href;
    const menuItems = document.querySelectorAll('.nav-link');
    
    menuItems.forEach(link => {
        if (link.href === currentLocation) {
            link.parentElement.classList.add('active');
            link.style.color = '#e91e63';
        }
    });
    
    // Video boyutunu ayarlama (eğer video varsa)
    const adjustVideoSize = () => {
        const video = document.getElementById('background-video');
        if (video) {
            // Video her zaman ekranı kaplayacak şekilde ayarlanır
            const windowRatio = window.innerWidth / window.innerHeight;
            const videoRatio = video.videoWidth / video.videoHeight;
            
            if (windowRatio > videoRatio) {
                video.style.width = '100%';
                video.style.height = 'auto';
            } else {
                video.style.width = 'auto';
                video.style.height = '100%';
            }
        }
    };
    
    window.addEventListener('resize', adjustVideoSize);
    
    // Video yüklendiğinde boyutunu ayarla (eğer video varsa)
    const video = document.getElementById('background-video');
    if (video) {
        video.addEventListener('loadeddata', adjustVideoSize);
        
        // Sayfa yüklenir yüklenmez fade-in efekti için sınıf ekleme
        setTimeout(() => {
            video.classList.add('fade-in');
        }, 100);
    }
});