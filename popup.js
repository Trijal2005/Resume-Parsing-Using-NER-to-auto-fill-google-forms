document.getElementById('uploadBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('resume');
  const status = document.getElementById('status');
  
  if (!fileInput.files.length) {
    status.textContent = "Please upload a resume.";
    return;
  }

  const formData = new FormData();
  formData.append("resume", fileInput.files[0]);

  status.textContent = "Uploading...";

  try {
    const res = await fetch("http://localhost:5000/extract", {
      method: "POST",
      body: formData
    });
    const data = await res.json();

    if (chrome?.storage?.local) {
    chrome.storage.local.set({ autofillData: data, autofillUsed: false }, () => {
      status.textContent = "Data extracted. Switch to the form tab.";
    });
    } else {
      console.error("chrome.storage is undefined.");
      status.textContent = "Error: chrome.storage is not available.";
    };
  } catch (err) {
    console.error("Fetch failed:", err);
    const resText = await err.response?.text?.();
    console.error("Response text:", resText);
    status.textContent = "Error uploading resume.";
  }
});
