const faqButtons = document.querySelectorAll(".FAQ_show_text");

faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".FAQ_card");
        const isOpen = card.classList.toggle("open");
        button.textContent = isOpen ? "−" : "+";
    });
});
