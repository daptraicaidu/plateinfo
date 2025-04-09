// ------------------
// XỬ LÝ CHUYỂN TAB
// ------------------
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    tabContents.forEach((content) => content.classList.remove("active"));
    const target = btn.getAttribute("data-tab");
    document.getElementById(target).classList.add("active");
  });
});

// ---------------------
// TÍNH NĂNG UPLOAD ẢNH VỚI DRAG & DROP
// ---------------------
const dropArea = document.getElementById("drop-area");
const uploadFileInput = document.getElementById("upload-file-input");
const selectImageBtn = document.getElementById("select-image-btn");
const lookupUploadBtn = document.getElementById("lookup-upload");
const uploadPreview = document.getElementById("upload-preview");
const contentDrag = document.getElementById("contentDrag");

let uploadedFile = null;

// Ngăn chặn các sự kiện mặc định cho drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Khi kéo thả, đánh dấu vùng drop
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => {
    dropArea.classList.add('highlight');
  });
});
['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => {
    dropArea.classList.remove('highlight');
  });
});

// Xử lý drop file
dropArea.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files && files[0]) {
    handleFile(files[0]);
  }
});

// Khi click nút "Chọn Ảnh", trigger file input
selectImageBtn.addEventListener("click", () => {
  uploadFileInput.click();
});


// Khi chọn file từ file input
uploadFileInput.addEventListener("change", () => {
  if (uploadFileInput.files && uploadFileInput.files[0]) {
    handleFile(uploadFileInput.files[0]);
  }
});

// Hàm xử lý file upload
function handleFile(file) {
  uploadedFile = file;
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadPreview.src = e.target.result;
    uploadPreview.style.display = "block";
    uploadPreview.style.textAlign = "center";
    contentDrag.style.display = "none";
    // Sau khi có ảnh, ẩn nút chọn và hiển thị nút tra cứu
    selectImageBtn.innerHTML = "Chọn ảnh khác";
    // selectOtherImageBtn.style.display = "inline-block";
    lookupUploadBtn.style.display = "inline-block";
  }
  reader.readAsDataURL(file);
}

// Nút "Tra cứu" cho upload
lookupUploadBtn.addEventListener("click", () => {
  if (!uploadedFile) {
    alert("Chưa có ảnh!");
    return;
  }
  // alert("Tra cứu dựa trên ảnh upload (chỉ FE demo)!");
});


// ---------------------
// TÍNH NĂNG CHỤP ẢNH TỪ CAMERA
// ---------------------



const startCameraBtn = document.getElementById("start-camera");
const capturePhotoBtn = document.getElementById("capture-photo");
const lookupCameraBtn = document.getElementById("lookup-camera");
const cameraStream = document.getElementById("camera-stream");
const cameraView = document.getElementById("camera-view");
const capturedImageContainer = document.getElementById("captured-image-container");
const capturedImage = document.getElementById("captured-image");
let stream = null;

// Khi người dùng bấm "Mở Camera"
startCameraBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    cameraStream.srcObject = stream;
    startCameraBtn.style.display = "none";
    capturePhotoBtn.style.display = "inline-block";
  } catch (err) {
    alert("Không thể truy cập camera: " + err);
  }
});


// Khi người dùng bấm "Chụp" hoặc "Chụp lại"
capturePhotoBtn.addEventListener("click", async () => {
  // Nếu khung camera đang hiển thị => đang ở chế độ chụp lần đầu
  if (cameraView.style.display !== "none") {
    // Tạo canvas để chụp ảnh từ video
    const canvas = document.createElement("canvas");
    canvas.width = cameraStream.videoWidth;
    canvas.height = cameraStream.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(cameraStream, 0, 0, canvas.width, canvas.height);
    // Hiển thị ảnh vừa chụp
    capturedImage.src = canvas.toDataURL("image/png");

    // Xóa uploadedFile để ưu tiên ảnh chụp mới
    uploadedFile = null;

    // Ẩn khung camera, hiện khung ảnh đã chụp
    cameraView.style.display = "none";
    capturedImageContainer.style.display = "block";
    // Đổi nội dung nút "Chụp" thành "Chụp lại" và hiển thị nút "Tra cứu"
    capturePhotoBtn.textContent = "Chụp lại";
    lookupCameraBtn.style.display = "inline-block";
    // Dừng stream để không tiêu tốn pin
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }

  } else {
    // Nếu đang ở chế độ ảnh đã chụp (khung camera ẩn)
    // Xoá ảnh đã chụp
    capturedImageContainer.style.display = "none";
    capturedImage.src = "";
    try {
      // Khởi tạo lại camera
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStream.srcObject = stream;
      cameraView.style.display = "block";
      // Đổi nội dung nút thành "Chụp" và ẩn nút "Tra cứu"
      capturePhotoBtn.textContent = "Chụp";
      lookupCameraBtn.style.display = "none";
    } catch (err) {
      alert("Không thể truy cập camera: " + err);
    }
  }
});

