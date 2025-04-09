document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userResponse = await fetch("http://helloworld871523-001-site1.qtempurl.com/api/PN/user-info", {
      method: "GET",
      credentials: "include",
    });

    if (userResponse.ok) {
      window.location.href = "index.html";
      return;
    }
  } catch (error) {
    console.error("Lỗi kiểm tra login:", error);
  }

  const loginForm = document.querySelector("form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const phone = loginForm.querySelector('input[name="phone"]').value.trim();
    const password = loginForm.querySelector('input[name="password"]').value.trim();

    if (!phone || !password) {
      alert("Vui lòng điền đầy đủ số điện thoại và mật khẩu!");
      return;
    }

    const payload = {
      SoDienThoai: phone,
      MatKhau: password,
    };

    try {
      const response = await fetch("http://helloworld871523-001-site1.qtempurl.com/api/PN/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if(response.ok) {
        alert("Đăng nhập thành công!");
      }
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Đăng nhập thất bại!");
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 100));

      const checkUser = await fetch("http://helloworld871523-001-site1.qtempurl.com/api/PN/user-info", {
        method: "GET",
        credentials: "include",
      });

      if (checkUser.ok) {
        window.location.href = "index.html";
      } else {
        alert("Lỗi xác thực sau khi đăng nhập!");
      }


    } catch (error) {
      console.error("Lỗi trong quá trình đăng nhập:", error);
      alert("Số điện thoại hoặc mật khẩu sai");
    }
  });
});
