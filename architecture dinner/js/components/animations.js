document.addEventListener('DOMContentLoaded', function() {
  // Animate header elements
  const contentHeader = document.querySelector(".contentHeader");
  if (contentHeader) {
    const p = contentHeader.querySelector("p");
    const h1 = contentHeader.querySelector("h1");

    p.style.opacity = "0";
    h1.style.opacity = "0";

    // Animate header with delays
    setTimeout(() => {
      p.classList.add("animate-fadeInLeft");
      p.style.opacity = "1";
    }, 300);

    setTimeout(() => {
      h1.classList.add("animate-fadeInRight");
      h1.style.opacity = "1";
    }, 600);
  }

  // Animate form inputs
  const inputs = document.querySelectorAll("input");
  const button = document.querySelector("#formSubmission");

  inputs.forEach((input, index) => {
    input.style.opacity = "0";

    // Alternate animation directions for visual interest
    let animationClass =
      index % 2 === 0 ? "animate-fadeInLeft" : "animate-fadeInRight";

    setTimeout(() => {
      input.classList.add(animationClass);
      input.classList.add(`delay-${index}`);
      input.style.opacity = "1";
    }, 800 + index * 150);
  });

  // Animate button (comes up from bottom)
  if (button) {
    setTimeout(() => {
      button.style.opacity = "0";
      button.classList.add("animate-fadeInUp");
      button.classList.add("delay-5");
      button.style.opacity = "1";
    }, 800 + inputs.length * 150);
  }

  //for my form submission and loading

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

  // Prepare form data
  
  const amount = 2000;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Show loading overlay
    loadingOverlay.classList.add("active");
    const email = document.getElementById("email").value;

    try {
      const response = await fetch(
        "http://localhost:5000/api/v0/payment/initialize-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, amount }),
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
      // Success handling
      loadingOverlay.classList.remove("active");

      // Show success message (customize this)
      // alert("Submission successful! Thank you.");
      // form.reset();

      // Optional: redirect or other success actions
      // window.location.href = 'success-page.html'; (wanted to add this path but i figured youd do that from the backend where its more secure)
    } catch (error) {
      // Error handling
      loadingOverlay.classList.remove("active");
      console.error("Submission error:", error);

      // i create dthis for the error message...might customize this
      alert("There was an error submitting your form. Please try again.");
    }
  });
});