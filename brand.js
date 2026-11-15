(() => {
  const header = document.querySelector("header");
  if (!header) return;
  header.classList.add("site-header");
  const inner = header.firstElementChild;
  inner.className = "site-header-inner";
  const oldBrand = inner.firstElementChild;
  const brand = document.createElement("a");
  brand.className = "site-brand";
  brand.href = "index.html";
  brand.setAttribute("aria-label", "Fugenmeister GmbH – Startseite");
  brand.innerHTML =
    '<img src="assets/fugenmeister-logo-v2.svg" alt="" width="48" height="48"><span class="site-brand-name">Fugenmeister GmbH</span>';
  oldBrand.replaceWith(brand);
  const nav = inner.querySelector("nav");
  if (!nav) return;
  nav.id = "site-navigation";
  const button = document.createElement("button");
  button.className = "site-menu-button";
  button.type = "button";
  button.setAttribute("aria-label", "Navigation öffnen");
  button.setAttribute("aria-controls", nav.id);
  button.setAttribute("aria-expanded", "false");
  button.innerHTML =
    '<span class="material-symbols-outlined" aria-hidden="true">menu</span>';
  inner.append(button);
  const close = () => {
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Navigation öffnen");
    button.firstElementChild.textContent = "menu";
  };
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? "Navigation schließen" : "Navigation öffnen",
    );
    button.firstElementChild.textContent = open ? "close" : "menu";
  });
  nav.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) close();
  });
  document
    .querySelectorAll('footer img[alt*="Logo"],footer img[alt="Logo"]')
    .forEach((img) => {
      img.src = "assets/fugenmeister-logo-v2.svg";
      img.alt = "Fugenmeister GmbH";
      img.width = 48;
      img.height = 48;
    });

  document.querySelectorAll("a, button").forEach((control) => {
    if (
      !/offerte/i.test(control.textContent || "") ||
      control.classList.contains("site-quote")
    )
      return;
    if (control.tagName === "A") {
      control.href = "kontakt.html?type=quote#contactForm";
    } else {
      control.type = "button";
      control.addEventListener("click", () => {
        window.location.href = "kontakt.html?type=quote#contactForm";
      });
    }
  });
})();
