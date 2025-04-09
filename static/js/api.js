//////////////
// TÍNH NĂNG GỬI ẢNH
/////////////////

function uploadImage() {
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
                    .then(textData => {
                        const bs = textData.plate_text || "Không nhận diện được";
                        // plateText.textContent = bs;
                        plateText.textContent = bs + " (Nhấn vào ảnh để tra cứu)"; // Hiển thị kèm hướng dẫn

                        // Thêm sự kiện click để kiểm tra phạt nguội
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

// Hàm gửi biển số đến API phạt nguội
function checkPhatNguoi(bienso) {
    if (!bienso || bienso === "Không nhận diện được") {
        alert("Không thể kiểm tra phạt nguội do lỗi nhận diện.");
        return;
    }    

    fetch("https://api.checkphatnguoi.vn/phatnguoi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bienso: bienso })
    })
    .then(response => response.json())
    .then(result => {
        showPhatNguoiForm(result, bienso);
    })
    .catch(error => {
        console.error("Lỗi khi kiểm tra phạt nguội:", error);
        alert("Không thể kiểm tra phạt nguội.");
    });
}



// Hiển thị form phạt nguội ở dạng bảng với nút "X" ở góc trên bên phải
function showPhatNguoiForm(data, bienso) {
    let content = `<div class="content-wrapper">
      <button class="btn primary-btn" onclick="closePhatNguoiForm()">X</button>
      <h2>Thông tin phạt nguội</h2>
      <p id="bienso"><strong>Biển số:</strong> ${bienso}</p>`;
  
    // Nếu có thông tin tổng hợp, hiển thị ngay dưới biển số
    if (data.data_info) {
      content += `<div id="tonghop">
        <h3></h3>
        <p><strong>Tổng số vi phạm:</strong> ${data.data_info.total}</p>
        <div>
        <a>Chưa xử phạt: <strong>${data.data_info.chuaxuphat}</strong>, </a>
        <a>Đã xử phạt: <strong>${data.data_info.daxuphat}</strong></a>
        </div>
      </div>`;
    }
  
    // Hiển thị dữ liệu chi tiết (ở dạng bảng)
    if (data.data && data.data.length > 0) {
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
      data.data.forEach((v, index) => {
        content += `<tr id="row-${index}">
               <td class="loai-phuong-tien">${v["Loại phương tiện"]}</td>
               <td class="thoi-gian-vi-pham">${v["Thời gian vi phạm"]}</td>
               <td class="dia-diem">${v["Địa điểm vi phạm"]}</td>
               <td class="hanh-vi-vi-pham">${v["Hành vi vi phạm"]}</td>
               <td class="trang-thai">${v["Trạng thái"]}</td>
               <td class="don-vi-phat-hien">${v["Đơn vị phát hiện vi phạm"]}</td>
               <td class="noi-giai-quyet">${Array.isArray(v["Nơi giải quyết vụ việc"]) ? v["Nơi giải quyết vụ việc"].join(', ') : v["Nơi giải quyết vụ việc"]}</td>
            </tr>`;
      });
      content += `</tbody></table>`;
    } else {
      content += "<br><br><p>Không có lỗi phạt nguội nào.</p>";
    }
  
    // Nút Đóng ở cuối trang
    content += `<br><br><button class="btn primary-btn" id="btn-close" onclick="closePhatNguoiForm()">Đóng</button>
    </div>`;
  
    const formContainer = document.getElementById("phat-nguoi-form");
    // Đảm bảo hiển thị form mỗi khi mở
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
  document.addEventListener("click", function(event) {
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
