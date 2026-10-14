const pwInput = document.getElementById('password');
const toggleBtn = document.getElementById('togglePw');
const eyeOpen = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
width="19" height="19">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
</svg>`;
const eyeClosed = toggleBtn.innerHTML;
// ===============================
// HIỆN / ẨN MẬT KHẨU
// ===============================
toggleBtn.addEventListener('click', () => {
    const showing = pwInput.type === 'text';
    pwInput.type = showing ? 'password' : 'text';
    toggleBtn.innerHTML = showing ? eyeClosed : eyeOpen;
    toggleBtn.setAttribute(
        'aria-label',
        showing ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'
    );
});
// ===============================
// FORM
// ===============================
const registerForm = document.getElementById('registerForm');
const messageBox = document.getElementById('formMessage');
// Nút đăng ký
const submitBtn = document.querySelector('.submit');
// ===============================
// HIỆU ỨNG NÚT ĐĂNG KÝ
// ===============================
submitBtn.addEventListener('click', () => {
    submitBtn.classList.remove('pop');
    void submitBtn.offsetWidth;
    submitBtn.classList.add('pop');
});
submitBtn.addEventListener('animationend', () => {
    submitBtn.classList.remove('pop');
});
// ===============================
// MỞ LỊCH NGÀY SINH
// ===============================
const dobInput = document.getElementById('dob');
const calendarBtn = document.getElementById('calendarBtn');
calendarBtn.addEventListener('click', () => {
    if (typeof dobInput.showPicker === 'function') {
        try {
            dobInput.showPicker();
        } catch (err) {
            dobInput.focus();
        }
    } else {
        dobInput.focus();
    }
});
// ===============================
// CÁC TRƯỜNG BẮT BUỘC
// ===============================
const requiredFields = [
    {
        input: document.getElementById('fullname'),
        shell: document.getElementById('fullnameShell'),
        label: 'Họ và tên'
    },
    {
        input: document.getElementById('dob'),
        shell: document.getElementById('dobShell'),
        label: 'Ngày sinh'
    },
    {
        input: document.getElementById('phone'),
        shell: document.getElementById('phoneShell'),
        label: 'Số di động'
    },
    {
        input: document.getElementById('email'),
        shell: document.getElementById('emailShell'),
        label: 'Email'
    },
    {
        input: document.getElementById('password'),
        shell: document.getElementById('passwordShell'),
        label: 'Mật khẩu'
    }
];
const genderShell = document.getElementById('genderShell');
// ===============================
// REGEX KIỂM TRA ĐỊNH DẠNG
// ===============================
const REGEX = {
    // Họ và tên: ít nhất 2 từ, chỉ gồm chữ cái (hỗ trợ tiếng Việt có dấu),
    // cho phép dấu ' hoặc - giữa các chữ cái (VD: O'Connor, Nguyễn Trần-Anh)
    fullname:
        /^[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*(?:\s+[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*)+$/u,
    // Số di động Việt Nam: 0xxxxxxxxx hoặc +84xxxxxxxxx / 84xxxxxxxxx
    // Đầu số hợp lệ: 03, 05, 07, 08, 09 (tổng 10 số)
    phone:
        /^(?:0|\+?84)[35789]\d{8}$/,
    // Email thông thường: tên@miền.đuôi
    email:
        /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/,
    // Mật khẩu: >= 8 ký tự, có chữ thường, chữ hoa, số và ký tự đặc biệt
    password:
        /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*\d)(?=.*[\p{P}\p{S}]).{8,}$/u
};
// ===============================
// ICON THÔNG BÁO
// ===============================
const iconError = `
<svg class="msg-icon"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v5"/>
    <path d="M12 16h.01"/>
