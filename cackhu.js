// XEM THÊM
document.getElementById('toggleArtifacts').addEventListener('click', function (e) {
  e.preventDefault();
  var extra = document.getElementById('artifactsExtra');
  var text = document.getElementById('toggleArtifactsText');
  var icon = document.getElementById('toggleArtifactsIcon');
  var dangAn = extra.classList.contains('extra-hidden');

  if (dangAn) {
    extra.classList.remove('extra-hidden');
    text.textContent = 'Thu gọn';
    icon.classList.add('rotate');
  } else {
    extra.classList.add('extra-hidden');
    text.textContent = 'Xem thêm';
    icon.classList.remove('rotate');
  }
});


document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('artifactModal');
  var closeBtn = document.getElementById('artifactModalClose');
  var modalTitle = document.getElementById('modalTitle');
  var modalPeriod = document.getElementById('modalPeriod');
  var modalDesc = document.getElementById('modalDesc');
  var modalImg = document.getElementById('modalImg');

  if (!overlay) return;

  function openModal(card) {
    var title = card.getAttribute('data-title') || '';
    var period = card.getAttribute('data-period') || '';
    var desc = card.getAttribute('data-desc') || '';
    var img = card.getAttribute('data-img') || '';

    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalImg.src = img;
    modalImg.alt = title;

    if (period) {
      modalPeriod.textContent = period;
      modalPeriod.style.display = 'inline-flex';
    } else {
      modalPeriod.style.display = 'none';
    }

    overlay.classList.add('show');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    overlay.classList.remove('show');
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('click', function (e) {
    var card = e.target.closest('.artifact-card');
    if (card) {
      openModal(card);
    }
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('show')) {
      closeModal();
    }
  });
});
// ===============================
// HIỂN THỊ TÀI KHOẢN ĐĂNG NHẬP
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