async function fetchUserInfo() {
  try {
      const response = await fetch('https://dark-sun-4780.trancuop8.workers.dev/api/PN/user-info', {
          method: 'GET',
          credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok || data.message === "Chưa đăng nhập") {
          document.getElementById('name').value = "GUEST";
          document.getElementById('phone').value = "GUEST";
          document.getElementById('position').value = "GUEST";
          document.getElementById('branch').value = "GUEST";
      } else {
          document.getElementById('name').value = data.tenCongAn;
          document.getElementById('phone').value = data.soDienThoai;
          document.getElementById('position').value = data.chucVu;
          document.getElementById('branch').value = data.chiNhanh;
      }
  } catch (error) {
      console.error('Lỗi khi gọi API:', error);
  }
}

window.onload = fetchUserInfo;