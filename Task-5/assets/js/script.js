const overlayCards = document.querySelectorAll(".overlay-card");
const marketingCards = document.querySelectorAll(".marketing-card");

function attachClickHandler() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 372) {
        overlayCards.forEach(card => {
            card.classList.remove("h5");
            card.classList.add("h6");
        })
        marketingCards.forEach(card => {
            card.style.width = "80%"
            card.style.height = "160px"
            card.style.left = "10%"
        })
    } else {
        overlayCards.forEach(card => {
            card.classList.add("h5");
            card.classList.remove("h6");
        })
        marketingCards.forEach(card => {
            card.style.width = "85%"
            card.style.height = "175px"
            card.style.left = "8%"
        })
    }
}

attachClickHandler();

window.addEventListener('resize', attachClickHandler);