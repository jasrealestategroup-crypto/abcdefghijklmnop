document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Form submission handler
    const worthForm = document.getElementById('worth-form');
    if (worthForm) {
        worthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Anti-spam rate limiting: 5 minute cooldown check using local storage
            const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
            const lastSubmit = localStorage.getItem('lastWorthFormSubmit');
            if (lastSubmit) {
                const timePassed = Date.now() - parseInt(lastSubmit, 10);
                if (timePassed < COOLDOWN_TIME) {
                    const remainingSeconds = Math.ceil((COOLDOWN_TIME - timePassed) / 1000);
                    const remainingMinutes = Math.ceil(remainingSeconds / 60);
                    alert(`To prevent spam, please wait ${remainingMinutes} more minute(s) before submitting another request.`);
                    return;
                }
            }
            
            const submitBtn = worthForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(worthForm);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    // Record submission timestamp on success
                    localStorage.setItem('lastWorthFormSubmit', Date.now().toString());
                    alert('Thank you! Your property evaluation request has been sent successfully to Jas Randhawa.');
                    worthForm.reset();
                } else {
                    console.log(response);
                    alert(json.message || 'Something went wrong. Please try again.');
                }
            })
            .catch(error => {
                console.log(error);
                alert('Form submission failed. Please check your connection and try again.');
            })
            .then(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
});
