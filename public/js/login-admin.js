document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        window.location.href = "/dashboard"; 
      } else {
        document.getElementById("error-message").textContent =
          result.message || "Login failed";
      }
    } catch (error) {
      document.getElementById("error-message").textContent =
        "An error occurred";
    }
  });
