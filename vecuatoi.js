document.addEventListener("DOMContentLoaded", function () {

    const ticketList = document.getElementById("ticketList");
    const emptyTicket = document.getElementById("emptyTicket");

    // Lấy vé đã đặt
    let tickets = JSON.parse(
        localStorage.getItem("museumTickets") || "[]"
    );

    // Không có vé
    if (tickets.length === 0) {
        ticketList.innerHTML = "";
        emptyTicket.style.display = "block";
        return;
    }

    // Có vé
    emptyTicket.style.display = "none";

    ticketList.innerHTML = "";

    tickets.forEach(function (ticket, index) {

        const quantity = ticket.totalQuantity || 1;
        const total = ticket.total || 0;

        ticketList.innerHTML += `
            <div class="my-ticket-card">

                <div class="ticket-card-header">

                    <h3>
                        <i class="bi bi-bank"></i>
                        Vé tham quan
                    </h3>

                    <span class="ticket-status">
                        ĐÃ XÁC NHẬN
                    </span>

                </div>

                <div class="ticket-card-body">

                    <div class="ticket-code">

                        <i class="bi bi-ticket-perforated"></i>

                        <div>
                            <small>MÃ VÉ</small>
                            <strong>${ticket.code}</strong>
                        </div>

                    </div>

                    <div class="ticket-info-grid">

                        <div class="ticket-info-item">
                            <i class="bi bi-bank"></i>

                            <div>
                                <small>KHU THAM QUAN</small>
                                <strong>${ticket.zone}</strong>
                            </div>
                        </div>


                        <div class="ticket-info-item">
                            <i class="bi bi-calendar3"></i>

                            <div>
                                <small>NGÀY THAM QUAN</small>
                                <strong>${formatDate(ticket.date)}</strong>
                            </div>
                        </div>


                        <div class="ticket-info-item">
                            <i class="bi bi-people"></i>

                            <div>
                                <small>SỐ LƯỢNG</small>
                                <strong>${quantity} vé</strong>
                            </div>
                        </div>


                        <div class="ticket-info-item">
                            <i class="bi bi-person"></i>

                            <div>
                                <small>NGƯỜI ĐẶT</small>
                                <strong>${ticket.name}</strong>
                            </div>
                        </div>


                        <div class="ticket-info-item">
                            <i class="bi bi-telephone"></i>

                            <div>
                                <small>SỐ ĐIỆN THOẠI</small>
                                <strong>${ticket.phone}</strong>
                            </div>
                        </div>


                        <div class="ticket-info-item">
                            <i class="bi bi-envelope"></i>

                            <div>
                                <small>EMAIL</small>
                                <strong>${ticket.email}</strong>
                            </div>
                        </div>

                    </div>

                </div>


                <div class="ticket-card-footer">

                    <div class="ticket-total">

                        <span>TỔNG TIỀN</span>

                        <strong>
                            ${total.toLocaleString("vi-VN")}đ
                        </strong>

                    </div>

                    <button
                        type="button"
                        class="delete-ticket-btn"
                        data-index="${index}">

                        <i class="bi bi-trash"></i>
                        Xóa vé

                    </button>

                </div>

            </div>
        `;

    });


    // XÓA VÉ
    document.querySelectorAll(".delete-ticket-btn").forEach(function (button) {

        button.addEventListener("click", function () {

            const index = Number(this.dataset.index);

            if (confirm("Bạn có chắc muốn xóa vé này không?")) {

                tickets.splice(index, 1);

                localStorage.setItem(
                    "museumTickets",
                    JSON.stringify(tickets)
                );

                location.reload();
            }

        });

    });

});


// Đổi ngày từ YYYY-MM-DD thành DD/MM/YYYY
function formatDate(date) {

    if (!date) {
        return "Chưa xác định";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    return parts[2] + "/" + parts[1] + "/" + parts[0];
}