</svg>`;
const iconSuccess = `
<svg class="msg-icon"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="m8 12.5 2.5 2.5L16 9.5"/>
</svg>`;
// ===============================
// XÓA LỖI
// ===============================
function clearFieldErrors() {
    requiredFields.forEach(f => {
        f.shell.classList.remove('input-error');
    });
    genderShell.classList.remove('input-error');
}
// ===============================
// HIỆN THÔNG BÁO
// ===============================
function showMessage(type, text) {
    messageBox.className =
        'form-message visible ' + type;
    messageBox.innerHTML =
        (type === 'success' ? iconSuccess : iconError)
        + '<span>' + text + '</span>';
}
// ===============================
// ẨN THÔNG BÁO
// ===============================
function hideMessage() {
    messageBox.className = 'form-message';
    messageBox.innerHTML = '';
}
// ===============================
// HIỆU ỨNG RUNG FORM
// ===============================
function shakeForm() {
    registerForm.classList.remove('shake');
    void registerForm.offsetWidth;
    registerForm.classList.add('shake');
}
// ===============================
// XỬ LÝ ĐĂNG KÝ
// ===============================
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideMessage();
    clearFieldErrors();
    // -------------------------------
    // KIỂM TRA THÔNG TIN BẮT BUỘC
    // -------------------------------
    const missing = [];
    requiredFields.forEach(f => {
        if (
            !f.input.value ||
            !f.input.value.trim()
        ) {
            f.shell.classList.add('input-error');
            missing.push(f.label);
        }
    });
    // -------------------------------
    // KIỂM TRA GIỚI TÍNH
    // -------------------------------
    const gender =
        document.querySelector(
            'input[name="gender"]:checked'
        );
    if (!gender) {
        genderShell.classList.add('input-error');
        missing.push('Giới tính');
    }
    // -------------------------------
    // NẾU THIẾU THÔNG TIN
    // -------------------------------
    if (missing.length) {
        showMessage(
            'error',
            'Vui lòng điền đầy đủ thông tin bắt buộc: '
            + missing.join(', ')
            + '.'
        );
        shakeForm();
        const firstError =
            requiredFields.find(
                f =>
                    f.shell.classList.contains('input-error')
            );
        if (firstError) {
            firstError.input.focus();
        }
        return;
    }
    // -------------------------------
    // LẤY THÔNG TIN (đã chuẩn hóa)
    // -------------------------------
    // Bỏ khoảng trắng thừa: "  Nguyễn   Văn  A " -> "Nguyễn Văn A"
    const fullname =
        document.getElementById('fullname')
        .value.trim().replace(/\s+/g, ' ');
    const dob =
        document.getElementById('dob')
        .value;
    // Bỏ khoảng trắng, dấu chấm, gạch ngang: "0912 345.678" -> "0912345678"
    const phone =
        document.getElementById('phone')
        .value.replace(/[\s.\-]/g, '');
    const email =
        document.getElementById('email')
        .value.trim();
    const password =
        pwInput.value;
    // -------------------------------
    // KIỂM TRA ĐỊNH DẠNG (REGEX)
    // -------------------------------
    const formatErrors = [];
    function checkFormat(fieldId, isValid, message) {
        if (isValid) return;
        const field =
            requiredFields.find(
                f => f.input.id === fieldId
            );
        field.shell.classList.add('input-error');
        formatErrors.push({
            field: field,
            message: message
        });
    }
    checkFormat(
        'fullname',
        REGEX.fullname.test(fullname),
        'Vui lòng nhập đầy đủ họ và tên (ít nhất 2 từ, chỉ gồm chữ cái).'
    );
    checkFormat(
        'phone',
        REGEX.phone.test(phone),
        'Số di động không hợp lệ (VD: 0912345678 hoặc +84912345678).'
    );
    checkFormat(
        'email',
        REGEX.email.test(email),
        'Email không hợp lệ (VD: ten@gmail.com).'
    );
    checkFormat(
        'password',
        REGEX.password.test(password),
        'Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.'
    );
    if (formatErrors.length) {
        showMessage(
            'error',
            formatErrors.map(err => err.message).join('<br>')
        );
        shakeForm();
        formatErrors[0].field.input.focus();
        return;
    }
    // -------------------------------
    // LẤY DANH SÁCH ACCOUNT
    // -------------------------------
    let accounts = [];
    try {
        accounts =
            JSON.parse(
                localStorage.getItem('accounts')
            ) || [];
    } catch (err) {
        accounts = [];
    }
    // -------------------------------
    // KIỂM TRA EMAIL ĐÃ TỒN TẠI
    // -------------------------------
    const emailExists =
        accounts.some(
            account =>
                account.email.toLowerCase()
                === email.toLowerCase()
        );
    if (emailExists) {
        document
            .getElementById('emailShell')
            .classList.add('input-error');
        showMessage(
            'error',
            'Email này đã được đăng ký.'
        );
        shakeForm();
        document
            .getElementById('email')
            .focus();
        return;
    }
    // -------------------------------
    // HIỆU ỨNG ĐANG ĐĂNG KÝ
    // -------------------------------
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    setTimeout(() => {
        // -------------------------------
        // TẠO ACCOUNT MỚI
        // -------------------------------
        const newAccount = {
            fullname: fullname,
            dob: dob,
            gender: gender.value,
            phone: phone,
            email: email,
            password: password
        };
        // Thêm tài khoản vào danh sách
        accounts.push(newAccount);
        // Lưu vào localStorage
        localStorage.setItem(
            'accounts',
            JSON.stringify(accounts)
        );
        // -------------------------------
        // HOÀN TẤT
        // -------------------------------
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        showMessage(
            'success',
            'Tạo tài khoản thành công! Bạn có thể đăng nhập ngay.'
        );
        // Hiệu ứng nút
        submitBtn.classList.remove('pop');
        void submitBtn.offsetWidth;
        submitBtn.classList.add('pop');
        // Xóa dữ liệu form
        registerForm.reset();
    }, 700);
});
// ===============================
// XÓA THÔNG BÁO KHI NHẬP LẠI
// ===============================
requiredFields.forEach(f => {
    f.input.addEventListener('input', () => {
        if (
            messageBox.classList.contains('error')
        ) {
            hideMessage();
            clearFieldErrors();
        }
    });
});