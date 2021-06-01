const menuItems = document.querySelectorAll("header .links a")
if (menuItems) {
    const currentPage = location.pathname
    for (item of menuItems) {
        if (currentPage.includes(item.getAttribute("href"))) {
            item.classList.add("selected")
        }
    }
}