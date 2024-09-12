let currentSlide = 0;
const slides = document.querySelectorAll(".carousel-slide");
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });
  slides[index].classList.add("active");
}


function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function startCarousel() {
  showSlide(currentSlide);
  setInterval(nextSlide, 3000);
}


function toggleMenu() {
  const sidebarMenu = document.querySelector(".sidebar-menu");
  const mainContent = document.querySelector(".content");
  sidebarMenu.classList.toggle("active");
  mainContent.classList.toggle("content-shift");

}

function closeSidebar() {
  const sidebarMenu = document.querySelector(".sidebar-menu");
  const mainContent = document.querySelector(".content");
  sidebarMenu.classList.remove("active");
  mainContent.classList.remove("content-shift");
}

function handleResize() {
  const sidebarMenu = document.querySelector(".sidebar-menu");
  const screenWidth = window.innerWidth;
  const thresholdWidth = 900; // Sidebar kapanması için minimum genişlik

  if (sidebarMenu.classList.contains("active") && screenWidth >= thresholdWidth) {
    closeSidebar();
  }
}

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

window.onload = function () {
  startCarousel();
  document
    .querySelector(".hamburger-menu")
    .addEventListener("click", toggleMenu);
  document.querySelector(".close-menu").addEventListener("click", closeSidebar);
  window.addEventListener("resize", handleResize);
};

document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.querySelector(".search-bar");

  searchBar.addEventListener("focus", () => {
    if (searchBar.value === "") {
      searchBar.classList.add("focused");
    }
  });

  searchBar.addEventListener("blur", () => {
    if (searchBar.value === "") {
      searchBar.classList.remove("focused");
    }
  });

  const controller = new ScrollMagic.Controller();
  const fadeInIcons = gsap.fromTo(
    ".icon-container",
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
  );

  document
    .getElementById("feedback-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("feedback-name").value;
      const emailInput = document.getElementById("feedback-email");
      let emailValue = emailInput.value.trim();
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
          alert("An error occurred: " + error.message);
          console.error("Error:", error);
        });
    });

  document
    .getElementById("contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value;
      console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
      alert("Your message has been sent successfully!");
      this.reset();
    });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      const offset = document.querySelector(".header").offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("mouseenter", function () {
      const imageUrl = link.getAttribute("data-image");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip-image");
      tooltip.style.backgroundImage = `url(${imageUrl})`;
      tooltip.style.backgroundColor = `green`;
      link.appendChild(tooltip);
    });

    link.addEventListener("mouseleave", function () {
      const tooltip = link.querySelector(".tooltip-image");
      if (tooltip) {
        tooltip.remove();
      }
    });
  });

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

  new ScrollMagic.Scene({
    triggerElement: ".specials-section",
    triggerHook: 0.8,
  })
    .setTween(fadeInIcons)
    .addTo(controller);

  document
    .querySelector(".hamburger-menu")
    .addEventListener("click", toggleMenu);
  document.querySelector(".close-menu").addEventListener("click", closeSidebar);
});
