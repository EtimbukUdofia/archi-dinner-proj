document.addEventListener('DOMContentLoaded', function() {
  // Observer for elements coming from the bottom-up
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  });

  // Observer for elements coming from the left-side
  const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show2');
      } else {
        entry.target.classList.remove('show2');
      }
    });
  });

  // Observer for elements coming from the right-side
  const observer3 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show3');
      } else {
        entry.target.classList.remove('show3');
      }
    });
  });

  // Initialize all observers
  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));

  const hiddenElements2 = document.querySelectorAll('.hidden2');
  hiddenElements2.forEach((el) => observer2.observe(el));

  const hiddenElements3 = document.querySelectorAll('.hidden3');
  hiddenElements3.forEach((el) => observer3.observe(el));

  // Form submission handling (kept as it's not animation-related)
  const form = document.getElementById("paymentForm");
  if (!form) return;

  // Create loading overlay
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.innerHTML = `
    <div class="luxury-spinner">
      <div class="ring"></div>
      <div class="ring"></div>
      <div class="ring"></div>
    </div>
    <div class="loading-text">
      <span>P</span><span>R</span><span>O</span><span>C</span><span>E</span><span>S</span><span>S</span><span>I</span><span>N</span><span>G</span>
    </div>
  `;
  document.body.appendChild(loadingOverlay);

  const amount = 2000;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    loadingOverlay.classList.add("active");
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;

    try {
      const response = await fetch(
        "http://localhost:5000/api/v0/payment/initialize-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, amount, firstName, lastName, phone }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
      loadingOverlay.classList.remove("active");
    } catch (error) {
      loadingOverlay.classList.remove("active");
      console.error("Submission error:", error);
      alert("There was an error submitting your form. Please try again.");
    }
  });
});