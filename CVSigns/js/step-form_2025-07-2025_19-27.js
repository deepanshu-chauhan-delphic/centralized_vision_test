document.addEventListener("DOMContentLoaded", function () {
  const form = $("#multiStepForm");
  const steps = $(".form-step");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const submitBtn = $("#submitBtn");
  const printBtn = $("#printBtn");
  const pdfBtn = $("#pdfBtn");
  const cancelBtn = $("#cancelBtn");
  const stepIndicators = $(".banner-step-col");

  let currentStep = 0;

  // Initialize form
  showStep(currentStep);

  $(".btn-yes").on("click", function (e) {
    e.preventDefault();
    $(".hideable-cont").hide();
    $(".showable-cont").show();
  });

  $('.btn-guard-no').on('click', function (e) {
    e.preventDefault();
    $('.hideable-cont').hide();
    $(".showable-cont").show();
    currentStep = 1;
    showStep(currentStep);
  });

  $(".btn-greeter-yes").on("click", function (e) {
    e.preventDefault();
    $(".hideable-greeter-cont").hide();
    $(".showable-cont").show();
    currentStep = 1;
    showStep(currentStep);
  });

  // No button for Virtual Greeter - skip to Shipping Info
  $('.btn-greeter-no').on('click', function (e) {
    e.preventDefault();
    $('.hideable-greeter-cont').hide();
    $(".showable-cont").show();
    currentStep = 2; // Skip to Shipping Info step
    showStep(currentStep);
  });

  // Skip from Virtual Guard to Virtual Greeter
  $(".form-step:eq(0) a[href='#']").on("click", function (e) {
    e.preventDefault();
    currentStep = 1;
    showStep(currentStep);
  });

  // Skip from Virtual Greeter to Shipping Info
  $(".form-step:eq(1) a[href='#']").on("click", function (e) {
    e.preventDefault();
    currentStep = 2;
    showStep(currentStep);
  });

  // Next button click handler
  nextBtn.on("click", (e) => {
    e.preventDefault();
    if (currentStep === 0 && validateCurrentStep()) {
      // Instead of showing/hiding containers, just go to next step
      currentStep++;
      showStep(currentStep);
      return;
    }

    if (validateCurrentStep()) {
      currentStep++;
      showStep(currentStep);
    }
  });

  // Previous button click handler
  prevBtn.on("click", (e) => {
    e.preventDefault();
    currentStep--;
    showStep(currentStep);
  });

  // Submit button click handler
  submitBtn.on("click", (e) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      submitForm();
    }
  });

  // Cancel button click handler
  cancelBtn.on("click", (e) => {
    e.preventDefault();
    if (
      confirm("Are you sure you want to cancel? All entered data will be lost.")
    ) {
      form[0].reset();
      form.validate().resetForm();
      currentStep = 0;
      showStep(currentStep);
    }
  });

  // Show step function
  function showStep(step) {
    // Update step indicators
    stepIndicators.each(function (i) {
      $(this).toggleClass("active", i === step);
    });

    // Show/hide form steps
    steps.each(function (i) {
      $(this).toggleClass("active", i === step);
    });

    // Update button visibility
    const isFirstStep = step === 0;
    const isLastStep = step === steps.length - 1;
    const isSecondLastStep = step === steps.length - 2;

    prevBtn.css("display", isFirstStep || isLastStep ? "none" : "inline-block");
    nextBtn.css("display", isLastStep || isSecondLastStep ? "none" : "inline-block");
    submitBtn.css("display", isSecondLastStep ? "inline-block" : "none");
    printBtn.css("display", isSecondLastStep ? "inline-block" : "none");
    pdfBtn.css("display", isSecondLastStep ? "inline-block" : "none");
    cancelBtn.css("display", isLastStep ? "none" : "inline-block");

    // Scroll to top of form
    form[0].scrollIntoView({ behavior: "smooth", block: "start" });

    if (step === 1) {
      $('input[name="greeter_price[]"]').val('0.00');
      const previousTotal = calculateTotalPrice();

      const guardTotal = calculateTotalPrice().guardTotal;
      $(".price-banner-item-col span")
        .eq(0).text("$" + guardTotal.toFixed(2))
        .end()
        .eq(1).text("$90.00");
    } else {
      updateTotalDisplay();
    }
  }


  // Initialize form validation
  form.validate({
    errorElement: "div",
    errorClass: "invalid-feedback",
    highlight: function (element, errorClass) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function (element, errorClass) {
      $(element).removeClass("is-invalid").addClass("is-valid");
    },
    errorPlacement: function (error, element) {
      if (element.attr("type") === "file") {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
    rules: {
      email: {
        required: true,
        email: true,
      },
      phone: {
        required: true,
        minlength: 10,
      },
      zip_code: {
        required: true,
        minlength: 5,
      },
    },
    messages: {
      email: {
        required: "Please enter your email address",
        email: "Please enter a valid email address",
      },
      phone: {
        required: "Please enter your phone number",
        minlength: "Phone number must be at least 10 characters",
      },
      zip_code: {
        required: "Please enter your zip code",
        minlength: "Zip code must be at least 5 characters",
      },
    },
    ignore:
      ":hidden:not(.form-step.active input, .form-step.active select, .form-step.active textarea)",
  });

  // Add validation rules for dynamic fields
  function addValidationRules(container) {
    // Keep required rules only for greeter signs.
    const type = container.attr("data-type");
    if (type === "greeter") {
      container.find('input[type="number"]').each(function () {
        $(this).rules("add", {
          required: true,
          messages: {
            required: "This field is required",
          },
        });
      });

      container.find("select").each(function () {
        $(this).rules("add", {
          required: true,
          messages: {
            required: "This field is required",
          },
        });
      });
    }
  }

  // Handle dynamic sign addition
  $(".add-sing").each(function () {
    $(this).on("click", function () {
      const wrapper = $(this).closest(".sign-wrapper");
      const original = wrapper.find(".form-col-duplicate").first();
      const clone = original.clone(true);

      // Clear inputs in clone and reset validation
      clone.find("input, select").each(function () {
        $(this)
          .val("")
          .removeClass("is-invalid is-valid")
          .removeAttr("aria-invalid")
          .next(".invalid-feedback")
          .remove();
      });

      const oldRemove = clone.find(".remove-btn");
      if (oldRemove.length) oldRemove.remove();

      // Create and append remove button
      const removeBtn = $("<button>")
        .attr({
          type: "button",
          class: "remove-btn",
        })
        .text("")
        .on("click", function () {
          clone.remove();
          form.validate().resetForm();
        });

      clone.append(removeBtn);
      clone.insertBefore($(this));

      // Add validation rules to cloned fields
      addValidationRules(clone);

      // Add price calculation event listeners to cloned row
      const quantityInput = clone.find('input[name$="_quantity[]"]');
      const sizeSelect = clone.find('select[name$="_size[]"]');

      quantityInput.on("keyup", function () {
        updatePrice(clone);
      });

      sizeSelect.on("change", function () {
        updatePrice(clone);
      });
    });
  });

  // Initialize validation for existing fields
  addValidationRules(form);

  // Drag and drop for file upload
  const dropArea = $("#drop-area");
  let fileInput = $("#logo_upload");
  let selectedLogoFile = null;

  function setSelectedLogoFile(file) {
    selectedLogoFile = file || null;
    window.selectedLogoFile = selectedLogoFile;
  }

  function refreshFileInputRef() {
    fileInput = $("#logo_upload");
    return fileInput;
  }

  function appendLogoUploadIfPresent(formData) {
    const currentFileInput = refreshFileInputRef();
    const fileFromInput =
      currentFileInput.length && currentFileInput[0].files.length > 0
        ? currentFileInput[0].files[0]
        : null;
    const fileToUpload = fileFromInput || selectedLogoFile;
    if (fileToUpload) {
      formData.append("logo_upload", fileToUpload);
    }
  }

  if (dropArea.length && refreshFileInputRef().length) {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.on(eventName, preventDefaults);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach((eventName) => {
      dropArea.on(eventName, highlight);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropArea.on(eventName, unhighlight);
    });

    function highlight() {
      dropArea.addClass("highlight");
    }

    function unhighlight() {
      dropArea.removeClass("highlight");
    }

    dropArea.on("drop", handleDrop);

    function handleDrop(e) {
      const dt = e.originalEvent.dataTransfer;
      const files = dt.files;
      const currentFileInput = refreshFileInputRef();
      if (currentFileInput.length) {
        currentFileInput[0].files = files;
      }
      handleFiles(files);
    }

    function bindFileInputChange() {
      const currentFileInput = refreshFileInputRef();
      currentFileInput.off("change.logoUpload").on("change.logoUpload", function () {
        handleFiles(this.files);
      });
    }

    bindFileInputChange();

    function handleFiles(files) {
      if (files.length) {
        const file = files[0];

        if (file.type.match("image.*")) {
          setSelectedLogoFile(file);
          const reader = new FileReader();
          reader.onload = function (e) {
            dropArea.html(`
              <div class="uploaded-file">
                <strong>${file.name}</strong> (${(file.size / 1024).toFixed(
              2
            )} KB)
                <button type="button" class="remove-file" title="Remove file">×</button>
              </div>
            `);

            // Add event listener for remove button
            dropArea.find(".remove-file").on("click", function () {
              setSelectedLogoFile(null);
              const currentFileInput = refreshFileInputRef();
              if (currentFileInput.length) {
                currentFileInput.val("");
              }
              dropArea.html(`
                <label for="logo_upload">
                  <strong>📎 Add file</strong> or drop it right here
                </label>
                <small>File must be in JPG or PNG format</small>
                <input type="file" name="logo_upload" id="logo_upload" accept=".jpg,.jpeg,.png" />
              `);
              // Reinitialize the drop area events
              initDropArea();

              bindFileInputChange();
            });
          };
          reader.readAsDataURL(file);
        } else {
          setSelectedLogoFile(null);
          showAlert("Please upload an image file (JPG/PNG)", "error");
          const currentFileInput = refreshFileInputRef();
          if (currentFileInput.length) {
            currentFileInput.val("");
          }
        }
      } else {
        setSelectedLogoFile(null);
      }
    }

    // Reinitialize drop area events after file removal
    function initDropArea() {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.on(eventName, preventDefaults);
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.on(eventName, highlight);
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.on(eventName, unhighlight);
      });

      dropArea.on("drop", handleDrop);
    }
  }

  pdfBtn.on("click", (e) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      const formData = new FormData(form[0]);
      formData.append("action", "generate-pdf");
      appendLogoUploadIfPresent(formData);

      // Show loading state
      pdfBtn.prop("disabled", true);
      pdfBtn.html(
        '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...'
      );

      fetch(form.attr("action"), {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            // Convert base64 to blob and download
            const byteCharacters = atob(data.pdf_data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "application/pdf" });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "order-summary.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showAlert("PDF generated and email sent successfully!", "success");
            form[0].reset();
            form.validate().resetForm();
            currentStep++;
            showStep(currentStep);
          } else {
            showAlert("Error: " + data.message, "error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showAlert("An error occurred while generating the PDF.", "error");
        })
        .finally(() => {
          pdfBtn.prop("disabled", false);
          pdfBtn.html("Generate PDF");
        });
    }
  });

  printBtn.on("click", (e) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      const formData = new FormData(form[0]);
      formData.append("action", "print");
      appendLogoUploadIfPresent(formData);

      // Show loading state
      printBtn.prop("disabled", true);
      printBtn.html('<i class="fa-solid fa-spinner fa-spin"></i> Loading...');

      fetch(form.attr("action"), {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((html) => {
          // Open new window with the HTML content
          const printWindow = window.open("", "_blank", "width=800,height=600");
          printWindow.document.write(html);
          printWindow.document.close();

          // Wait for content to load then print
          printWindow.onload = function () {
            printWindow.print();
            printWindow.close();
          };
        })
        .catch((error) => {
          console.error("Error:", error);
          showAlert("An error occurred while loading the print view.", "error");
        })
        .finally(() => {
          printBtn.prop("disabled", false);
          printBtn.html("Print");
        });
    }
  });

  // Form submission handler
  function submitForm() {
    const formData = new FormData(form[0]);
    formData.append("action", "submit");
    appendLogoUploadIfPresent(formData);

    // Show loading state
    submitBtn.prop("disabled", true);
    submitBtn.html('<i class="fa-solid fa-spinner fa-spin"></i> Processing...');

    fetch(form.attr("action"), {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          form[0].reset();
          form.validate().resetForm();
          currentStep++;
          showStep(currentStep);
        } else {
          showAlert("Error: " + data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showAlert("An error occurred while submitting the form.", "error");
      })
      .finally(() => {
        submitBtn.prop("disabled", false);
        submitBtn.html("Submit");
      });
  }

  function clearGuardFieldError(field) {
    field.removeClass("is-invalid");
    field.nextAll(".invalid-feedback.guard-validation").first().remove();
  }

  function setGuardFieldError(field, message) {
    field.addClass("is-invalid").removeClass("is-valid");
    let error = field.nextAll(".invalid-feedback.guard-validation").first();
    if (!error.length) {
      error = $('<div class="invalid-feedback guard-validation"></div>');
      error.insertAfter(field);
    }
    error.text(message);
  }

  function validateGuardStep(currentStepEl) {
    const guardTypes = [
      {
        qty: 'input[name="aluminum_quantity[]"]',
        color: 'select[name="aluminum_color[]"]',
        size: 'select[name="aluminum_size[]"]',
      },
      {
        qty: 'input[name="decal_quantity[]"]',
        color: 'select[name="decal_color[]"]',
        size: 'select[name="decal_size[]"]',
      },
      {
        qty: 'input[name="sticker_quantity[]"]',
        color: 'select[name="sticker_color[]"]',
        size: 'select[name="sticker_size[]"]',
      },
    ];

    let hasOrderedType = false;
    let isValid = true;

    guardTypes.forEach((type) => {
      currentStepEl.find(type.qty).each(function () {
        const qtyField = $(this);
        const row = qtyField.closest(".form-col-duplicate");
        const colorField = row.find(type.color).first();
        const sizeField = row.find(type.size).first();
        const qtyRaw = (qtyField.val() || "").trim();
        const qty = Number.parseInt(qtyRaw, 10);
        const hasColor = Boolean(colorField.val());
        const hasSize = Boolean(sizeField.val());
        const hasDetails = hasColor || hasSize;

        clearGuardFieldError(qtyField);
        clearGuardFieldError(colorField);
        clearGuardFieldError(sizeField);

        if (!Number.isNaN(qty) && qty > 0) {
          hasOrderedType = true;

          if (!hasColor) {
            setGuardFieldError(colorField, "Select a color for this item.");
            isValid = false;
          }
          if (!hasSize) {
            setGuardFieldError(sizeField, "Select a size for this item.");
            isValid = false;
          }
          return;
        }

        if (hasDetails) {
          setGuardFieldError(qtyField, "Enter quantity greater than 0 for this item.");
          isValid = false;
        }
      });
    });

    if (!hasOrderedType) {
      const firstQtyField = currentStepEl
        .find(
          'input[name="aluminum_quantity[]"], input[name="decal_quantity[]"], input[name="sticker_quantity[]"]'
        )
        .first();

      if (firstQtyField.length) {
        setGuardFieldError(
          firstQtyField,
          "Enter quantity for at least one product type."
        );
        firstQtyField.focus();
      }

      showAlert(
        "Please enter quantity for Aluminum Signs, Window Decals, or Sticker Signs.",
        "error"
      );
      isValid = false;
    }

    return isValid;
  }

  // Validate current step
  function validateCurrentStep() {
    const currentStepEl = steps.eq(currentStep);
    let isValid = true;

    if (currentStep === 0) {
      isValid = validateGuardStep(currentStepEl);
    } else {
      // Validate each input in the current step
      currentStepEl.find("input, select, textarea").each(function () {
        const element = $(this);
        if (!element.valid()) {
          isValid = false;
        }
      });
    }

    if (!isValid) {
      // Focus on first invalid input
      const firstInvalid = currentStepEl.find(".is-invalid").first();
      if (firstInvalid.length) {
        firstInvalid.focus();
      }
    }

    return isValid;
  }

  // Show alert message
  function showAlert(message, type = "success") {
    Swal.fire({
      text: message,
      icon: type,
      timer: 5000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  }

  // Price calculation function
  function calculatePrice(type, size, quantity) {
    const prices = {
      aluminum: {
        "12x10.5": 15,
        "24x20.5": 30,
      },
      decal: {
        8: 5,
      },
      sticker: {
        8: 5,
      },
      greeter: {
        "8x10": 45,
      },
    };

    if (prices[type] && prices[type][size] !== undefined) {
      if (type === 'decal' || type === 'sticker') {
        if (quantity <= 2) {
          return 0;
        } else {
          return prices[type][size] * (quantity - 2);
        }
      } else {
        return prices[type][size] * quantity;
      }
    }

    return 0;
  }

  // Function to update price for a single row
  function updatePrice(row) {
    const type = row
      .closest(".sign-wrapper")
      .find(".form-col-duplicate")
      .first()
      .attr("data-type");
    const sizeSelect = row.find('select[name$="_size[]"]');
    const quantityInput = row.find('input[name$="_quantity[]"]');
    const priceInput = row.find('input[name$="_price[]"]');

    if (sizeSelect.length && quantityInput.length && priceInput.length) {
      const size = sizeSelect.val();
      const quantity = parseInt(quantityInput.val()) || 0;
      const price = calculatePrice(type, size, quantity);
      priceInput.val(price.toFixed(2));
      updateTotalDisplay();
    }
  }

  // Initialize price calculations for existing and new rows
  function initializePriceCalculations() {
    // Set data-type attributes for each sign wrapper
    $(".sign-wrapper").each(function () {
      const wrapper = $(this);
      if (wrapper.find('select[name="aluminum_size[]"]').length) {
        wrapper.find(".form-col-duplicate").attr("data-type", "aluminum");
      } else if (wrapper.find('select[name="decal_size[]"]').length) {
        wrapper.find(".form-col-duplicate").attr("data-type", "decal");
      } else if (wrapper.find('select[name="sticker_size[]"]').length) {
        wrapper.find(".form-col-duplicate").attr("data-type", "sticker");
      } else if (wrapper.find('select[name="greeter_size[]"]').length) {
        wrapper.find(".form-col-duplicate").attr("data-type", "greeter");
      }
    });

    // Add event listeners for existing rows
    $(".form-col-duplicate").each(function () {
      const row = $(this);
      const quantityInput = row.find('input[name$="_quantity[]"]');
      const sizeSelect = row.find('select[name$="_size[]"]');

      quantityInput.on("keyup", function () {
        updatePrice(row);
      });

      sizeSelect.on("change", function () {
        updatePrice(row);
      });
    });
  }

  function calculateTotalPrice() {
    let guardTotal = 0;
    let greeterTotal = 0;

    // Aluminum signs
    $('input[name="aluminum_price[]"]').each(function () {
      guardTotal += parseFloat($(this).val()) || 0;
    });

    // Decal signs
    $('input[name="decal_price[]"]').each(function () {
      guardTotal += parseFloat($(this).val()) || 0;
    });

    // Sticker signs
    $('input[name="sticker_price[]"]').each(function () {
      guardTotal += parseFloat($(this).val()) || 0;
    });

    // Greeter signs
    $('input[name="greeter_price[]"]').each(function () {
      greeterTotal += parseFloat($(this).val()) || 0;
    });

    return {
      guardTotal: guardTotal,
      greeterTotal: greeterTotal,
      combinedTotal: guardTotal + greeterTotal
    };
  }

  // Update the displayed totals
  function updateTotalDisplay() {
    const totals = calculateTotalPrice();
    const currentStep = steps.index($(".form-step.active"));

    if (currentStep === 1) { // Greeter step
      const remainingCredit = 90 - totals.greeterTotal;

      $(".price-banner-item-col span")
        .eq(0).text("$" + totals.combinedTotal.toFixed(2))
        .end()
        .eq(1).text("$" + Math.max(0, remainingCredit).toFixed(2));
    } else {
      const remainingCredit = 90 - totals.guardTotal;

      $(".price-banner-item-col span")
        .eq(0).text("$" + totals.guardTotal.toFixed(2))
        .end()
        .eq(1).text("$" + Math.max(0, remainingCredit).toFixed(2));
    }

    // Highlight if over credit
    const remaining = currentStep === 1 ? (90 - totals.greeterTotal) : (90 - totals.guardTotal);
    if (remaining < 0) {
      $(".price-banner-item-col span").eq(0).addClass("text-danger");
      $(".price-banner-item-col span").eq(1).addClass("text-danger");
    } else {
      $(".price-banner-item-col span").eq(0).removeClass("text-danger");
      $(".price-banner-item-col span").eq(1).removeClass("text-danger");
    }
  }

  // Initialize price calculations when the document is ready
  $(document).ready(function () {
    initializePriceCalculations();

    updateTotalDisplay(); // Initialize the totals

    // Also update totals when any quantity or size changes
    $('input[name$="_quantity[]"], select[name$="_size[]"]').on(
      "change keyup",
      function () {
        const row = $(this).closest(".form-col-duplicate");
        updatePrice(row);
      }
    );
  });
});