// Hàm chuyển đổi data URL thành File
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


// Nút "Tra cứu" cho camera
lookupCameraBtn.addEventListener("click", () => {
  if (capturedImage.src) {
    // alert("Tra cứu dựa trên ảnh chụp (chỉ FE demo)!");
  } else {
    alert("Chưa có ảnh để tra cứu!");
  }
});



// ---------------------
// CHECK LOGIN, ĐĂNG XUẤT, XỬ LÝ USER
// ---------------------

document.addEventListener("DOMContentLoaded", async () => {
  const userInfoDiv = document.getElementById("user-info");
  const userNameSpan = document.getElementById("user-name");
  const userDropdown = document.getElementById("user-dropdown");
  const logoutBtn = document.getElementById("logout-btn");
  const userIcon = document.getElementById("user-icon");

  try {
    // Kiểm tra xem user có đang đăng nhập không
    const response = await fetch("http://helloworld871523-001-site1.qtempurl.com/api/PN/user-info", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const userData = await response.json();
      userNameSpan.textContent = userData.tenCongAn || "Người dùng";
      userInfoDiv.style.display = "flex"; // Hiển thị user info nếu đã đăng nhập
    }
  } catch (error) {
    console.error("Lỗi lấy thông tin user:", error);
  }

  // Xử lý toggle dropdown khi bấm vào icon user
  userInfoDiv.addEventListener("click", (event) => {
    event.stopPropagation(); // Ngăn không để click lan ra ngoài
    userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
  });

  // Đăng xuất
  logoutBtn.addEventListener("click", async (e) => {
    e.stopPropagation();

    try {
      const logoutResponse = await fetch("http://helloworld871523-001-site1.qtempurl.com/api/PN/logout", {
        method: "POST",
        credentials: "include",
      });

      if (logoutResponse.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  });

  // Ẩn dropdown khi click ra ngoài
  document.addEventListener("click", () => {
    userDropdown.style.display = "none";
  });
});




///////////////////////////
// CHECK ChucVu + Chuyển biển số xe đã nhận diện được qua trang báo cáo (report.html)
/////////////////////////

// document.getElementById("reportBtn").addEventListener("click", function () {
//   let plateSpan = document.querySelector("#plates-container span");
//   if (plateSpan) {
//       let fullText = plateSpan.innerText.trim();
//       let plateNumber = fullText.split(" (")[0]; // Lấy phần trước dấu " ("
//       window.location.href = `report?bienso=${encodeURIComponent(plateNumber)}`;
//   } else {
//       alert("Chưa có biển số, vui lòng chờ hệ thống nhận diện xong!");
//   }
// });



// document.addEventListener("click", function (event) {
//   // Kiểm tra nếu click vào nút "Báo cáo vi phạm"
//   if (event.target.classList.contains("btn") && event.target.id === "reportBtn") {
//     event.stopPropagation(); // Ngăn event click nổi lên vùng chứa biển số

//     let plateContainer = event.target.closest(".plate-container"); // Lấy vùng chứa nút
//     let plateSpan = plateContainer.querySelector("span"); // Lấy span chứa biển số trong vùng đó

//     if (plateSpan) {
//       let fullText = plateSpan.innerText.trim();
//       let plateNumber = fullText.split(" (")[0]; // Lấy phần trước dấu " ("
//       window.location.href = `report?bienso=${encodeURIComponent(plateNumber)}`;
//     } else {
//       alert("Chưa có biển số, vui lòng chờ hệ thống nhận diện xong!");
//     }
//   }
// });

