const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name =
        document.getElementById("name").value.trim();
    const email =
        document.getElementById("email").value.trim();
    const subject =
        document.getElementById("subject").value.trim();
    const message =
        document.getElementById("message").value.trim();
    if (!name || !email || !subject || !message) {
        formMessage.textContent =
            "Vui lòng điền đầy đủ thông tin.";
        formMessage.style.color =
            "#a30d14";
        return;
    }
    formMessage.textContent =
        "Cảm ơn bạn! Tin nhắn đã được ghi nhận.";
    formMessage.style.color =
        "green";
    contactForm.reset();
});