// ===============================
// Hiệu ứng hover cho card
// ===============================
const cards = document.querySelectorAll(".zone-card");
cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        card.style.cursor = "pointer";
    });
});
const videoModal = document.getElementById("videoModal");
const introVideo = document.getElementById("introVideo");
videoModal.addEventListener("hidden.bs.modal", function () {
    introVideo.pause();
    introVideo.currentTime = 0;
});
// ===============================
// KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
// ===============================
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
            // Nút đăng xuất
            document.getElementById("logoutBtn").addEventListener("click", function () {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                // Tải lại trang chủ
                window.location.reload();
            });
        } catch (error) {
            console.log("Không thể đọc thông tin người dùng.");
        }
    }
}
