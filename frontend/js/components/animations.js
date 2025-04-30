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

  // Form submission handling
  const form = document.getElementById("paymentForm");
  if (!form) return;

  //  loading overlay
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


  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Show loading overlay and disable form
    loadingOverlay.classList.add("active");
    form.style.pointerEvents = "none";
    form.style.opacity = "0.5";
    
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phone").value;
    const department = document.getElementById("department").value;

    try {
      const response = await fetch(
        "https://archi-dinner-proj.onrender.com/api/v0/payment/initialize-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            firstName,
            lastName,
            phone,
            department,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.authorization_url) {
        // Keep overlay visible during redirect
        window.location.href = result.authorization_url;
        
        // Fallback in case redirect fails
        setTimeout(() => {
          loadingOverlay.classList.remove("active");
          form.style.pointerEvents = "auto";
          form.style.opacity = "1";
        }, 10000); 
      } else {
        throw new Error("No authorization URL received");
      }
      
    } catch (error) {
      loadingOverlay.classList.remove("active");
      form.style.pointerEvents = "auto";
      form.style.opacity = "1";
      
      console.error("Submission error:", error);
      alert("There was an error submitting your form. Please try again.");
    }
  });

  
  window.addEventListener('beforeunload', () => {
    loadingOverlay.classList.add("active");
  });
});