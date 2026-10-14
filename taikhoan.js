const userArea = document.getElementById("userArea");
if (userArea) {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const currentUser = localStorage.getItem("currentUser");
    if (isLoggedIn === "true" && currentUser) {
        try {
            const user = JSON.parse(currentUser);
            userArea.innerHTML = `
                <div class="user-info">
                    <i class="bi bi-person-circle"></i>
                    <span>${user.fullname}</span>
                </div>
                <button type="button" class="btn-logout" id="logoutBtn">
                    Đăng xuất
                </button>
            `;
            document.getElementById("logoutBtn").addEventListener("click", function () {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                window.location.href = "index.html";
            });
        } catch (error) {
            console.log("Không thể đọc thông tin người dùng.");
        }
    }
}
