document.addEventListener('DOMContentLoaded', function() {
    // Tab kontrolleri
    const tabButtons = document.querySelectorAll('.tab-btn');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif tab butonunu güncelle
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // İlgili tab içeriğini göster
            const tabName = this.getAttribute('data-tab');
            if (tabName === 'login') {
                loginTab.classList.remove('hidden');
                registerTab.classList.add('hidden');
            } else {
                loginTab.classList.add('hidden');
                registerTab.classList.remove('hidden');
            }
        });
    });
    
    // Şifre görünürlüğünü değiştirme
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling.previousElementSibling; // şifre input'u
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Form gönderme işlemleri
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Form verilerini al
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Normalde burada API çağrısı yapılır, şimdilik console.log
            console.log('Giriş denemesi:', { email, password, remember });
            
            // Başarılı giriş animasyonu
            const submitBtn = this.querySelector('.login-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            
            btnText.textContent = 'Giriş Yapılıyor...';
            btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simüle edilmiş başarılı giriş
            setTimeout(() => {
                btnText.textContent = 'Başarılı!';
                btnIcon.innerHTML = '<i class="fas fa-check"></i>';
                
                // Ana sayfaya yönlendirme
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }, 2000);
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Form verilerini al
            const name = document.getElementById('name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Şifre kontrolü
            if (password !== confirmPassword) {
                alert('Şifreler eşleşmiyor!');
                return;
            }
            
            // Normalde burada API çağrısı yapılır, şimdilik console.log
            console.log('Kayıt denemesi:', { name, email, password, terms });
            
            // Başarılı kayıt animasyonu
            const submitBtn = this.querySelector('.login-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('.btn-icon');
            
            btnText.textContent = 'Kayıt Yapılıyor...';
            btnIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simüle edilmiş başarılı kayıt
            setTimeout(() => {
                btnText.textContent = 'Kayıt Başarılı!';
                btnIcon.innerHTML = '<i class="fas fa-check"></i>';
                
                // Giriş tabına geçiş
                setTimeout(() => {
                    document.querySelector('[data-tab="login"]').click();
                    btnText.textContent = 'Kayıt Ol';
                    btnIcon.innerHTML = '<i class="fas fa-user-plus"></i>';
                    submitBtn.disabled = false;
                    registerForm.reset();
                }, 1000);
            }, 2000);
        });
    }
    
    // Giriş formu animasyonları
    const formInputs = document.querySelectorAll('.login-form input');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            const icon = this.previousElementSibling;
            icon.style.color = '#e91e63';
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                const icon = this.previousElementSibling;
                icon.style.color = '#aaa';
            }
        });
    });
    
    // Rastgele hareketli parçacıklar için ek animasyonlar
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        particle.style.animationDuration = `${10 + index * 2}s`;
    });
});