const qrCodeContainer = document.getElementById("qrCode");

const getQueryParams = async (param) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
};

const loadQRCode = async () => {
  const reference = await getQueryParams("reference");
  
  if (!reference) {
    qrCodeContainer.innerHTML = "<p>No QR Code found!</p>";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/v0/get-qr?reference=${reference}`);
    const data = await response.json();

    if (response.ok) {
      const img = document.createElement("img");
      img.src = data.qrcode;
      // qrCodeContainer.innerHTML = "";
      qrCodeContainer.appendChild(img);

      const fullName = document.getElementById("fullName");
      fullName.innerText = `${data.firstName} ${data.lastName}`;

      // download link
      const downloadLink = document.createElement("a");
      downloadLink.href = data.qrcode;
      downloadLink.download = "qr-code.png";

      // download button
      const downloadBtn = document.createElement("button");
      downloadBtn.classList.add('download-btn');
      downloadBtn.innerText = "Download QR Code";

      downloadLink.appendChild(downloadBtn);
      const container = document.getElementById("container");
      container.appendChild(downloadLink);
    } else {
      qrCodeContainer.innerHTML = "<p>No QR Code found after querying!</p>";
    }
  } catch (error) { 
    console.error(error);
    qrCodeContainer.innerHTML = "<p>Failed to load QR code</p>";
  }
};

window.onload = loadQRCode;