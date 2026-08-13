const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================================
// DATA FILES
// =====================================================

const productsFile = path.join(
    __dirname,
    "data",
    "products.json"
);

const usersFile = path.join(
    __dirname,
    "data",
    "users.json"
);

const ordersFile = path.join(
    __dirname,
    "data",
    "orders.json"
);


// =====================================================
// HELPER FUNCTIONS
// =====================================================

// JSON file read karne ke liye
function readData(file) {

    try {

        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, "[]");
        }

        const data = fs.readFileSync(
            file,
            "utf8"
        );

        return JSON.parse(data || "[]");

    } catch (error) {

        console.log("File read error:", error.message);

        return [];

    }

}


// JSON file mein data save karne ke liye
function writeData(file, data) {

    try {

        fs.writeFileSync(
            file,
            JSON.stringify(data, null, 4)
        );

        return true;

    } catch (error) {

        console.log("File write error:", error.message);

        return false;

    }

}


// =====================================================
// HOME / API TEST
// =====================================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "Nexora E-Commerce Backend is Running 🚀",

        version: "1.0.0",

        endpoints: {

            products: "/api/products",

            users: "/api/users",

            orders: "/api/orders"

        }

    });

});


// =====================================================
// PRODUCTS
// =====================================================


// GET ALL PRODUCTS

app.get("/api/products", (req, res) => {

    const products = readData(productsFile);

    const {
        category,
        search,
        minPrice,
        maxPrice
    } = req.query;


    let result = products;


    // Category filter

    if (category) {

        result = result.filter(product =>

            product.category.toLowerCase() ===
            category.toLowerCase()

        );

    }


    // Search

    if (search) {

        result = result.filter(product =>

            product.name
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }


    // Minimum price

    if (minPrice) {

        result = result.filter(product =>

            product.price >= Number(minPrice)

        );

    }


    // Maximum price

    if (maxPrice) {

        result = result.filter(product =>

            product.price <= Number(maxPrice)

        );

    }


    res.json({

        success: true,

        count: result.length,

        products: result

    });

});


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

app.get("/api/products/:id", (req, res) => {

    const products = readData(productsFile);

    const productId =
        Number(req.params.id);


    const product = products.find(
        item => item.id === productId
    );


    if (!product) {

        return res.status(404).json({

            success: false,

            message: "Product not found"

        });

    }


    res.json({

        success: true,

        product: product

    });

});


// =====================================================
// ADD PRODUCT
// =====================================================

app.post("/api/products", (req, res) => {

    const products = readData(productsFile);

    const {
        name,
        category,
        price,
        originalPrice,
        image,
        badge,
        stock
    } = req.body;


    if (!name || !category || !price) {

        return res.status(400).json({

            success: false,

            message:
                "Name, category and price are required"

        });

    }


    const newId =
        products.length > 0
            ? Math.max(
                ...products.map(
                    product => product.id
                )
            ) + 1
            : 1;


    const newProduct = {

        id: newId,

        name: name,

        category: category,

        price: Number(price),

        originalPrice:
            Number(originalPrice) || Number(price),

        image: image || "",

        rating: 0,

        reviews: 0,

        badge: badge || "",

        stock: Number(stock) || 0

    };


    products.push(newProduct);

    writeData(productsFile, products);


    res.status(201).json({

        success: true,

        message: "Product added successfully",

        product: newProduct

    });

});


// =====================================================
// USERS — REGISTER
// =====================================================

app.post("/api/users/register", (req, res) => {

    const users = readData(usersFile);

    const {
        name,
        email,
        password
    } = req.body;


    if (!name || !email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Name, email and password are required"

        });

    }


    const existingUser = users.find(
        user =>
            user.email.toLowerCase() ===
            email.toLowerCase()
    );


    if (existingUser) {

        return res.status(409).json({

            success: false,

            message: "User already exists"

        });

    }


    const newId =
        users.length > 0
            ? Math.max(
                ...users.map(
                    user => user.id
                )
            ) + 1
            : 1;


    const newUser = {

        id: newId,

        name: name,

        email: email,

        password: password,

        cart: [],

        createdAt:
            new Date().toISOString()

    };


    users.push(newUser);

    writeData(usersFile, users);


    res.status(201).json({

        success: true,

        message: "Registration successful",

        user: {

            id: newUser.id,

            name: newUser.name,

            email: newUser.email

        }

    });

});


// =====================================================
// USERS — LOGIN
// =====================================================

app.post("/api/users/login", (req, res) => {

    const users = readData(usersFile);

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Email and password are required"

        });

    }


    const user = users.find(

        user =>
            user.email.toLowerCase() ===
            email.toLowerCase() &&
            user.password === password

    );


    if (!user) {

        return res.status(401).json({

            success: false,

            message: "Invalid email or password"

        });

    }


    res.json({

        success: true,

        message: "Login successful",

        user: {

            id: user.id,

            name: user.name,

            email: user.email,

            cart: user.cart || []

        }

    });

});


