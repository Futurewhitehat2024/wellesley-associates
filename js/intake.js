(function () {
  const form = document.querySelector("[data-intake]");
  if (!form) return;

  const kind = form.getAttribute("data-intake");
  const status = form.querySelector("[data-intake-status]");
  const success = form.querySelector("[data-intake-success]");
  const submitBtn = form.querySelector("[type='submit']");
  const fileInput = form.querySelector("[name='files']");
  const fileList = form.querySelector("[data-file-list]");
  const FIRM_EMAIL = "rasheed@wellesleycollective.com";
  const MAX_FILES = 5;
  const MAX_SIZE = 8 * 1024 * 1024;

  const ZOHO = {
    xnQsjsdp: "ca72deb9a1f2165ae076ea75e087aa77b5bebfe4d1241f31874b8ab4ec4506e6",
    xmIwtLD:
      "f4cbde8547881053a3d0b2b561174373edf6c61bae75cb2722949f4dca9f2409d4efef19c7c6d1addf6b816c7d47ceaf",
    actionType: "TGVhZHM=",
  };

  function setNote(text, kindName) {
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("is-error", kindName === "error");
    status.classList.toggle("is-live", kindName === "live");
  }

  function splitName(full) {
    const parts = String(full || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return { first: "", last: "" };
    if (parts.length === 1) return { first: parts[0], last: parts[0] };
    return { first: parts[0], last: parts.slice(1).join(" ") };
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function fieldValue(name) {
    const el = form.elements[name];
    if (!el) return "";
    if (el instanceof RadioNodeList || (el.length && el[0] && el[0].type === "checkbox")) {
      return Array.from(form.querySelectorAll("[name='" + name + "']:checked"))
        .map(function (box) {
          return box.value;
        })
        .join(", ");
    }
    return String(el.value || "").trim();
  }

  function compileDetails() {
    const skip = {
      name: true,
      email: true,
      files: true,
      firstName: true,
      lastName: true,
      _honey: true,
    };
    const lines = ["Intake: " + (kind === "commercial" ? "Commercial lines" : "Personal lines")];
    Array.from(form.elements).forEach(function (el) {
      if (!el.name || skip[el.name] || el.type === "file" || el.type === "submit") return;
      if (el.type === "checkbox" && !el.checked) return;
      if (el.type === "checkbox") {
        if (lines[lines.length - 1] && lines[lines.length - 1].indexOf(el.name + ":") === 0) return;
        const values = fieldValue(el.name);
        if (values) lines.push(el.name + ": " + values);
        return;
      }
      const value = String(el.value || "").trim();
      if (value) lines.push(el.name + ": " + value);
    });
    const files = fileInput && fileInput.files ? Array.from(fileInput.files) : [];
    if (files.length) {
      lines.push("files: " + files.map(function (f) { return f.name; }).join(", "));
    }
    return lines.join("\n");
  }

  function mapState(value) {
    if (value === "FL" || value === "CO" || value === "TX" || value === "PA") return value;
    if (!value) return "";
    return "Other";
  }

  function listFiles() {
    if (!fileList || !fileInput) return;
    const files = Array.from(fileInput.files || []);
    fileList.innerHTML = files
      .map(function (f) {
        return "<li>" + f.name + " (" + Math.round(f.size / 1024) + " KB)</li>";
      })
      .join("");
  }

  function preselectCoverages() {
    const params = new URLSearchParams(window.location.search);
    const wanted = [params.get("coverage"), params.get("product")].filter(Boolean);
    if (!wanted.length) return;
    form.querySelectorAll("[name='coverages']").forEach(function (box) {
      const slug = String(box.getAttribute("data-slug") || "").toLowerCase();
      const val = String(box.value || "").toLowerCase();
      wanted.forEach(function (item) {
        const raw = String(item).toLowerCase();
        const spaced = raw.replace(/-/g, " ");
        if (val === raw || val === spaced || slug === raw || slug === spaced) box.checked = true;
      });
    });
  }
  preselectCoverages();

  function prefillFromQuery() {
    const params = new URLSearchParams(window.location.search);
    ["company", "state", "property_address", "zip", "entity_type", "years_in_business", "name", "vins"].forEach(function (key) {
      const value = params.get(key);
      const el = form.elements[key];
      if (value && el && !String(el.value || "").trim()) el.value = value;
    });
    if (form.elements.vins && !String(form.elements.vins.value || "").trim()) {
      try {
        const stored = sessionStorage.getItem("wellesleyVin");
        if (stored) {
          const vin = JSON.parse(stored);
          form.elements.vins.value = [vin.vin, vin.year, vin.make, vin.model].filter(Boolean).join(" ");
        }
      } catch (err) {}
    }
  }
  prefillFromQuery();

  if (fileInput) {
    fileInput.addEventListener("change", function () {
      const files = Array.from(fileInput.files || []);
      const tooBig = files.filter(function (f) {
        return f.size > MAX_SIZE;
      });
      if (files.length > MAX_FILES) {
        setNote("You can attach up to " + MAX_FILES + " files.", "error");
        fileInput.value = "";
        listFiles();
        return;
      }
      if (tooBig.length) {
        setNote("Each file must be under 8 MB. Remove " + tooBig[0].name + ".", "error");
        fileInput.value = "";
        listFiles();
        return;
      }
      setNote(files.length ? files.length + " file(s) ready." : "");
      listFiles();
    });
  }

  function buildZohoData(files) {
    const name = splitName(fieldValue("name"));
    const company =
      fieldValue("company") || (kind === "commercial" ? "Commercial inquiry" : "Household");
    const data = new FormData();
    data.append("xnQsjsdp", ZOHO.xnQsjsdp);
    data.append("xmIwtLD", ZOHO.xmIwtLD);
    data.append("actionType", ZOHO.actionType);
    data.append("returnURL", "null");
    data.append("zc_gad", "");
    data.append("aG9uZXlwb3Q", "");
    data.append("Lead Source", "Website");
    data.append("First Name", name.first);
    data.append("Last Name", name.last);
    data.append("Email", fieldValue("email"));
    data.append("Phone", fieldValue("phone"));
    data.append("Company", company);
    data.append("LEADCF2", kind === "commercial" ? "Commercial Insurance" : "Personal Insurance");
    data.append("LEADCF3", mapState(fieldValue("state")));
    data.append("LEADCF1", compileDetails());
    files.forEach(function (file, index) {
      if (index === 0) data.append("theFile", file, file.name);
      data.append("file" + index, file, file.name);
    });
    return data;
  }

  function buildMailData(files) {
    const data = new FormData();
    data.append("_subject", "Wellesley intake — " + (kind === "commercial" ? "commercial" : "personal") + " — " + fieldValue("name"));
    data.append("_captcha", "false");
    data.append("_template", "table");
    data.append("name", fieldValue("name"));
    data.append("email", fieldValue("email"));
    data.append("phone", fieldValue("phone"));
    data.append("details", compileDetails());
    files.forEach(function (file, index) {
      data.append("attachment" + (index + 1), file, file.name);
    });
    return data;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (fieldValue("_honey")) {
      form.hidden = true;
      if (success) success.hidden = false;
      return;
    }
    const name = fieldValue("name");
    const email = fieldValue("email");
    if (!name || !validEmail(email)) {
      setNote("Name and a valid email are the only required fields.", "error");
      return;
    }
    const files = fileInput ? Array.from(fileInput.files || []) : [];
    if (submitBtn) submitBtn.disabled = true;
    setNote("Sending to Wellesley Collective…");
    try {
      // Zoho web-to-lead does not send CORS headers. no-cors still delivers the POST.
      await fetch("https://crm.zoho.com/crm/WebToLeadForm", {
        method: "POST",
        body: buildZohoData(files),
        mode: "no-cors",
        cache: "no-cache",
      });
      if (files.length) {
        try {
          await fetch("https://formsubmit.co/ajax/" + FIRM_EMAIL, {
            method: "POST",
            body: buildMailData(files),
          });
        } catch (err) {}
      }
      form.hidden = true;
      if (success) success.hidden = false;
    } catch (err) {
      setNote("We could not send that just now. Email " + FIRM_EMAIL + " or call 239-350-5227.", "error");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
