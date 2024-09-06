const sidebar = document.getElementById("sidebar");
const navbar = document.getElementById("navbar");
const mainContainer = document.getElementById("main-container");
const sidebarItems = document.querySelectorAll(".fs-sidebar");
const sidebarTexts = document.querySelectorAll(".sidebar-nav-text");
const sidebarIcons = document.querySelectorAll(".sidebar-icons");
const sidebarUl = document.querySelector(".sidebar-ul");
const sidebarLi = document.querySelectorAll(".sidebar-li");
const sidebarA = document.querySelectorAll(".sidebar-a");
const sidebarCard = document.getElementById("sidebar-card");

let isSidebaropen = false;
let isMobileSidebaropen = false;

mainContainer.style.marginLeft = "92px"

sidebarTexts.forEach((sidebarText) => {
    sidebarText.style.display = "none"
})

sidebarUl.classList.add("p-3");

sidebarA.forEach((a) => {
    a.classList.add("justify-content-center");
})

sidebarCard.style.display = "none";

sidebar.classList.add("position-fixed");

window.onload = () => {
    const setSidebarHeight = () => {
        var mainContainerHeight = mainContainer.scrollHeight;
        sidebar.style.height = mainContainerHeight + 'px';
    }

    setSidebarHeight();

    window.addEventListener('resize', setSidebarHeight);
};

const openSidebar = () => {
    if (!isSidebaropen) {
        sidebarTexts.forEach((sidebarText) => {
            sidebarText.style.display = "block";
        })
        sidebarIcons.forEach((sidebarIcon) => {
            sidebarIcon.style.marginRight = "20px"
        })
        sidebarUl.classList.add("px-5");
        sidebarUl.classList.add("py-3");

        sidebarUl.classList.remove("p-3");

        sidebarA.forEach((a) => {
            a.classList.remove("justify-content-center");
        })
        sidebarCard.style.display = "block";
        mainContainer.style.marginLeft = "334px"

        sidebar.classList.remove("position-fixed");
        sidebar.classList.add("position-absolute");
        if (window.innerWidth < 991) {
            navbar.classList.remove("justify-content-between");
            navbar.classList.add("justify-content-center");
        }
        isSidebaropen = true
    } else {
        sidebarTexts.forEach((sidebarText) => {
            sidebarText.style.display = "none";
        })
        sidebarIcons.forEach((sidebarIcon) => {
            sidebarIcon.style.marginRight = "0"
        })
        sidebarUl.classList.add("p-3");
        sidebarUl.classList.remove("px-5");
        sidebarUl.classList.remove("py-3");

        sidebarA.forEach((a) => {
            a.classList.add("justify-content-center");
        })
        sidebarCard.style.display = "none";
        mainContainer.style.marginLeft = "92px"

        sidebar.classList.remove("position-absolute");
        sidebar.classList.add("position-fixed");
        if (window.innerWidth < 991) {
            navbar.classList.add("justify-content-between");
            navbar.classList.remove("justify-content-center");
        }

        isSidebaropen = false
    }
    console.log(isSidebaropen)
}

const openSidebarMobile = () => {
    if (!isMobileSidebaropen) {
        sidebar.style.left = "0"
        mainContainer.style.paddingLeft = "92px"
        isMobileSidebaropen = true
    } else {
        sidebar.style.left = "-92px"
        mainContainer.style.paddingLeft = "0"
        isMobileSidebaropen = false
    }
}

function attachClickHandler() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) {
        // ! mobile view

        // when resized, close both the sidebars
        if (isSidebaropen) {
            openSidebar()
        }
        if (isMobileSidebaropen) {
            openSidebarMobile();
        }

        sidebar.style.left = "-92px"
        mainContainer.style.marginLeft = "0"
        document.getElementById("mobile-btn").onclick = openSidebarMobile;
    } else {
        // ! pc view

        // when resized, close both the sidebars
        if (isMobileSidebaropen) {
            openSidebarMobile();
        }
        if (isSidebaropen) {
            openSidebar()
        }

        sidebar.style.left = "0"
        mainContainer.style.marginLeft = "92px"
        document.getElementById("pc-btn").onclick = openSidebar;
    }
}

attachClickHandler();

window.addEventListener('resize', attachClickHandler);