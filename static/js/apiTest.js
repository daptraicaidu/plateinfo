///////////////
// Kiểm tra quyền báo cáo ngay khi trang load
///////////////////

document.addEventListener("DOMContentLoaded", async () => {
  let hasPermission = false; // Biến lưu trạng thái quyền

  try {
    const response = await fetch("http://helloworld871523-001-site1.qtempurl.com/api/auth/check-access", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    console.log("✅ Có thể báo cáo:", data.message);
    hasPermission = true; // Ghi nhận user có quyền báo cáo
  } catch (error) {
    console.warn("🚫 Không có quyền truy cập:", error);
  }

  // Chỉ thêm nút báo cáo nếu có quyền
  function addReportButton(plateItem, bs) {
    if (!hasPermission) return; // Không có quyền thì không hiện nút

    let reportButton = document.createElement("button");
    reportButton.classList.add("btn", "primary-btn", "report-btn");
    reportButton.textContent = "Báo cáo vi phạm";

    reportButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (bs !== "Không nhận diện được") {
        window.location.href = `report?bienso=${encodeURIComponent(bs)}`;
      } else {
        alert("Chưa có biển số, vui lòng chờ hệ thống nhận diện xong!");
      }
    });

    plateItem.appendChild(reportButton);
  }


  //////////////
  // TÍNH NĂNG GỬI ẢNH
  /////////////////

  document.getElementById("lookup-upload").addEventListener("click", uploadImage);
  document.getElementById("lookup-camera").addEventListener("click", uploadImage);

  function uploadImage(event) {
    // Ngăn hành vi reload
    // if (event) event.preventDefault();
    // Ưu tiên dùng file từ uploadedFile (drag & drop / chọn ảnh)
    let file = uploadedFile;
    // Nếu không có file, kiểm tra xem có ảnh chụp từ camera hay không
    if (!file && capturedImage && capturedImage.src && capturedImage.src.startsWith("data:")) {
      file = dataURLtoFile(capturedImage.src, "captured.png");
    }

    if (!file) {
      alert("Vui lòng chọn một ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch('http://localhost:8000/detect/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        const platesContainer = document.getElementById("plates-container");
        platesContainer.innerHTML = '';

        if (data.plates && data.plates.length > 0) {
          data.plates.forEach(plateBase64 => {
            const plateItem = document.createElement('div');
            plateItem.classList.add('plate-item');

            const imgElement = document.createElement('img');
            imgElement.src = `data:image/jpeg;base64,${plateBase64}`;

            const plateText = document.createElement('span');
            plateText.textContent = "Đang nhận diện...";

            plateItem.appendChild(imgElement);
            plateItem.appendChild(plateText);
            platesContainer.appendChild(plateItem);

            // Chuyển base64 thành Blob để gửi đến API /read/
            fetch(`data:image/jpeg;base64,${plateBase64}`)
              .then(res => res.blob())
              .then(blob => {
                const textFormData = new FormData();
                textFormData.append("file", blob, "plate.jpg");

                return fetch('http://localhost:8000/read/', {
                  method: 'POST',
                  body: textFormData,
                });
              })
              .then(response => response.json())

              // .then(textData => {
              //   const bs = textData.plate_text || "Không nhận diện được";
              //   // plateText.textContent = bs;
              //   plateText.innerHTML = `${bs} (Nhấn vào ảnh để tra cứu) <button id="reportBtn" class="btn primary-btn" type="button">Báo cáo vi phạm</button>`;

              //   // Thêm sự kiện click để kiểm tra phạt nguội
              //   plateItem.addEventListener("click", function () {
              //     checkPhatNguoi(bs);
              //   });

              // })

              .then(textData => {
                const bs = textData.plate_text || "Không nhận diện được";
                plateText.innerHTML = `${bs} (Nhấn vào ảnh để tra cứu)`;

                // Chỉ thêm nút báo cáo nếu user có quyền
                addReportButton(plateItem, bs);

                // // Tạo nút báo cáo vi phạm
                // let reportButton = document.createElement("button");
                // reportButton.classList.add("btn", "primary-btn", "report-btn");
                // reportButton.textContent = "Báo cáo vi phạm";

                // // Thêm sự kiện click cho nút báo cáo
                // reportButton.addEventListener("click", function (event) {
                //   event.stopPropagation(); // Ngăn không cho event click vào plateItem chạy
                //   if (bs !== "Không nhận diện được") {
                //     window.location.href = `report?bienso=${encodeURIComponent(bs)}`;
                //   } else {
                //     alert("Chưa có biển số, vui lòng chờ hệ thống nhận diện xong!");
                //   }
                // });

                // // Thêm nút vào plateItem
                // plateItem.appendChild(reportButton);

                // Thêm sự kiện click vào plateItem để tra cứu
                plateItem.addEventListener("click", function () {
                  checkPhatNguoi(bs);
                });

              })

              .catch(error => {
                console.error('Lỗi khi đọc biển số:', error);
                plateText.textContent = "Lỗi nhận diện";
              });
          });
        } else {
          platesContainer.innerHTML = '<p>Không phát hiện biển số nào.</p>';
        }
      })
      .catch(error => {
        console.error('Lỗi khi tải ảnh:', error);
      });
  }

});

