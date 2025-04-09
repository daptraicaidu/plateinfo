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


///////////////
// GỌI MAP VÀ GỌI API THONGKE
///////////////


var map; 
var markers = []; // Danh sách marker để xóa trước khi vẽ mới

document.addEventListener("DOMContentLoaded", function () {
  // Tạo bản đồ nếu chưa có
  map = L.map("map", {
    fullscreenControl: true
  }).setView([21.028511, 105.804817], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);
});

async function fetchThongKe() {
  

  const loaiPhuongTien = document.getElementById('loaiPhuongTien').value;
  const diaDiem = document.getElementById('diaDiem').value;
  const hanhVi = document.getElementById('hanhVi').value;
  const year = document.getElementById('year').value;
  const month = document.getElementById('month').value;
  const day = document.getElementById('day').value;

  const queryParams = new URLSearchParams({
    loaiPhuongTien, diaDiem, hanhVi, year, month, day
  }).toString();

  try {
    const response = await fetch(`http://helloworld871523-001-site1.qtempurl.com/api/viphamgt/thongke?${queryParams}`, {
      method: "GET",
      credentials: "include", // 🔥 Quan trọng: Đảm bảo session được gửi lên BE
    });
    
    const data = await response.json();

    // Xóa các marker cũ trên bản đồ trước khi vẽ mới
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    let dataBody = document.getElementById('dataBody');
    if (!dataBody) {
      console.error("Không tìm thấy phần tử #dataBody");
      return;
    }
    dataBody.innerHTML = ''; // Xóa dữ liệu cũ

    let table = `
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Biển kiểm soát</th>
                        <th>Loại phương tiện</th>
                        <th>Thời gian</th>
                        <th>Địa điểm</th>
                        <th>Hành vi</th>
                    </tr>
                </thead>
                <tbody>
        `;

    if (!data.chiTiet || data.chiTiet.length === 0) {
      table += `<tr><td colspan="5">Không có dữ liệu</td></tr>`;
    } else {
      data.chiTiet.forEach(item => {
        table += `
                    <tr>
                        <td>${item.bienKiemSoat || "N/A"}</td>                    
                        <td>${item.loaiPhuongTien || "N/A"}</td>
                        <td>${item.thoiGian || "N/A"}</td>
                        <td>${item.diaDiem || "N/A"}</td>
                        <td>${item.hanhVi || "N/A"}</td>
                    </tr>
                `;

        // Vẽ marker nếu có tọa độ
        if (item.toaDo) {
          const [lat, lng] = item.toaDo.split(",").map(coord => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            let marker = L.marker([lat, lng]).addTo(map)
              .bindPopup(`
                                <b>${item.bienKiemSoat || "N/A"}</b><br>
                                ${item.loaiPhuongTien || "N/A"}<br>
                                ${item.diaDiem || "N/A"}<br>
                                ${item.hanhVi || "N/A"}
                            `);
            markers.push(marker);
          }
        }
      });
    }

    table += `</tbody></table>`;
    dataBody.innerHTML = table;

  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu:", error);
  }
}
