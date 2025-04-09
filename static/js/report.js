///////////////
// KIỂM TRA QUYỀN(PERMISSION)
///////////////

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://helloworld871523-001-site1.qtempurl.com/api/auth/check-access", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(await response.text()); // Lấy lỗi từ BE
    }

    const data = await response.json();
    console.log("✅ Truy cập được:", data.message);
  } catch (error) {
    console.warn("🚫 Không có quyền truy cập:", error);
    window.location.href = "index.html"; // Chuyển hướng trang nếu bị chặn
  }
});



document.addEventListener('DOMContentLoaded', function () {

  ///////////////
  // SET UP MAP VÀ ĐỊA CHỈ
  ///////////////

  const apiKey = "2bseaYgwJi7Cv9CtJgPzIOFg0WLnJsMO";
  const searchBox = document.getElementById("violationAddress");
  const suggestions = document.getElementById("suggestions");
  const coordinateInput = document.getElementById("coordinate");

  // Khởi tạo bản đồ Leaflet
  window.map = L.map("map").setView([16.0471, 108.2062], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  }).addTo(window.map);
  

  let marker;

  searchBox.addEventListener("input", async () => {
    const query = searchBox.value.trim();
    if (query.length < 2) {
      suggestions.style.display = "none";
      return;
    }

    try {
      const response = await fetch(`https://mapapis.openmap.vn/v1/autocomplete?text=${encodeURIComponent(query)}&apikey=${apiKey}`);
      const data = await response.json();

      console.log("📌 API Response:", data);
      suggestions.innerHTML = "";

      if (data.features && data.features.length > 0) {
        data.features.forEach(place => {
          const li = document.createElement("li");
          li.textContent = place.properties.label;
          li.addEventListener("click", () => {
            searchBox.value = place.properties.label;
            suggestions.style.display = "none";
            const [lng, lat] = place.geometry.coordinates;

            if (marker) map.removeLayer(marker);
            marker = L.marker([lat, lng]).addTo(map).bindPopup(place.properties.label).openPopup();
            map.setView([lat, lng], 15);

            // Cập nhật tọa độ vào input
            coordinateInput.value = `${lat}, ${lng}`;
          });
          suggestions.appendChild(li);
        });
        suggestions.style.display = "block";
      } else {
        suggestions.style.display = "none";
      }
    } catch (error) {
      console.error("🚨 Lỗi khi gọi API:", error);
    }
  });

  document.addEventListener("click", (event) => {
    if (!searchBox.contains(event.target) && !suggestions.contains(event.target)) {
      suggestions.style.display = "none";
    }
  });

  // Xử lý sự kiện click trên bản đồ
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    if (marker) map.removeLayer(marker);
    marker = L.marker([lat, lng]).addTo(map);

    try {
      const response = await fetch(`https://mapapis.openmap.vn/v1/geocode/reverse?latlng=${lat},${lng}&apikey=${apiKey}`);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const locationInfo = data.results[0].formatted_address;
        searchBox.value = locationInfo;
        marker.bindPopup(locationInfo).openPopup();
      } else {
        marker.bindPopup("Không tìm thấy địa chỉ").openPopup();
      }
    } catch (error) {
      console.error("🚨 Lỗi khi gọi API Reverse Geocoding:", error);
    }

    // Cập nhật tọa độ vào input
    coordinateInput.value = `${lat}, ${lng}`;
  });






  ///////////////
  // LẤY TIME HIỆN TẠI ĐIỀN VÀO TRƯỜNG THỜI GIAN
  ///////////////

  let inputThoiGian = document.getElementById("violationTime");
  if (inputThoiGian) {
    let now = new Date();
    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let day = String(now.getDate()).padStart(2, '0');
    let hours = String(now.getHours()).padStart(2, '0');
    let minutes = String(now.getMinutes()).padStart(2, '0');

    let formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    inputThoiGian.value = formattedDateTime;
  }
  ////////////////
  // TÌM KIẾM VÀ CHỌN CÁC TRƯỜNG
  ///////////////


  document.querySelectorAll(".custom-select").forEach(selectContainer => {
    const selectBox = selectContainer.querySelector(".select-box");
    const options = selectContainer.querySelector(".options");
    const searchBox = selectContainer.querySelector(".options input[type='text']");
    const hiddenInput = selectContainer.querySelector("input[type='hidden']");


    // Mở/đóng dropdown khi click vào ô chọn
    selectBox.addEventListener("click", (e) => {
      if (options.querySelectorAll(".option").length === 0) return;

      // Đóng tất cả dropdown khác trước khi mở dropdown hiện tại
      document.querySelectorAll(".options").forEach(opt => {
        if (opt !== options) opt.classList.remove("show");
      });

      options.classList.toggle("show");
      e.stopPropagation();

    });

    // Chọn option và cập nhật giá trị, sau đó ĐÓNG dropdown

    options.addEventListener("click", (e) => {
      const option = e.target.closest(".option");

      if (option) {
        selectBox.value = option.innerText;
        hiddenInput.value = option.dataset.value;
        options.classList.remove("show"); // Đóng dropdown ngay khi chọn

        // Reset ô tìm kiếm nếu có (vẫn lỗi)
        if (searchBox) {
          searchBox.value = "";
          options.querySelectorAll(".option").forEach(opt => opt.style.display = "block");
        }
      }
    });


    // Ngăn dropdown đóng khi click vào ô tìm kiếm
    if (searchBox) {
      searchBox.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      searchBox.addEventListener("input", () => {
        let filter = searchBox.value.toLowerCase();
        options.querySelectorAll(".option").forEach(option => {
          option.style.display = option.innerText.toLowerCase().includes(filter) ? "block" : "none";
        });
      });
    }

    // Đóng dropdown khi click ra ngoài, nhưng KHÔNG đóng nếu click vào input
    document.addEventListener("click", (e) => {
      document.querySelectorAll(".custom-select").forEach(selectContainer => {

        const options = selectContainer.querySelector(".options");
        // Nếu click nằm trong selectContainer (trừ input) thì đóng dropdown
        if (!selectContainer.contains(e.target) || e.target.classList.contains("option")) {
          options.classList.remove("show");
        }
      });
    });
  });



  //////////////////
  // Nhận dữ liệu biển số từ index qua URLparam
  //////////////


  let params = new URLSearchParams(window.location.search);
  let plate = params.get("bienso");
  if (plate) {
    document.getElementById("signInput").value = decodeURIComponent(plate);
  }




  ///////////////
  // HIỂN THỊ LỊCH SỬ VI PHẠM VỚI API 
  ///////////////


  const inputElement = document.getElementById("signInput");
  const historyButton = document.getElementById("historyBtn");
  const historyContent = document.getElementById("history-content");

  historyButton.addEventListener("click", async function () {
    document.getElementById('history-column').style = "flex: 0 0 33%; ";
    const plateNumber = inputElement.value.trim();
    if (!plateNumber) {
      alert("Vui lòng nhập biển số xe");
      return;
    }

    try {
      const response = await fetch("http://helloworld871523-001-site1.qtempurl.com/api/PN/traCuuViPham", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ bienso: plateNumber })
      });

      if (!response.ok) {
        throw new Error("Lỗi khi lấy dữ liệu");
      }

      const data = await response.json();
      console.log("Dữ liệu nhận được:", data); // Debug
      renderHistory(data, plateNumber);
    } catch (error) {
      historyContent.innerHTML = `<p style="color: red;">Không có dữ liệu : ${error.message}</p>`;
    }
  });

  function renderHistory(data, bienso) {
    let total = data.length;
    let chuaxuphat = data.filter(v => v.trangThai === "Chưa xử phạt").length;
    let daxuphat = total - chuaxuphat;

    let content = `<div class="content-wrapper">
      <p id="bienso"><strong>Biển số:</strong> ${bienso}</p>`;

    if (total > 0) {
      content += `<div id="tonghop">
                  <h3></h3>
                  <p><strong>Tổng số vi phạm:</strong> ${total}</p>
                  <div>
                  <a>Chưa xử phạt: <strong>${chuaxuphat}</strong>, </a>
                  <a>Đã xử phạt: <strong>${daxuphat}</strong></a>
                  </div>
                  </div><br>`;
    }

    if (total > 0) {
      content += `<table id="violation-table">
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

      //////////////////////
      // NẾU BIỂN SỐ ĐÓ TỪNG CÓ TRONG DB THÌ LẤY LUÔN LOẠI PHƯƠNG TIỆN
      /////////////////

      if (total > 0 && data.length > 0) {
        let loaiPhuongTien = data[0].loaiPhuongTien; // Lấy loại phương tiện từ bản ghi đầu tiên
        document.getElementById("vehicleType").value = loaiPhuongTien;
        document.getElementById("vehicleTypeInput").value = loaiPhuongTien;
      }


    } else {
      content += "<br><br><p>Không có lỗi phạt nguội nào.</p>";
    }

    historyContent.innerHTML = content;
  }


  ///////////////
  // GỬI DỮ LIỆU VÀO CƠ SỞ DỮ LIỆU
  ///////////////
  document.querySelector('form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Thu thập dữ liệu từ form
    const formData = {
      BienKiemSoat: document.getElementById('signInput').value,
      LoaiPhuongTien: document.getElementById('vehicleType').value,
      HanhVi: document.getElementById('violationBehavior').value,
      ThoiGian: document.getElementById('violationTime').value,
      DiaDiem: document.getElementById('violationAddress').value,
      ToaDo: document.getElementById('coordinate').value,
      TrangThai: "Chưa xử phạt", // Mặc định
      DonViPhatHien: document.getElementById('dviPhatHien').value,
      NoiGiaiQuyet: document.getElementById('noiNopPhat').value
    };

    try {
      const response = await fetch('http://helloworld871523-001-site1.qtempurl.com/api/PN/create', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Thêm vi phạm thành công!');
        document.querySelector('form').reset(); // Reset form
      } else {
        alert(`Lỗi: ${result.title || 'Không thể thêm dữ liệu'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi kết nối đến server');
    }
  });


  /////////////
  //Ẩn hiện lịch sử vi phạm
  ////////////

  document.getElementById("hideHistoryBtn").addEventListener("click", function () {
    document.getElementById('history-column').style = "flex: 0 0 0%; ";


    // const historyColumn = document.querySelector(".history-column");
    // const toggleIcon = document.getElementById("toggleIcon");

    // historyColumn.classList.toggle("hidden");

    // if (historyColumn.classList.contains("hidden")) {
    //   toggleIcon.classList.add("expanded");
    //   document.querySelector(".violation-history").style.display = "none";

    // } else {
    //   toggleIcon.classList.remove("expanded");
    //   document.querySelector(".violation-history").style.display = "block";

    // }
  });





});