// =====================================================
// GET USER CART
// =====================================================

app.get("/api/users/:userId/cart", (req, res) => {

    const users = readData(usersFile);

    const userId =
        Number(req.params.userId);


    const user = users.find(
        item => item.id === userId
    );


    if (!user) {

        return res.status(404).json({

            success: false,

            message: "User not found"

        });

    }


    res.json({

        success: true,

        cart: user.cart || []

    });

});


// =====================================================
// ADD PRODUCT TO CART
// =====================================================

app.post("/api/users/:userId/cart", (req, res) => {

    const users = readData(usersFile);

    const products = readData(productsFile);

    const userId =
        Number(req.params.userId);

    const {
        productId,
        quantity
    } = req.body;


    const user = users.find(
        item => item.id === userId
    );


    if (!user) {

        return res.status(404).json({

            success: false,

            message: "User not found"

        });

    }


    const product = products.find(
        item => item.id === Number(productId)
    );


    if (!product) {

        return res.status(404).json({

            success: false,

            message: "Product not found"

        });

    }


    if (!user.cart) {
        user.cart = [];
    }


    const existingItem =
        user.cart.find(
            item =>
                item.productId ===
                Number(productId)
        );


    if (existingItem) {

        existingItem.quantity +=
            Number(quantity) || 1;

    } else {

        user.cart.push({

            productId: product.id,

            quantity:
                Number(quantity) || 1

        });

    }


    writeData(usersFile, users);


    res.json({

        success: true,

        message: "Product added to cart",

        cart: user.cart

    });

});


// =====================================================
// REMOVE PRODUCT FROM CART
// =====================================================

app.delete(
    "/api/users/:userId/cart/:productId",
    (req, res) => {

        const users =
            readData(usersFile);

        const userId =
            Number(req.params.userId);

        const productId =
            Number(req.params.productId);


        const user = users.find(
            item => item.id === userId
        );


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }


        user.cart =
            (user.cart || []).filter(

                item =>
                    item.productId !==
                    productId

            );


        writeData(usersFile, users);


        res.json({

            success: true,

            message:
                "Product removed from cart",

            cart: user.cart

        });

    }
);


// =====================================================
// CREATE ORDER
// =====================================================

app.post("/api/orders", (req, res) => {

    const orders = readData(ordersFile);

    const users = readData(usersFile);

    const {
        userId,
        items,
        shippingAddress,
        paymentMethod
    } = req.body;


    if (
        !userId ||
        !items ||
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return res.status(400).json({

            success: false,

            message:
                "User and order items are required"

        });

    }


    const user = users.find(
        item =>
            item.id === Number(userId)
    );


    if (!user) {

        return res.status(404).json({

            success: false,

            message: "User not found"

        });

    }


    const orderId =
        orders.length > 0
            ? Math.max(
                ...orders.map(
                    order => order.id
                )
            ) + 1
            : 1;


    const totalAmount =
        items.reduce(

            (total, item) =>

                total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                ),

            0

        );


    const newOrder = {

        id: orderId,

        userId: Number(userId),

        items: items,

        totalAmount: totalAmount,

        shippingAddress:
            shippingAddress || {},

        paymentMethod:
            paymentMethod || "COD",

        status: "Placed",

        createdAt:
            new Date().toISOString()

    };


    orders.push(newOrder);

    writeData(ordersFile, orders);


    // Cart clear

    user.cart = [];

    writeData(usersFile, users);


    res.status(201).json({

        success: true,

        message: "Order placed successfully",

        order: newOrder

    });

});


// =====================================================
// GET USER ORDERS
// =====================================================

app.get("/api/orders/user/:userId", (req, res) => {

    const orders = readData(ordersFile);

    const userId =
        Number(req.params.userId);


    const userOrders =
        orders.filter(
            order =>
                order.userId === userId
        );


    res.json({

        success: true,

        count: userOrders.length,

        orders: userOrders

    });

});


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "API route not found"

    });

});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {

    console.error(
        "SERVER ERROR:",
        error
    );


    res.status(500).json({

        success: false,

        message:
            "Something went wrong on the server"

    });

});


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

    console.log("");
    console.log("========================================");
    console.log("       NEXORA E-COMMERCE SERVER");
    console.log("========================================");
    console.log("");
    console.log(
        `Server : http://localhost:${PORT}`
    );
    console.log(
        `API    : http://localhost:${PORT}/api`
    );
    console.log("");
    console.log("Products : /api/products");
    console.log("Register : /api/users/register");
    console.log("Login    : /api/users/login");
    console.log("Orders   : /api/orders");
    console.log("");
    console.log("Server started successfully 🚀");
    console.log("========================================");

});