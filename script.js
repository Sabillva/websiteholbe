let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const totalSlides = slides.length;

// Fonksiyon: Slaytı göster
function showSlide(index) {
  slides.forEach((slide) => {
    slide.style.display = "none";
  });
  slides[index].style.display = "flex";
}

// Fonksiyon: Sonraki slaytı göster
function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

// Fonksiyon: Carousel'i başlat
function startCarousel() {
  showSlide(currentSlide);
  setInterval(nextSlide, 3000);
}

// Fonksiyon: Menü görünümünü değiştir
function toggleMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
}

// Fonksiyon: Sosyal medya bağlantılarını ayarla
function setSocialMediaLinks(url, title, image) {
  document.querySelector(
    ".facebook"
  ).href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  document.querySelector(
    ".twitter"
  ).href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
  document.querySelector(
    ".pinterest"
  ).href = `https://pinterest.com/pin/create/button/?url=${url}&media=${image}&description=${title}`;
}

// Sayfa yüklendiğinde carousel'i başlat
window.onload = startCarousel;

document.addEventListener("DOMContentLoaded", () => {
  const controller = new ScrollMagic.Controller();

  // GSAP animasyonu
  const fadeInIcons = gsap.fromTo(
    ".icon-container",
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
  );

  // Feedback Form Submission
  document
    .getElementById("feedback-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("feedback-name").value;
      const emailInput = document.getElementById("feedback-email");
      let emailValue = emailInput.value.trim();

      if (!emailValue.endsWith("@gmail.com")) {
        emailValue += "@gmail.com";
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailValue)) {
        alert("Lütfen geçerli bir e-posta adresi girin.");
        return;
      }

      const feedbackData = {
        email: emailValue,
        name: name,
        rating: document.getElementById("rating").value,
        comments: document.getElementById("comments").value,
      };

      fetch("https://your-backend-endpoint.com/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          return response.json();
        })
        .then((data) => {
          alert("Feedback submitted successfully!");
          document.getElementById("feedback-form").reset();
        })
        .catch((error) => {
          alert("Bir hata oluştu: " + error.message);
          console.error("Error:", error);
        });
    });

  // Contact Form Submission
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email =
        document.getElementById("email").value.trim() + "@gmail.com";
      const message = document.getElementById("message").value;

      console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);

      alert("Your message has been sent successfully!");

      this.reset();
    });

  // Smooth scroll işlemleri
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      const offset = document.querySelector("header").offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  // Tooltip görünümleri
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const imageUrl = link.getAttribute("data-image");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip-image");
      tooltip.style.backgroundImage = `url(${imageUrl})`;
      link.appendChild(tooltip);
    });

    link.addEventListener("mouseleave", function () {
      const tooltip = link.querySelector(".tooltip-image");
      if (tooltip) {
        tooltip.remove();
      }
    });
  });

  // Lazy loading işlemleri
  let lazyImages = [].slice.call(document.querySelectorAll("img.lazyload"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazyload");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    let lazyLoadThrottleTimeout;
    function lazyLoad() {
      if (lazyLoadThrottleTimeout) {
        clearTimeout(lazyLoadThrottleTimeout);
      }

      lazyLoadThrottleTimeout = setTimeout(() => {
        let scrollTop = window.pageYOffset;
        lazyImages.forEach((img) => {
          if (img.offsetTop < window.innerHeight + scrollTop) {
            img.src = img.dataset.src;
            img.classList.remove("lazyload");
          }
        });
        if (lazyImages.length === 0) {
          document.removeEventListener("scroll", lazyLoad);
          window.removeEventListener("resize", lazyLoad);
          window.removeEventListener("orientationchange", lazyLoad);
        }
      }, 20);
    }

    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
  }

  // GSAP ve ScrollMagic animasyonu
  new ScrollMagic.Scene({
    triggerElement: ".specials-section",
    triggerHook: 0.8,
  })
    .setTween(fadeInIcons)
    .addTo(controller);
});
