document.addEventListener("DOMContentLoaded", function () {



  ///////////////
  // LẤY TIME HIỆN TẠI ĐIỀN VÀO TRƯỜNG THỜI GIAN
  ///////////////

  let inputThoiGian = document.getElementById("thoi-gian");
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



  ///////////////
  // DỮ LIỆU CÁC TỈNH THÀNH
  ///////////////


  const provincesData = {
    "Hà Nội": {
      districts: {
        "Ba Đình": {
          wards: {
            "Phúc Xá": ["Đường Trần Hưng Đạo", "Đường Hoàng Hoa Thám"],
            "Trúc Bạch": ["Đường Thanh Niên", "Đường Đội Cấn"]
          }
        },
        "Hoàn Kiếm": {
          wards: {
            "Hàng Trống": ["Đường Lê Thái Tổ", "Đường Đinh Tiên Hoàng"],
            "Hàng Bài": ["Đường Tràng Tiền", "Đường Hàm Long"]
          }
        },
        "Tây Hồ": {
          wards: {
            "Bưởi": ["Đường Lê Duẩn", "Đường Âu Cơ"],
            "Nhật Tân": ["Đường Trần Phú", "Đường Quang Trung"]
          }
        },
        "Long Biên": {
          wards: {
            "Phúc Đồng": ["Đường Chu Văn An", "Đường Kim Giang"],
            "Ngọc Lâm": ["Đường Ngọc Hồi", "Đường Hồng Hà"]
          }
        },
        "Cầu Giấy": {
          wards: {
            "Dịch Vọng": ["Đường Nguyễn Văn Cừ", "Đường Láng Hạ"],
            "Mai Dịch": ["Đường Phạm Ngọc Thạch", "Đường Nguyễn Chí Thanh"]
          }
        },
        "Đống Đa": {
          wards: {
            "Thịnh Quang": ["Đường Phùng Hưng", "Đường Nguyễn Du"],
            "Kim Liên": ["Đường Lý Thường Kiệt", "Đường Trần Hưng Đạo"]
          }
        },
        "Hai Bà Trưng": {
          wards: {
            "Quán Thánh": ["Đường Trần Hưng Đạo", "Đường Trần Quang Khải"],
            "Phúc Thọ": ["Đường Lê Lợi", "Đường Trần Phú"]
          }
        },
        "Hoàng Mai": {
          wards: {
            "Giáp Bát": ["Đường Giáp Bát", "Đường Nhật Tân"],
            "Lĩnh Nam": ["Đường Lĩnh Nam", "Đường Bắc Sơn"]
          }
        },
        "Thanh Xuân": {
          wards: {
            "Nhân Chính": ["Đường Lê Đức Thọ", "Đường Nguyễn Kiệm"],
            "Thượng Thanh": ["Đường Thụy Khuê", "Đường Minh Khai"]
          }
        },
        // Các huyện, thị xã phía ngoại thành
        "Sóc Sơn": {
          wards: {
            "Yên Viên": ["Đường Trần Phú", "Đường Kim Đồng"],
            "Phúc Lợi": ["Đường Lý Thường Kiệt", "Đường Nguyễn Trãi"]
          }
        },
        "Đông Anh": {
          wards: {
            "Xuân Nộn": ["Đường Phạm Hùng", "Đường Lê Hồng Phong"],
            "Nguyễn Trãi": ["Đường Nguyễn Trãi", "Đường Lê Lợi"]
          }
        },
        "Gia Lâm": {
          wards: {
            "Vân Cơ": ["Đường Vân Cơ", "Đường Hà Bắc"],
            "Yết Kiêu": ["Đường Yết Kiêu", "Đường Trần Phú"]
          }
        },
        "Thanh Trì": {
          wards: {
            "Tam Hiệp": ["Đường Tam Hiệp", "Đường Phạm Văn Đồng"],
            "Tân Triều": ["Đường Tân Triều", "Đường Vũ Tông Phan"]
          }
        },
        "Mê Linh": {
          wards: {
            "Mê Linh": ["Đường Mê Linh", "Đường Hùng Vương"],
            "Đồng Mô": ["Đường Đồng Mô", "Đường Cầu Mê Linh"]
          }
        },
        "Phú Xuyên": {
          wards: {
            "Phú Xuyên": ["Đường Phú Xuyên", "Đường Hà Nội"],
            "Yên Dũng": ["Đường Yên Dũng", "Đường Thành Công"]
          }
        },
        "Ứng Hòa": {
          wards: {
            "Ứng Hòa": ["Đường Ứng Hòa", "Đường Minh Châu"],
            "Đông La": ["Đường Đông La", "Đường Lê Lai"]
          }
        },
        "Chương Mỹ": {
          wards: {
            "Chương Mỹ": ["Đường Chương Mỹ", "Đường Hùng Vương"],
            "Trung Hòa": ["Đường Trung Hòa", "Đường Quốc Hòa"]
          }
        },
        "Đan Phượng": {
          wards: {
            "Đan Phượng": ["Đường Đan Phượng", "Đường Hồng Hà"],
            "Sông Thao": ["Đường Sông Thao", "Đường Bắc Sơn"]
          }
        },
        "Hoài Đức": {
          wards: {
            "Hoài Đức": ["Đường Hoài Đức", "Đường Lê Lợi"],
            "Phúc Hòa": ["Đường Phúc Hòa", "Đường Ngô Gia Tự"]
          }
        },
        "Sơn Tây": {
          wards: {
            "Sơn Tây": ["Đường Sơn Tây", "Đường Lê Duẩn"],
            "Cổ Đông": ["Đường Cổ Đông", "Đường Hùng Vương"]
          }
        },
        "Ba Vì": {
          wards: {
            "Ba Vì": ["Đường Ba Vì", "Đường Trần Hưng Đạo"],
            "Phú Minh": ["Đường Phú Minh", "Đường Nguyễn Trãi"]
          }
        },
        "Thạch Thất": {
          wards: {
            "Thạch Thất": ["Đường Thạch Thất", "Đường Lê Lợi"],
            "Đại Mỗ": ["Đường Đại Mỗ", "Đường Trần Phú"]
          }
        },
        "Quốc Oai": {
          wards: {
            "Quốc Oai": ["Đường Quốc Oai", "Đường Phạm Hùng"],
            "Phú Cát": ["Đường Phú Cát", "Đường Lê Quý Đôn"]
          }
        },
        "Thanh Oai": {
          wards: {
            "Thanh Oai": ["Đường Thanh Oai", "Đường Lê Lợi"],
            "Kim Bài": ["Đường Kim Bài", "Đường Hùng Vương"]
          }
        },
        "Thường Tín": {
          wards: {
            "Thường Tín": ["Đường Thường Tín", "Đường Nguyễn Tất Thành"],
            "Nhân Trạch": ["Đường Nhân Trạch", "Đường Bạch Đằng"]
          }
        },
        "Phúc Thọ": {
          wards: {
            "Phúc Thọ": ["Đường Phúc Thọ", "Đường Trần Hưng Đạo"],
            "Xuân Phương": ["Đường Xuân Phương", "Đường Nguyễn Khắc Nhu"]
          }
        },
        "Mỹ Đức": {
          wards: {
            "Mỹ Đức": ["Đường Mỹ Đức", "Đường Lê Thánh Tông"],
            "Đại Nghĩa": ["Đường Đại Nghĩa", "Đường Phạm Văn Đồng"]
          }
        },
        "Bắc Từ Liêm": {
          wards: {
            "Bắc Từ Liêm": ["Đường Bắc Từ Liêm", "Đường Trần Phú"],
            "Phúc La": ["Đường Phúc La", "Đường Nguyễn Thái Học"]
          }
        },
        "Nam Từ Liêm": {
          wards: {
            "Nam Từ Liêm": ["Đường Nam Từ Liêm", "Đường Láng Hạ"],
            "Trung Văn": ["Đường Trung Văn", "Đường Hoàng Hoa Thám"]
          }
        }
      }
    },
    "Hồ Chí Minh": {

    }

    // CẢI THIỆN BỔ SUNG TỈNH
  };



  //////////////
  // HIỂN THỊ ĐỂ CHỌN CÁC QUẬN/HUYỆN, PHƯỜNG/XÃ, ĐƯỜNG
  ///////////////



  function loadOptions(container, options) {
    // Xóa tất cả option cũ trước khi render mới
    options.innerHTML = "";

    // Nếu đã có searchBox thì giữ nguyên, không tạo lại
    let searchBox = container.querySelector(".search-box");
    if (!searchBox) {
      searchBox = document.createElement("input");
      searchBox.type = "text";
      searchBox.className = "search-box";
      searchBox.placeholder = "Tìm kiếm...";
      searchBox.style = "width: 100%; padding: 5px; box-sizing: border-box;";
      container.appendChild(searchBox);
    }

    // Xóa các option cũ nhưng giữ lại searchBox
    container.querySelectorAll(".option").forEach(option => option.remove());

    // Thêm các option mới
    options.forEach(option => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option";
      optionDiv.setAttribute("data-value", option);
      optionDiv.textContent = option;
      container.appendChild(optionDiv);
    });

    // Đảm bảo sự kiện tìm kiếm luôn hoạt động
    searchBox.addEventListener("input", () => {
      let filter = searchBox.value.toLowerCase();
      container.querySelectorAll(".option").forEach(option => {
        option.style.display = option.innerText.toLowerCase().includes(filter) ? "block" : "none";
      });
    });
  }



  const provinceDropdown = document.getElementById('province-dropdown');
  const districtDropdown = document.getElementById('district-dropdown');
  const wardDropdown = document.getElementById('ward-dropdown');
  const streetDropdown = document.getElementById('street-dropdown');

  const provinceInput = document.getElementById('provinceInput');
  const districtInput = document.getElementById('districtInput');
  const wardInput = document.getElementById('wardInput');
  const streetInput = document.getElementById('streetInput');

  const provinceHidden = document.getElementById('province');
  const districtHidden = document.getElementById('district');
  const wardHidden = document.getElementById('ward');
  const streetHidden = document.getElementById('street');

  const provinceOptionsContainer = provinceDropdown.querySelector('.options');
  const districtOptionsContainer = districtDropdown.querySelector('.options');
  const wardOptionsContainer = wardDropdown.querySelector('.options');
  const streetOptionsContainer = streetDropdown.querySelector('.options');

  provinceOptionsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('option')) {
      const selectedProvince = e.target.getAttribute('data-value');
      provinceInput.value = selectedProvince;
      provinceHidden.value = selectedProvince;
      districtInput.value = wardInput.value = streetInput.value = "";
      districtHidden.value = wardHidden.value = streetHidden.value = "";
      districtOptionsContainer.innerHTML = wardOptionsContainer.innerHTML = streetOptionsContainer.innerHTML = "";
      if (provincesData[selectedProvince]) {
        loadOptions(districtOptionsContainer, Object.keys(provincesData[selectedProvince].districts));
      }
    }
  });

  districtOptionsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('option')) {
      const selectedDistrict = e.target.getAttribute('data-value');
      districtInput.value = selectedDistrict;
      districtHidden.value = selectedDistrict;
      wardInput.value = streetInput.value = "";
      wardHidden.value = streetHidden.value = "";
      wardOptionsContainer.innerHTML = streetOptionsContainer.innerHTML = "";
      const selectedProvince = provinceInput.value;
      if (provincesData[selectedProvince]?.districts[selectedDistrict]) {
        loadOptions(wardOptionsContainer, Object.keys(provincesData[selectedProvince].districts[selectedDistrict].wards));
      }
    }
  });

  wardOptionsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('option')) {
      const selectedWard = e.target.getAttribute('data-value');
      wardInput.value = selectedWard;
      wardHidden.value = selectedWard;
      streetInput.value = "";
      streetHidden.value = "";
      streetOptionsContainer.innerHTML = "";
      const selectedDistrict = districtInput.value;
      const selectedProvince = provinceInput.value;
      if (provincesData[selectedProvince]?.districts[selectedDistrict]?.wards[selectedWard]) {
        loadOptions(streetOptionsContainer, provincesData[selectedProvince].districts[selectedDistrict].wards[selectedWard]);
      }
    }
  });

  streetOptionsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('option')) {
      const selectedStreet = e.target.getAttribute('data-value');
      streetInput.value = selectedStreet;
      streetHidden.value = selectedStreet;
    }
  });



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
  // HIỂN THỊ LỊCH SỬ VI PHẠM VỚI API CỦA CHECKPHATNGUOI.VN
  ///////////////




  const inputElement = document.getElementById("signInput");
  const historyButton = document.getElementById("historyBtn");
  const historyContent = document.getElementById("history-content");

  historyButton.addEventListener("click", async function () {
    const plateNumber = inputElement.value.trim();
    if (!plateNumber) {
      alert("Vui lòng nhập biển số xe");
      return;
    }

    try {
      const response = await fetch("https://api.checkphatnguoi.vn/phatnguoi", {
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
      historyContent.innerHTML = `<p style="color: red;">Không thể lấy dữ liệu: ${error.message}</p>`;
    }
  });

  function renderHistory(data, plateNumber) {
    if (!data || typeof data !== "object") {
      historyContent.innerHTML = "<p>Không có lịch sử vi phạm.</p>";
      return;
    }

    let content = `<h2>Thông tin phạt nguội</h2>
                     <p><strong>Biển số:</strong> ${plateNumber}</p>`;

    if (data.data_info) {
      content += `<div id="summary">
              <p><strong>Tổng số vi phạm:</strong> ${data.data_info.total}</p>
              <p>Chưa xử phạt: <strong>${data.data_info.chuaxuphat}</strong>, Đã xử phạt: <strong>${data.data_info.daxuphat}</strong></p>
          </div>`;
    }

    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
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

      data.data.forEach(v => {
        content += `<tr>
                  <td>${v["Loại phương tiện"] || "N/A"}</td>
                  <td>${v["Thời gian vi phạm"] || "N/A"}</td>
                  <td>${v["Địa điểm vi phạm"] || "N/A"}</td>
                  <td>${v["Hành vi vi phạm"] || "N/A"}</td>
                  <td>${v["Trạng thái"] || "N/A"}</td>
                  <td>${v["Đơn vị phát hiện vi phạm"] || "N/A"}</td>
                  <td>${Array.isArray(v["Nơi giải quyết vụ việc"]) ? v["Nơi giải quyết vụ việc"].join(', ') : v["Nơi giải quyết vụ việc"] || "N/A"}</td>
              </tr>`;
      });
      content += `</tbody></table>`;
    } else {
      content += "<p>Không có lỗi phạt nguội nào.</p>";
    }

    historyContent.innerHTML = content;
  }



  ///////////////
  // TÍCH HỢP MAP VÀO TÍNH NĂNG ĐỊA CHỈ
  ///////////////

  //Gọi map

  const map = L.map("map-api").setView([16.0471, 108.2062], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);


  // Chọn địa chỉ phóng to đến vị trí trong map

  const apiKey = "2bseaYgwJi7Cv9CtJgPzIOFg0WLnJsMO";
  const baseUrl = "https://mapapis.openmap.vn/v1";

  // Hàm xử lý khi chọn địa chỉ
  async function updateMapView() {
    // Lấy giá trị từ các input
    const province = document.getElementById("province").value;
    const district = document.getElementById("district").value;
    const ward = document.getElementById("ward").value;
    const street = document.getElementById("street").value;

    // Tạo địa chỉ đầy đủ
    const addressParts = [street, ward, district, province, 'Vietnam'].filter(Boolean);
    const fullAddress = addressParts.join(', ');
    console.log("Full address:", fullAddress);

    // Lấy tọa độ và zoom map
    const location = await getCoordinates(fullAddress);
    console.log("Location:", location);
    if (location) {
      map.setView([location.lat, location.lng], 15);
    } else {
      console.log("Không tìm thấy tọa độ cho địa chỉ:", fullAddress);
    }
  }

  // Hàm xử lý khi click map
  function handleMapClick(e) {
    const { lat, lng } = e.latlng;
    // Cập nhật trường tọa độ
    document.getElementById("coordinate").value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    // (Optional) Cập nhật ngược địa chỉ nếu cần
    getAddress(lat, lng).then(address => {
      console.log('Địa chỉ từ tọa độ:', address);
    });
  }

  // Event listeners
  document.getElementById("province").addEventListener("change", updateMapView);
  document.getElementById("district").addEventListener("change", updateMapView);
  document.getElementById("ward").addEventListener("change", updateMapView);
  document.getElementById("street").addEventListener("change", updateMapView);
  map.on('click', handleMapClick);

  // Hàm lấy tọa độ dựa trên địa chỉ
  async function getCoordinates(address) {
    const url = `${baseUrl}/geocode/forward?address=${encodeURIComponent(address)}&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Data từ API:", data);
      return data.results?.[0]?.geometry?.location || null;
    } catch (error) {
      console.error("Lỗi geocode:", error);
      return null;
    }
  }

  // Hàm lấy địa chỉ từ tọa độ
  async function getAddress(lat, lng) {
    const url = `${baseUrl}/geocode/reverse?latlng=${lat},${lng}&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.results?.[0]?.formatted_address || 'Không xác định';
    } catch (error) {
      console.error("Lỗi reverse geocode:", error);
      return 'Lỗi kết nối';
    }
  }


});

