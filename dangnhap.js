const loginForm = document.getElementById('loginForm');
const identifierInput = document.getElementById('identifier');
const pwInput = document.getElementById('password');
const toggleBtn = document.getElementById('togglePw');
const messageBox = document.getElementById('formMessage');
const submitBtn = document.querySelector('.submit');
// =====================================
// HIỆN / ẨN MẬT KHẨU
// =====================================
const eyeOpen = `
<svg viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="1.8"
     stroke-linecap="round"
     stroke-linejoin="round"
     width="19"
     height="19">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
</svg>
`;
const eyeClosed = toggleBtn.innerHTML;
toggleBtn.addEventListener('click', () => {
    const showing = pwInput.type === 'text';
    pwInput.type = showing ? 'password' : 'text';
    toggleBtn.innerHTML =
        showing ? eyeClosed : eyeOpen;
    toggleBtn.setAttribute(
        'aria-label',
        showing ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'
    );
});
// =====================================
// HIỆN THÔNG BÁO
// =====================================
function showMessage(type, text) {
    messageBox.className =
        'form-message visible ' + type;
    messageBox.innerHTML =
        `<span>${text}</span>`;
}
// =====================================
// ẨN THÔNG BÁO
// =====================================
function hideMessage() {
    messageBox.className = 'form-message';
    messageBox.innerHTML = '';
}
// =====================================
// HIỆU ỨNG RUNG
// =====================================
function shakeForm() {
    loginForm.classList.remove('shake');
    void loginForm.offsetWidth;
    loginForm.classList.add('shake');
}
// =====================================
// ĐĂNG NHẬP
// =====================================
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    hideMessage();
    const identifier =
        identifierInput.value.trim();
    const password =
        pwInput.value;
    // -------------------------------
    // KIỂM TRA BỎ TRỐNG
    // -------------------------------
    if (!identifier || !password) {
        showMessage(
            'error',
            'Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu.'
        );
        shakeForm();
        return;
    }
    // -------------------------------
    // LẤY ACCOUNTS ĐÃ ĐĂNG KÝ
    // -------------------------------
    let accounts = [];
    try {
        accounts =
            JSON.parse(
                localStorage.getItem('accounts')
            ) || [];
    } catch (error) {
        accounts = [];
    }
    // -------------------------------
    // CHƯA CÓ TÀI KHOẢN
    // -------------------------------
    if (accounts.length === 0) {
        showMessage(
            'error',
            'Chưa có tài khoản. Vui lòng đăng ký trước.'
        );
        shakeForm();
        return;
    }
    // -------------------------------
    // TÌM TÀI KHOẢN
    // EMAIL HOẶC SỐ ĐIỆN THOẠI
    // -------------------------------
    const account = accounts.find(function (user) {
        const emailMatch =
            user.email &&
            user.email.toLowerCase() ===
            identifier.toLowerCase();
        const phoneMatch =
            user.phone &&
            user.phone === identifier;
        return (
            (emailMatch || phoneMatch) &&
            user.password === password
        );
    });
    // -------------------------------
    // ĐĂNG NHẬP THÀNH CÔNG
    // -------------------------------
    if (account) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        showMessage(
            'success',
            'Đăng nhập thành công! Đang chuyển về trang chủ...'
        );
        // Lưu trạng thái đăng nhập
        localStorage.setItem(
            'isLoggedIn',
            'true'
        );
        // Lưu thông tin người đang đăng nhập
        localStorage.setItem(
            'currentUser',
            JSON.stringify(account)
        );
        // Chuyển về trang chủ
        setTimeout(function () {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        // -------------------------------
        // ĐĂNG NHẬP SAI
        // -------------------------------
        showMessage(
            'error',
            'Email/số điện thoại hoặc mật khẩu không đúng.'
        );
        shakeForm();
    }
});
// =====================================
// HIỆU ỨNG NÚT
// =====================================
submitBtn.addEventListener('click', () => {
    submitBtn.classList.remove('pop');
    void submitBtn.offsetWidth;
    submitBtn.classList.add('pop');
});
submitBtn.addEventListener(
    'animationend',
    () => {
        submitBtn.classList.remove('pop');
    }
);