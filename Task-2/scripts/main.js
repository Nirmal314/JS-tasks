// ! cc1

const cc1 = document.getElementById("cc1-container");
cc1.addEventListener("mouseover", () => {
    document.getElementById("cc1-content").style.opacity = "93%"
})
cc1.addEventListener("mouseout", () => {
    document.getElementById("cc1-content").style.opacity = "0"
})

// ! cc2

const cc2 = document.getElementById("cc2-container");
cc2.addEventListener("mouseover", () => {
    document.getElementById("cc2-content").style.opacity = "93%"
})
cc2.addEventListener("mouseout", () => {
    document.getElementById("cc2-content").style.opacity = "0"
})

// ! cc3

const cc3 = document.getElementById("cc3-container");
cc3.addEventListener("mouseover", () => {
    document.getElementById("cc3-content").style.opacity = "93%"
})
cc3.addEventListener("mouseout", () => {
    document.getElementById("cc3-content").style.opacity = "0"
})

// ! toggle button

const monthlyBtn = document.getElementById('monthlyBtn');
const yearlyBtn = document.getElementById('yearlyBtn');
const slider = document.querySelector('.slider');

monthlyBtn.style.color = "#fff"
yearlyBtn.style.color = "#627065"

monthlyBtn.addEventListener('click', () => {
    slider.style.transform = 'translateX(0)';
    monthlyBtn.style.color = "#fff"
    yearlyBtn.style.color = "#627065"
    document.getElementById("pro-price").innerHTML = "20"
    document.getElementById("business-price").innerHTML = "100"
    document.getElementById("pro-per-duration").innerHTML = "/ month"
    document.getElementById("business-per-duration").innerHTML = "/ month"
});

yearlyBtn.addEventListener('click', () => {
    slider.style.transform = 'translateX(108%)';
    monthlyBtn.style.color = "#627065"
    yearlyBtn.style.color = "#fff"
    document.getElementById("pro-price").innerHTML = "200"
    document.getElementById("business-price").innerHTML = "1000"
    document.getElementById("pro-per-duration").innerHTML = "/ year"
    document.getElementById("business-per-duration").innerHTML = "/ year"
});