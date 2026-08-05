(() => {
  const form = document.querySelector("#contactForm");
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const requestType = form.querySelector("#requestType");
  const heading = document.querySelector("#contactFormHeading");
  const isQuote = params.get("type") === "quote";
  if (isQuote) {
    requestType.value = "Kostenlose Offerte";
    heading.textContent = "Kostenlose Offerte anfordern";
  }

  const submittedAt = form.querySelector("#submittedAt");
  submittedAt.value = String(Date.now());
  const status = form.querySelector("#formStatus");
  const button = form.querySelector('button[type="submit"]');
  const buttonText = button.querySelector("[data-submit-label]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status is-loading";
    status.textContent = "Ihre Anfrage wird gesendet …";
    button.disabled = true;
    buttonText.textContent = "Wird gesendet …";

    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(result.error || "Senden fehlgeschlagen.");

      form.reset();
      requestType.value = isQuote ? "Kostenlose Offerte" : "Kontaktanfrage";
      submittedAt.value = String(Date.now());
      status.className = "form-status is-success";
      status.textContent =
        "Vielen Dank. Ihre Anfrage wurde erfolgreich gesendet.";
    } catch (error) {
      status.className = "form-status is-error";
      status.textContent = error.message;
    } finally {
      button.disabled = false;
      buttonText.textContent = isQuote ? "Offerte anfordern" : "Anfrage senden";
      status.focus();
    }
  });
})();
