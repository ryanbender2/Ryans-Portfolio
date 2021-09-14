$(document).ready(() => {
    const hamburger = $(".hamburger-menu");

    hamburger.on("click", () => {
        hamburger.toggleClass("active")
    });
})

