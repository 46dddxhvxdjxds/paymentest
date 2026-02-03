document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Simple animation for hamburger (optional text change or icon rotation)
            if (navLinks.classList.contains('active')) {
                hamburger.textContent = '✕'; // Close icon
            } else {
                hamburger.textContent = '☰'; // Menu icon
            }
        });
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.textContent = '☰';
        });
    });

    // Highlight active page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-levels a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Image Slider Logic
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const wrapper = document.querySelector('.slider-wrapper');

    // Function to move slides
    window.moveSlide = function (direction) {
        currentSlide += direction;

        if (currentSlide >= totalSlides) {
            currentSlide = 0;
        } else if (currentSlide < 0) {
            currentSlide = totalSlides - 1;
        }

        updateSlider();
    };

    function updateSlider() {
        if (wrapper) {
            wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    }

    // Auto Slide every 10 seconds
    setInterval(() => {
        moveSlide(1);
    }, 10000);

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    window.openLightbox = function (imgElement) {
        lightbox.style.display = "flex";
        lightboxImg.src = imgElement.src;
        document.body.style.overflow = "hidden"; // Disable scroll
    };

    window.closeLightbox = function () {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto"; // Enable scroll
    };

    // Checkout Modal Logic
    const checkoutModal = document.getElementById('checkoutModal');
    const modalProductDetails = document.getElementById('modalProductDetails');

    window.openCheckout = function (productName, price) {
        if (checkoutModal) {
            modalProductDetails.textContent = `Product: ${productName} | Price: ₹${price}`;
            checkoutModal.style.display = "flex";
            document.body.style.overflow = "hidden"; // Disable scroll
        }
    };

    window.closeCheckout = function () {
        if (checkoutModal) {
            checkoutModal.style.display = "none";
            document.body.style.overflow = "auto"; // Enable scroll
        }
    };

    // Close modal if clicked outside content
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            closeCheckout();
        }
    });

    // PhonePe Payment Logic
    window.initiatePayment = async function () {
        const name = document.getElementById('customerName').value;
        const mobile = document.getElementById('customerMobile').value;

        // We need to parse the price. The modal text is like "Product: Name | Price: ₹1"
        const modalText = document.getElementById('modalProductDetails').textContent;
        const price = parseInt(modalText.split('₹')[1]);

        if (!name || !mobile || mobile.length !== 10) {
            alert("Please enter a valid Name and 10-digit Mobile Number.");
            return;
        }

        try {
            const btn = document.querySelector('button[onclick="initiatePayment()"]');
            const originalText = btn.innerText;
            btn.innerText = "Processing...";
            btn.disabled = true;

            const response = await fetch('http://localhost:3000/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    mobile: mobile,
                    amount: price // Amount in INR
                })
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url; // Redirect to PhonePe
            } else {
                alert("Payment initiation failed. Please try again.");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        } catch (error) {
            console.error(error);
            alert("Server error. Ensure Node.js server is running on port 3000.");
            const btn = document.querySelector('button[onclick="initiatePayment()"]');
            if (btn) {
                btn.innerText = "Pay with PhonePe";
                btn.disabled = false;
            }
        }
    };
});
