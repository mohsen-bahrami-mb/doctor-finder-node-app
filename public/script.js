// @ts-nocheck

/** top navbar - start */
const navbarNavLink = document.querySelectorAll(".navbar-nav .nav-link");
navbarNavLink && Array.from(navbarNavLink).forEach(tag => {
    if (location.pathname == tag.attributes.href.value)
        tag.classList.add("active");
    else tag.classList.remove("active");
});
/** top navbar - end */

/** all user search - start */
const querySearch = location.search.split("&");
document.getElementById("search-template-name") &&
    document.getElementById("search-template-name").addEventListener("input",
        (e) => querySearch["template_name"] = e.currentTarget.value);
document.getElementById("search-skip") &&
    document.getElementById("search-skip").addEventListener("input",
        (e) => querySearch["skip"] = e.currentTarget.value);
document.getElementById("search-limit") &&
    document.getElementById("search-limit").addEventListener("input",
        (e) => querySearch["limit"] = e.currentTarget.value);
document.getElementById("search-sort") &&
    document.getElementById("search-sort").addEventListener("input",
        (e) => querySearch["sort"] = e.currentTarget.value);
document.getElementById("search") &&
    document.getElementById("search").addEventListener("click", (e) => {
        let finalSearchQuery = "";
        for (let i in querySearch)
            if (i === "template_name" || i === "skip" || i === "limit" || i === "sort")
                finalSearchQuery += `${i}=${querySearch[i]}&`;
        location.search = finalSearchQuery;
    });
/** all user search - end */

/** copy On Clipboard - start */
Array.from(document.getElementsByClassName("copy-to-clipboard"))
    .forEach(element => element.addEventListener("click", (e) => {
        navigator.clipboard.writeText(e.currentTarget.attributes.copy.value);
    }));
/** copy On Clipboard - end */