// ==========================================
// NEXORA - SCRIPT.JS
// ==========================================


// ==========================================
// 1. SELECT ELEMENTS
// ==========================================

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

const searchInput = document.getElementById("searchInput");

const cartBtn = document.getElementById("cartBtn");
const cartCountElement = document.getElementById("cartCount");

const accountBtn = document.getElementById("accountBtn");
const navWishlistBtn = document.getElementById("navWishlistBtn");

const joinBtn = document.getElementById("joinBtn");

const newsletterForm = document.getElementById("newsletterForm");
const emailInput = document.getElementById("emailInput");

const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");
const wishlistButtons = document.querySelectorAll(".wishlist-btn");
const quickAddButtons = document.querySelectorAll(".quick-add");

const navLinks = document.querySelectorAll(".nav-links a");
const mobileLinks = document.querySelectorAll(".mobile-menu a");


// ==========================================
// 2. CART
// ==========================================

let cartCount = 0;


// Update cart number

function updateCartCount() {

    cartCountElement.innerText = cartCount;

}


// Quick Add buttons

quickAddButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        cartCount++;

        updateCartCount();

        const originalText = button.innerText;

        button.innerText = "Added ✓";

        button.style.backgroundColor = "#171717";
        button.style.color = "#ffffff";

        setTimeout(function () {

            button.innerText = originalText;

            button.style.backgroundColor = "#ffffff";
            button.style.color = "#171717";

        }, 1000);

    });

});


// Cart button

cartBtn.addEventListener("click", function () {

    if (cartCount === 0) {

        alert("Your cart is empty.");

    } else {

        alert(
            `You have ${cartCount} item${cartCount > 1 ? "s" : ""} in your cart.`
        );

    }

});


// ==========================================
// 3. WISHLIST
// ==========================================

wishlistButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const icon = button.querySelector("i");

        if (icon.classList.contains("fa-regular")) {

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            button.style.color = "#d65a3a";

        } else {

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            button.style.color = "#171717";

        }

    });

});


// Navbar wishlist button

navWishlistBtn.addEventListener("click", function () {

    alert("Your wishlist will appear here.");

});


// ==========================================
// 4. MOBILE MENU
// ==========================================

menuBtn.addEventListener("click", function () {

    mobileMenu.classList.toggle("active");

    const icon = menuBtn.querySelector("i");

    if (mobileMenu.classList.contains("active")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


// Close mobile menu after clicking a link

mobileLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        mobileMenu.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


// ==========================================
// 5. PRODUCT FILTER
// ==========================================

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Remove active class

        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        // Add active class to clicked button

        button.classList.add("active");


        // Get selected category

        const selectedCategory =
            button.getAttribute("data-filter");


        // Show / hide products

        productCards.forEach(function (card) {

            const productCategory =
                card.getAttribute("data-category");


            if (
                selectedCategory === "All" ||
                selectedCategory === productCategory
            ) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

});


// ==========================================
// 6. SEARCH
// ==========================================

searchInput.addEventListener("input", function () {

    const searchValue =
        searchInput.value.toLowerCase().trim();


    productCards.forEach(function (card) {

        const productName =
            card.querySelector("h3").innerText.toLowerCase();

        const productCategory =
            card
                .querySelector(".product-category")
                .innerText
                .toLowerCase();


        if (
            productName.includes(searchValue) ||
            productCategory.includes(searchValue)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});


// ==========================================
// 7. SEARCH - ENTER KEY
// ==========================================

searchInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        document
            .getElementById("shop")
            .scrollIntoView({
                behavior: "smooth"
            });

    }

});


// ==========================================
// 8. ACCOUNT BUTTON
// ==========================================

accountBtn.addEventListener("click", function () {

    alert(
        "Login and Register will be connected with the backend soon."
    );

});


// ==========================================
// 9. JOIN NEXORA BUTTON
// ==========================================

joinBtn.addEventListener("click", function () {

    alert(
        "Welcome to Nexora! Membership will be available soon."
    );

});


// ==========================================
// 10. NEWSLETTER
// ==========================================

newsletterForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const email =
        emailInput.value.trim();


    // Empty email

    if (email === "") {

        emailInput.focus();

        emailInput.placeholder =
            "Please enter your email address";

        return;

    }


    // Simple email validation

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        emailInput.value = "";

        emailInput.placeholder =
            "Please enter a valid email";

        emailInput.focus();

        return;

    }


    // Success

    const submitButton =
        newsletterForm.querySelector("button");


    submitButton.innerHTML =
        'Subscribed ✓';


    submitButton.style.backgroundColor =
        "#3d7a52";


    emailInput.value = "";


    // Reset button

    setTimeout(function () {

        submitButton.innerHTML =
            'Subscribe <i class="fa-solid fa-arrow-right"></i>';

        submitButton.style.backgroundColor =
            "#171717";

    }, 2000);

});


// ==========================================
// 11. DESKTOP NAVIGATION
// ==========================================

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.forEach(function (navLink) {

            navLink.classList.remove("active");

        });


        link.classList.add("active");

    });

});


// ==========================================
// 12. CATEGORY CARD CLICK
// ==========================================

const categoryCards =
    document.querySelectorAll(".category-card");


categoryCards.forEach(function (card) {

    card.addEventListener("click", function () {

        const category =
            card.getAttribute("data-category");


        // Scroll to products

        document
            .getElementById("shop")
            .scrollIntoView({
                behavior: "smooth"
            });


        // Find matching filter

        filterButtons.forEach(function (button) {

            if (
                button.getAttribute("data-filter") === category
            ) {

                button.click();

            }

        });

    });

});


// ==========================================
// 13. CLOSE MOBILE MENU ON RESIZE
// ==========================================

window.addEventListener("resize", function () {

    if (window.innerWidth > 800) {

        mobileMenu.classList.remove("active");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


// ==========================================
// 14. PAGE LOADED
// ==========================================

console.log("Nexora is ready 🚀");