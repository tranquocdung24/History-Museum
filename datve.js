// ==========================================
// ĐẶT VÉ BẢO TÀNG LỊCH SỬ
// ==========================================
// ==========================================
// 1. KIỂM TRA ĐĂNG NHẬP
// ==========================================
const isLoggedIn = localStorage.getItem("isLoggedIn");
const currentUser = localStorage.getItem("currentUser");
if (isLoggedIn !== "true" || !currentUser) {
    localStorage.setItem(
        "bookingReturnUrl",
        "datve.html"
    );
    alert("Bạn cần đăng nhập tài khoản trước khi đặt vé.");
    window.location.href = "dangnhap.html";
} else {
    // ==========================================
    // 2. DỮ LIỆU ĐẶT VÉ
    // ==========================================
    let booking = {
        zone: "",
        date: "",
        tickets: {
            child: 0,
            student: 0,
            adult: 0,
            special: 0
        },
        name: "",
        phone: "",
        email: "",
        code: ""
    };
    // Giá vé
    const ticketPrices = {
        child: 0,
        student: 40000,
        adult: 50000,
        special: 0
    };
    // Tên loại vé
    const ticketNames = {
        child: "Trẻ em dưới 5 tuổi",
        student: "Học sinh / Sinh viên",
        adult: "Người lớn",
        special: "Người có công / Thương binh / Liệt sĩ"
    };
    // ==========================================
    // 3. LẤY CÁC ELEMENT
    // ==========================================
    const zoneCards =
        document.querySelectorAll(".zone-card");
    const ticketRows =
        document.querySelectorAll(".ticket-type-row");
    const progressSteps =
        document.querySelectorAll(".progress-step");
    const bookingSteps =
        document.querySelectorAll(".booking-step");
    const visitDate =
        document.getElementById("visitDate");
    const customerName =
        document.getElementById("customerName");
    const customerPhone =
        document.getElementById("customerPhone");
    const customerEmail =
        document.getElementById("customerEmail");
    const userArea =
        document.getElementById("userArea");
    // ==========================================
    // 4. LẤY THÔNG TIN TÀI KHOẢN
    // ==========================================
    let user = null;
    try {
        user = JSON.parse(currentUser);
    } catch (error) {
        user = null;
    }
    if (user) {
        booking.name =
            user.fullname || "";
        booking.phone =
            user.phone || "";
        booking.email =
            user.email || "";
        customerName.value =
            booking.name;
        customerPhone.value =
            booking.phone;
        customerEmail.value =
            booking.email;
        userArea.innerHTML = `
            <div class="user-info">
                <i class="bi bi-person-circle"></i>
                <span>
                    ${escapeHtml(user.fullname || "Tài khoản")}
                </span>
            </div>
            <button
                type="button"
                class="btn-logout"
                id="logoutBtn">
                Đăng xuất
            </button>
        `;
        document
            .getElementById("logoutBtn")
            .addEventListener("click", function () {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("currentUser");
                window.location.href =
                    "index.html";
            });
    }
    // ==========================================
    // 5. HIỂN THỊ STEP
    // ==========================================
    function showStep(number) {
        bookingSteps.forEach(step => {
            step.classList.remove("active");
        });
        let target;
        if (number === 5) {
            target =
                document.getElementById("successStep");
        } else {
            target =
                document.getElementById(
                    "step" + number
                );
        }
        if (target) {
            target.classList.add("active");
        }
        progressSteps.forEach(step => {
            const stepNumber =
                Number(step.dataset.step);
            step.classList.remove(
                "active",
                "completed"
            );
            if (stepNumber === number) {
                step.classList.add("active");
            }
            if (stepNumber < number) {
                step.classList.add("completed");
            }
        });
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    // ==========================================
    // 6. CHỌN KHU
    // ==========================================
    zoneCards.forEach(card => {
        card.addEventListener(
            "click",
            function () {
                // Bỏ chọn khu cũ
                zoneCards.forEach(item => {
                    item.classList.remove(
                        "selected"
                    );
                });
                // Chọn khu hiện tại
                this.classList.add(
                    "selected"
                );
                // Lưu khu
                booking.zone =
                    this.dataset.zone;
                // Cập nhật bảng bên phải
                updateSummary();
            }
        );
    });
    // ==========================================
    // 7. CHỌN NGÀY
    // ==========================================
    const now = new Date();
    const year =
        now.getFullYear();
    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");
    const day =
        String(now.getDate())
            .padStart(2, "0");
    const today =
        `${year}-${month}-${day}`;
    visitDate.min =
        today;
    visitDate.addEventListener(
        "change",
        function () {
            booking.date =
                this.value;
            updateSummary();
        }
    );
    // ==========================================
    // 8. NÚT + / -
    // ==========================================
    ticketRows.forEach(row => {
        const type =
            row.dataset.type;
        const minus =
            row.querySelector(".minus");
        const plus =
            row.querySelector(".plus");
        const quantity =
            row.querySelector(".quantity");
        plus.addEventListener(
            "click",
            function () {
                booking.tickets[type]++;
                quantity.textContent =
                    booking.tickets[type];
                updateSummary();
            }
        );
        minus.addEventListener(
            "click",
            function () {
                if (
                    booking.tickets[type] > 0
                ) {
                    booking.tickets[type]--;
                    quantity.textContent =
                        booking.tickets[type];
                    updateSummary();
                }
            }
        );
    });
    // ==========================================
    // 9. TỔNG SỐ VÉ
    // ==========================================
    function getTotalQuantity() {
        return (
            booking.tickets.child +
            booking.tickets.student +
            booking.tickets.adult +
            booking.tickets.special
        );
    }
    // ==========================================
    // 10. TỔNG TIỀN
    // ==========================================
    function getTotalPrice() {
        return (
            booking.tickets.child *
            ticketPrices.child
            +
            booking.tickets.student *
            ticketPrices.student
            +
            booking.tickets.adult *
            ticketPrices.adult
            +
            booking.tickets.special *
            ticketPrices.special
        );
    }
    // ==========================================
    // 11. FORMAT TIỀN
    // ==========================================
    function formatMoney(number) {
        return number.toLocaleString("vi-VN")
            + "đ";
    }
    // ==========================================
    // 12. UPDATE SUMMARY
    // ==========================================
    function updateSummary() {
        document.getElementById(
            "summaryZone"
        ).textContent =
            booking.zone ||
            "Chưa chọn";
        document.getElementById(
            "summaryDate"
        ).textContent =
            booking.date
                ? formatDate(booking.date)
                : "Chưa chọn";
        document.getElementById(
            "summaryQuantity"
        ).textContent =
            getTotalQuantity();
        document.getElementById(
            "summaryName"
        ).textContent =
            booking.name ||
            "—";
        const summaryTickets =
            document.getElementById(
                "summaryTickets"
            );
        let html = "";
        Object.keys(
            booking.tickets
        ).forEach(type => {
            const quantity =
                booking.tickets[type];
            if (quantity > 0) {
                html += `
                    <div class="summary-ticket-line">
                        <span>
                            ${ticketNames[type]}
                            × ${quantity}
                        </span>
                        <strong>
                            ${formatMoney(
                                ticketPrices[type] *
                                quantity
                            )}
                        </strong>
                    </div>
                `;
            }
        });
        summaryTickets.innerHTML =
            html || "Chưa chọn vé";
        document.getElementById(
            "summaryTotal"
        ).textContent =
            formatMoney(
                getTotalPrice()
            );
    }
    // ==========================================
    // 13. STEP 1 → STEP 2
    // ==========================================
    document
        .getElementById("nextStep1")
        .addEventListener(
            "click",
            function () {
                if (!booking.zone) {
                    alert(
                        "Vui lòng chọn khu tham quan."
                    );
                    return;
                }
                showStep(2);
            }
        );
    // ==========================================
    // 14. STEP 2 → STEP 3
    // ==========================================
    document
        .getElementById("nextStep2")
        .addEventListener(
            "click",
            function () {
                if (!booking.date) {
                    alert(
                        "Vui lòng chọn ngày tham quan."
                    );
                    return;
                }
                if (getTotalQuantity() === 0) {
                    alert(
                        "Vui lòng chọn ít nhất 1 vé."
                    );
                    return;
                }
                showStep(3);
            }
        );
    // ==========================================
    // 15. STEP 2 → STEP 1
    // ==========================================
    document
        .getElementById("backStep2")
        .addEventListener(
            "click",
            function () {
                showStep(1);
            }
        );
    // ==========================================
    // 16. STEP 3 → STEP 2
    // ==========================================
    document
        .getElementById("backStep3")
        .addEventListener(
            "click",
            function () {
                showStep(2);
            }
        );
    // ==========================================
    // 17. STEP 3 → STEP 4
    // ==========================================
    document
        .getElementById("nextStep3")
        .addEventListener(
            "click",
            function () {
                booking.name =
                    customerName.value.trim();
                booking.phone =
                    customerPhone.value.trim();
                booking.email =
                    customerEmail.value.trim();
                if (!booking.name) {
                    alert(
                        "Vui lòng nhập họ và tên."
                    );
                    customerName.focus();
                    return;
                }
                if (!booking.phone) {
                    alert(
                        "Vui lòng nhập số điện thoại."
                    );
                    customerPhone.focus();
                    return;
                }
                if (!/^0\d{9,10}$/.test(
                    booking.phone
                )) {
                    alert(
                        "Số điện thoại không hợp lệ."
                    );
                    customerPhone.focus();
                    return;
                }
                if (!booking.email) {
                    alert(
                        "Vui lòng nhập email."
                    );
                    customerEmail.focus();
                    return;
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    booking.email
                )) {
                    alert(
                        "Email không hợp lệ."
                    );
                    customerEmail.focus();
                    return;
                }
                updateConfirm();
                showStep(4);
            }
        );
    // ==========================================
    // 18. STEP 4 → STEP 3
    // ==========================================
    document
        .getElementById("backStep4")
        .addEventListener(
            "click",
            function () {
                showStep(3);
            }
        );
    // ==========================================
    // 19. UPDATE XÁC NHẬN
    // ==========================================
    function updateConfirm() {
        document.getElementById(
            "confirmZone"
        ).textContent =
            booking.zone;
        document.getElementById(
            "confirmDate"
        ).textContent =
            formatDate(booking.date);
        document.getElementById(
            "confirmQuantity"
        ).textContent =
            getTotalQuantity() + " vé";
        document.getElementById(
            "confirmName"
        ).textContent =
            booking.name;
        const confirmTickets =
            document.getElementById(
                "confirmTickets"
            );
        let html = "";
        Object.keys(
            booking.tickets
        ).forEach(type => {
            const quantity =
                booking.tickets[type];
            if (quantity > 0) {
                html += `
                    <div class="confirm-ticket-line">
                        <span>
                            ${ticketNames[type]}
                            × ${quantity}
                        </span>
                        <strong>
                            ${formatMoney(
                                ticketPrices[type] *
                                quantity
                            )}
                        </strong>
                    </div>
                `;
            }
        });
        confirmTickets.innerHTML =
            html;
        document.getElementById(
            "confirmTotal"
        ).textContent =
            formatMoney(
                getTotalPrice()
            );
    }
    // ==========================================
    // 20. XÁC NHẬN ĐẶT VÉ
    // ==========================================
    document
        .getElementById("confirmBooking")
        .addEventListener(
            "click",
            function () {
                const code =
                    "HSM-" +
                    Math.floor(
                        100000 +
                        Math.random() * 900000
                    );
                booking.code =
                    code;
                const ticket = {
                    code: booking.code,
                    zone: booking.zone,
                    date: booking.date,
                    tickets: {
                        ...booking.tickets
                    },
                    ticketNames: {
                        ...ticketNames
                    },
                    ticketPrices: {
                        ...ticketPrices
                    },
                    totalQuantity:
                        getTotalQuantity(),
                    total:
                        getTotalPrice(),
                    name:
                        booking.name,
                    phone:
                        booking.phone,
                    email:
                        booking.email,
                    createdAt:
                        new Date().toISOString()
                };
                let tickets = [];
                try {
                    tickets =
                        JSON.parse(
                            localStorage.getItem(
                                "museumTickets"
                            )
                        ) || [];
                } catch (error) {
                    tickets = [];
                }
                tickets.push(ticket);
                localStorage.setItem(
                    "museumTickets",
                    JSON.stringify(tickets)
                );
                localStorage.setItem(
                    "lastTicket",
                    JSON.stringify(ticket)
                );
                showSuccess(ticket);
            }
        );
    // ==========================================
    // 21. THÀNH CÔNG
    // ==========================================
    function showSuccess(ticket) {
        document.getElementById(
            "ticketCode"
        ).textContent =
            ticket.code;
        document.getElementById(
            "successDate"
        ).textContent =
            formatDate(ticket.date);
        document.getElementById(
            "successTicket"
        ).textContent =
            ticket.totalQuantity +
            " vé • " +
            formatMoney(ticket.total);
        showStep(5);
    }
    // ==========================================
    // 22. ĐẶT VÉ KHÁC
    // ==========================================
    document
        .getElementById("newBooking")
        .addEventListener(
            "click",
            function () {
                booking.zone = "";
                booking.date = "";
                booking.tickets = {
                    child: 0,
                    student: 0,
                    adult: 0,
                    special: 0
                };
                visitDate.value = "";
                ticketRows.forEach(row => {
                    row.querySelector(
                        ".quantity"
                    ).textContent = "0";
                });
                zoneCards.forEach(card => {
                    card.classList.remove(
                        "selected"
                    );
                });
                updateSummary();
                showStep(1);
            }
        );
    // ==========================================
    // 23. FORMAT NGÀY
    // ==========================================
    function formatDate(dateString) {
        if (!dateString) {
            return "—";
        }
        const parts =
            dateString.split("-");
        if (parts.length !== 3) {
            return dateString;
        }
        return (
            parts[2] +
            "/" +
            parts[1] +
            "/" +
            parts[0]
        );
    }
    // ==========================================
    // 24. CHỐNG HTML
    // ==========================================
    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    // ==========================================
    // 25. KHỞI TẠO
    // ==========================================
    updateSummary();
    showStep(1);
}