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
            qrCodeContainer.appendChild(img);

            const fullName = document.getElementById("fullName");
            fullName.innerText = `${data.firstName} ${data.lastName}`;

            const department = document.getElementById("department");
            department.innerText = `${data.department}`;

            // Download link
            const downloadLink = document.createElement("a");
            downloadLink.href = data.qrcode;
            downloadLink.download = "qr-code.png";

            // Download button
            const downloadBtn = document.createElement("button");
            downloadBtn.classList.add('download-btn');
            downloadBtn.innerText = "Download QR Code";
            downloadLink.appendChild(downloadBtn);
            document.getElementById("container").appendChild(downloadLink);

            // Show success notification
            showNotification("Registration successful! Show this QR code at the event entrance", "success");
        } else {
            qrCodeContainer.innerHTML = "<p>No QR Code found after querying!</p>";
            showNotification("Failed to load QR code", "error");
        }
    } catch (error) { 
        console.error(error);
        qrCodeContainer.innerHTML = "<p>Failed to load QR code</p>";
        showNotification("Network error loading QR code", "error");
    }
};

// Single window.onload handler
window.onload = function() {
    loadQRCode();
};