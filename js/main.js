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

  const messageField = document.querySelector("[name='LEADCF1'], textarea[name='message']");
  if (messageField && !String(messageField.value || "").trim()) {
    const bits = [];
    ["vehicle", "vin", "year", "make", "model", "location", "zip", "amount", "purpose", "cash", "years"].forEach(function (key) {
      if (params.get(key)) bits.push(key + ": " + params.get(key));
    });
    try {
      const stored = sessionStorage.getItem("wellesleyVin");
      if (stored && !params.get("vin")) {
        const vin = JSON.parse(stored);
        bits.push("VIN: " + (vin.vin || ""));
        bits.push("Vehicle: " + [vin.year, vin.make, vin.model].filter(Boolean).join(" "));
      }
    } catch (err) {}
    if (bits.length) messageField.value = bits.join("\n");
  }

  function isLoanSelection(select) {
    if (!select || !select.selectedOptions.length) return false;
    if (new URLSearchParams(window.location.search).get("type") === "loan" && !select.value) return true;
    const group = select.selectedOptions[0].parentElement;
    return group && group.tagName === "OPTGROUP" && /loan|financ/i.test(group.label || "");
  }

  function syncQuoteLabels() {
    const loan = isLoanSelection(productField) || params.get("type") === "loan";
    const title = document.getElementById("started-title");
    const lede = document.getElementById("started-lede");
    const heading = document.getElementById("started-heading");
    const submit = document.getElementById("started-submit");
    if (!title && !heading && !submit) return;
    if (loan) {
      if (title) title.textContent = "Apply for financing.";
      if (lede) lede.textContent = "Tell us about the business or property. We will review the request and follow up.";
      if (heading) heading.textContent = "Apply Now";
      if (submit) submit.textContent = "Apply Now";
    } else {
      if (title) title.textContent = "Get started.";
      if (lede) lede.textContent = "Tell us what you need. We will review it and follow up with next steps.";
      if (heading) heading.textContent = "Get Started";
      if (submit) submit.textContent = "Get Started";
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
      const submitBtn = form.querySelector("[type='submit']");
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
      if (submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          return response.json().catch(function () {
            return { success: response.ok ? "true" : "false" };
          });
        })
        .then(function (data) {
          const ok = data && (data.success === true || data.success === "true");
          if (ok) {
            form.classList.add("is-success");
            form.reset();
            return;
          }
          throw new Error((data && data.message) || "submit failed");
        })
        .catch(function () {
          if (error) {
            error.textContent =
              "We could not send that just now. Please email rasheed@wellesleycollective.com or call 239-350-5227.";
          }
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });
})();
