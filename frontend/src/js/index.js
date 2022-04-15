const linkInput = document.getElementById("urlInput");
const shortenBtn = document.getElementById("shorten");
const modalOverlay = document.getElementById("modalOverlay");

// Modals
const loginModal = document.getElementById("loginModal");
const linkModal = document.getElementById("linkModal");

const BASE_URL = "http://localhost:3000/"

function shortenLink(link) {
    const user = localStorage.getItem("UrlShortenerUserID") || "anonymous";

    fetch(BASE_URL + "create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ link, user })
    }).then(res => res.json()).then(json => {
        console.log(json);
        if (json.code === 201) {
            // Created Link
            modalOverlay.classList.remove("hidden");
            linkModal.classList.remove("hidden");
            document.getElementById("shortLink").textContent = `${BASE_URL}link/${json.linkId}`;
        } else {
            alert("Internal Server Error!");
        }
    });
}

function login() {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch(BASE_URL + "authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    }).then(res => res.json()).then(json => {
        console.log(json);
        if (json.code === 200) {
            // Login Successfull
            loginModal.classList.add("hidden");
            modalOverlay.classList.add("hidden");
            localStorage.setItem("UrlShortenerUserID", json.user);
            refreshNavLinks();
        } else if (json.code === 401) {
            document.getElementById("passwordInput").style.borderColor = "red";
            // Incorrect Password
        } else if (json.code === 404) {
            // User not found
            document.getElementById("usernameInput").style.borderColor = "red";
        } else if (json.code === 500) {
            alert("Internal Server Error!");
        }
    });
}

function register() {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch(BASE_URL + "register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    }).then(res => res.json()).then(json => {
        console.log(json);
        if (json.code === 200) {
            // Registration Successfull
            loginModal.classList.add("hidden");
            modalOverlay.classList.add("hidden");
            localStorage.setItem("UrlShortenerUserID", json.user);
            refreshNavLinks();
        } else if (json.code === 500) {
            alert("Internal Server Error!");
        }
    });
}

function logOut() {
    localStorage.removeItem("UrlShortenerUserID");
    refreshNavLinks();
}

function getUserLinks() {
    const user = localStorage.getItem("UrlShortenerUserID");

    fetch(BASE_URL + "get-user-links?username=" + user).then(res => res.json()).then(json => {
        console.log(json);
        if (json.code === 200) {
            renderLinksTable(json.links);
        } else {
            alert("Internal Server Error!");
        }
    });
}

function normalizeLoginForm() {
    document.getElementById("usernameInput").style.borderColor = "black";
    document.getElementById("passwordInput").style.borderColor = "black";
}

function openLoginModal() {
    modalOverlay.classList.remove("hidden");
    loginModal.classList.remove("hidden");
}

function copyLinkToClipboard() {
    const link = document.getElementById("shortLink").textContent;
    navigator.clipboard.writeText(link);
}

function refreshNavLinks() {
    // Check if user is logged in and change nav links...
    if (localStorage.getItem("UrlShortenerUserID")) {
        // LogOut
        document.querySelectorAll(".logged-in").forEach(item => item.classList.remove("hidden"));
        document.querySelectorAll(".logged-out").forEach(item => item.classList.add("hidden"));
    } else {
        // Sign In / Register
        document.querySelectorAll(".logged-out").forEach(item => item.classList.remove("hidden"));
        document.querySelectorAll(".logged-in").forEach(item => item.classList.add("hidden"));
    }
}

function renderLinksTable(links) {
    const linkBody = document.getElementById("linkBody");
    linkBody.textContent = "";

    links.forEach((linkObj, idx) => {
        let row = document.createElement("tr");
        row.innerHTML = `<td class="center">${idx + 1}</td><td class="center"><a href="${BASE_URL}link/${linkObj.id}" target="_blank">${linkObj.id}</a></td><td class="center"><a href="${linkObj.link}" target="_blank">${linkObj.link}</a></td><td class="center">${linkObj.visits}</td>`;
        linkBody.appendChild(row);
    });
}

window.addEventListener('DOMContentLoaded', e => {
    shortenBtn.addEventListener("click", e => {
        shortenLink(linkInput.value);
        linkInput.value = "";
    });

    // modalOverlay.addEventListener("click", e => {
    //     // Close all modals
    //     e.stopPropagation();
    //     document.querySelectorAll(".modal").forEach(modal => {
    //         if (!modal.classList.contains("hidden")) {
    //             modal.classList.add("hidden");
    //         }
    //         modalOverlay.classList.add("hidden");
    //     });
    // });

    document.querySelectorAll(".modal>.close-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            const modalID = e.target.dataset.modal;
            document.getElementById(modalID).classList.add("hidden");
            modalOverlay.classList.add("hidden");
        });
    })

    // Nav Links
    document.querySelectorAll(".loginLink").forEach(link => {
        link.addEventListener("click", e => {
            openLoginModal();
        });
    });

    // Login & Register Buttons
    document.getElementById("loginBtn").addEventListener("click", e => {
        normalizeLoginForm();
        login();
    });
    document.getElementById("registerBtn").addEventListener("click", e => {
        normalizeLoginForm();
        register();
    });

    document.getElementById("logoutBtn").addEventListener("click", logOut);
    document.getElementById("myLinks").addEventListener("click", e => {
        document.getElementById("mainPage").classList.add("hidden");
        document.getElementById("linkPage").classList.remove("hidden");
        getUserLinks();
    });

    document.getElementById("homeLink").addEventListener("click", e => {
        document.getElementById("linkPage").classList.add("hidden");
        document.getElementById("mainPage").classList.remove("hidden");
    });

    document.getElementById("copyToClipboardBtn").addEventListener("click", copyLinkToClipboard);

    refreshNavLinks();
});