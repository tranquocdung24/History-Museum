var zoneItems = document.querySelectorAll('#zoneGrid .zone-item');
var searchInput = document.getElementById('searchInput');
var themeFilter = document.getElementById('themeFilter');
var floorFilter = document.getElementById('floorFilter');
var filterBtn = document.getElementById('filterBtn');
var resultCountNum = document.getElementById('resultCountNum');
var noResults = document.getElementById('noResults');
var zoneGrid = document.getElementById('zoneGrid');

function applyFilters() {
  var tuKhoa = searchInput.value.trim();
  var chuDe = themeFilter.value;
  var khuVuc = floorFilter.value;
  var soKetQua = 0;

  zoneItems.forEach(function (item) {
    var ten = item.getAttribute('data-name');
    var theme = item.getAttribute('data-theme');
    var floor = item.getAttribute('data-floor');

    var khopTen = tuKhoa === '' || ten.indexOf(tuKhoa) !== -1;
    var khopChuDe = chuDe === '' || theme === chuDe;
    var khopKhuVuc = khuVuc === '' || floor === khuVuc;

    if (khopTen && khopChuDe && khopKhuVuc) {
      item.style.display = '';
      soKetQua++;
    } else {
      item.style.display = 'none';
    }
  });

  resultCountNum.textContent = soKetQua;
  noResults.style.display = soKetQua === 0 ? 'block' : 'none';
  zoneGrid.style.display = soKetQua === 0 ? 'none' : 'flex';
}

filterBtn.addEventListener('click', applyFilters);

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

if (videoModal && introVideo) {
    videoModal.addEventListener("hidden.bs.modal", function () {
        introVideo.pause();
        introVideo.currentTime = 0;
    });
}

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
