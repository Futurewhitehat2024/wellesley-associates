(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const items = document.querySelectorAll(".nav-item");

  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", document.body.classList.contains("nav-open"));
    });
  }

  items.forEach(function (item) {
    const button = item.querySelector(".nav-btn");
    if (!button) return;

    button.addEventListener("click", function (event) {
      if (window.matchMedia("(max-width: 980px)").matches) {
        const open = item.classList.contains("open");
        if (!open) {
          event.preventDefault();
          items.forEach(function (other) {
            other.classList.remove("open");
          });
          item.classList.add("open");
        }
      }
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".nav-item")) {
      items.forEach(function (item) {
        item.classList.remove("open");
      });
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      items.forEach(function (item) {
        item.classList.remove("open");
      });
      document.body.classList.remove("nav-open");
    }
  });

  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const params = new URLSearchParams(window.location.search);
  const productField = document.querySelector("[name='interest']");
  if (productField && params.get("product")) {
    const value = params.get("product");
    const match = Array.from(productField.options).find(function (option) {
      return option.value === value;
    });
    if (match) productField.value = value;
  }

  function isLoanSelection(select) {
    if (!select || !select.selectedOptions.length) return false;
    if (new URLSearchParams(window.location.search).get("type") === "loan" && !select.value) return true;
    const group = select.selectedOptions[0].parentElement;
    return group && group.tagName === "OPTGROUP" && /loan/i.test(group.label || "");
  }

  function syncQuoteLabels() {
    const loan = isLoanSelection(productField) || params.get("type") === "loan";
    const title = document.getElementById("quote-title");
    const lede = document.getElementById("quote-lede");
    const heading = document.getElementById("quote-heading");
    const submit = document.getElementById("quote-submit");
    if (!title && !heading && !submit) return;
    if (loan) {
      if (title) title.textContent = "Apply for financing.";
      if (lede) lede.textContent = "Tell us about the business or property. We will review the request and follow up with next steps.";
      if (heading) heading.textContent = "Apply Now";
      if (submit) submit.textContent = "Apply Now";
    } else {
      if (title) title.textContent = "Request a quote or financing review.";
      if (lede) lede.textContent = "Select the coverage or capital solution you have in mind. We will review the inquiry and follow up with next steps.";
      if (heading) heading.textContent = "Request a Quote";
      if (submit) submit.textContent = "Request a Quote";
    }
  }

  if (productField) {
    productField.addEventListener("change", syncQuoteLabels);
    syncQuoteLabels();
  }

  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const error = form.querySelector(".form-error");
      const required = form.querySelectorAll("[required]");
      let valid = true;

      required.forEach(function (field) {
        if (!String(field.value || "").trim()) valid = false;
      });

      const email = form.querySelector("[type='email']");
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
      }

      if (!valid) {
        if (error) error.textContent = "Please complete the required fields with a valid email address.";
        return;
      }

      if (error) error.textContent = "";
      form.classList.add("is-success");
      form.reset();
    });
  });
})();
