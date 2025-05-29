function fillForm(formData) {
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');

  inputs.forEach((input) => {
    const labelEl = input.closest('.Qr7Oae')?.querySelector('.M7eMe');
    const labelText = labelEl?.innerText.toLowerCase();

    if (labelText) {
      if (labelText.includes('name')) {
        input.value = formData.name || '';
      } else if (labelText.includes('e-mail')) {
        input.value = formData.email || '';
      } else if (labelText.includes('phone')) {
        input.value = formData.phone || '';
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
}

// Only run if data hasn't been used yet
chrome.storage.local.get(["autofillData", "autofillUsed"], ({ autofillData, autofillUsed }) => {
  if (autofillData && !autofillUsed) {
    setTimeout(() => {
      fillForm(autofillData);

      // Mark it as used
      chrome.storage.local.set({ autofillUsed: true });
    }, 1500);
  }
});