/////////////////
// Hàm gửi biển số đến API 

async function checkPhatNguoi(bienso) {
  try {
    const response = await fetch('http://helloworld871523-001-site1.qtempurl.com/api/PN/traCuuViPham', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bienSo: bienso })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      showPhatNguoiForm([], bienso);
      return;
    }

    showPhatNguoiForm(data, bienso);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    showPhatNguoiForm([], bienso);
  }
}




// Hiển thị form phạt nguội ở dạng bảng với nút "X" ở góc trên bên phải
function showPhatNguoiForm(data, bienso) {
  let total = data.length;
  let chuaxuphat = data.filter(v => v.trangThai === "Chưa xử phạt").length;
  let daxuphat = total - chuaxuphat;

  let content = `<div class="content-wrapper">
      <button id="closePnFormBtn" class="btn primary-btn" onclick="closePhatNguoiForm()">X</button>
      <h2>Thông tin phạt nguội</h2>
      <p id="bienso"><strong>Biển số:</strong> ${bienso}</p>`;

  if (total > 0) {
    content += `<div id="tonghop">
          <h3></h3>
          <p><strong>Tổng số vi phạm:</strong> ${total}</p>
          <div>
          <a>Chưa xử phạt: <strong>${chuaxuphat}</strong>, </a>
          <a>Đã xử phạt: <strong>${daxuphat}</strong></a>
          </div>
        </div>`;
  }

  if (total > 0) {
    content += `<table id="phat-nguoi-table">
          <thead>
              <tr>
                  <th>Loại phương tiện</th>
                  <th>Thời gian vi phạm</th>
                  <th>Địa điểm</th>
                  <th>Hành vi vi phạm</th>
                  <th>Trạng thái</th>
                  <th>Đơn vị phát hiện</th>
                  <th>Nơi giải quyết</th>
              </tr>
          </thead>
          <tbody>`;

    data.forEach((v, index) => {
      content += `<tr id="row-${index}">
              <td>${v.loaiPhuongTien}</td>
              <td>${new Date(v.thoiGian).toLocaleString()}</td>
              <td>${v.diaDiem}</td>
              <td>${v.hanhVi}</td>
              <td>${v.trangThai}</td>
              <td>${v.donViPhatHien}</td>
              <td>${v.noiGiaiQuyet}</td>
          </tr>`;
    });
    content += `</tbody></table>`;
  } else {
    content += "<br><br><p>Không có lỗi phạt nguội nào.</p>";
  }

  content += `<br><br><button class="btn primary-btn" onclick="closePhatNguoiForm()">Đóng</button>
  </div>`;

  const formContainer = document.getElementById("phat-nguoi-form");
  formContainer.style.display = "block";
  formContainer.innerHTML = content;
  formContainer.classList.add("show");
}


// Đóng form phạt nguội
function closePhatNguoiForm() {
  const formContainer = document.getElementById("phat-nguoi-form");
  formContainer.classList.remove("show");
  setTimeout(() => {
    formContainer.style.display = "none";
  }, 500);
}

// Đóng banner khi click bên ngoài vùng banner
document.addEventListener("click", function (event) {
  const formContainer = document.getElementById("phat-nguoi-form");
  if (formContainer && formContainer.classList.contains("show")) {
    // Nếu click không nằm trong phần tử banner, đóng banner
    if (!formContainer.contains(event.target)) {
      closePhatNguoiForm();
    }
  }
});




/////////////////////
// TÍNH NĂNG NHẬP TAY
////////////////////

// Hàm mới cho tính năng nhập tay biển số
function uploadSign() {
  const plate = document.getElementById('plate-input').value.trim();
  if (!plate) {
    alert('Nhập biển số đi, đừng để trống!');
    return;
  }
  // Gọi API kiểm tra phạt nguội với biển số nhập tay
  checkPhatNguoi(plate);
}
