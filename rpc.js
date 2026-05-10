import express from "express";
import cors from "cors";
import { RetoolRPC } from "retoolrpc";

// Create Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "RPC Server Running"
  });
});

// Expose Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`RPC Express server running on port ${PORT}`);
});

// Initialize RPC
const rpc = new RetoolRPC({
  apiToken: "retool_01kpnz75q1z8henjns2he9v3w8",
  host: "https://zetaglobalcustomerengineeringintern.retool.com",
  resourceId: "9aab6ada-ba7f-46a5-afae-26ae8c1f6fdf",
  environmentName: "production",
  pollingIntervalMs: 1000,
  pollingTimeoutMs: 30000,
  version: "0.0.1",
  logLevel: "info",
});


// REGISTER 
rpc.register({
  name: "registerUser",
  arguments: {
    name: { type: "string", required: true },
    email: { type: "string", required: true },
    password: { type: "string", required: true },
    phone: { type: "string", required: false },
    address: { type: "string", required: false },
  },
  implementation: async ({ name, email, password, phone, address }) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, phone, address }),
    });

    const data = await res.json();
    return data;
  },
});


// LOGIN 
rpc.register({
  name: "login",
  arguments: {
    email: { type: "string", required: true },
    password: { type: "string", required: true },
  },
  implementation: async ({ email, password }) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data;
  },
});


// PROFILE 
rpc.register({
  name: "getProfile",
  arguments: {
    token: { type: "string", required: true },
  },
  implementation: async ({ token }) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/profile", {
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();
    return data;
  },
});


// PRODUCTS 
rpc.register({
  name: "getProducts",
  arguments: {
    token: { type: "string", required: true },
  },
  implementation: async ({ token }) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/products", {
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();
    return data;
  },
});


// ORDERS 
rpc.register({
  name: "getOrders",
  arguments: {
    token: { type: "string", required: true },
  },
  implementation: async ({ token }) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/orders-full", {
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();
    return data;
  },
});

rpc.register({
  name: "getOrdersWithItems",
  arguments: {
    token: { type: "string", required: true },
  },
  implementation: async ({ token }) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/orders-full", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await res.json();
    return data;
  },
});

// ADD TO CART
rpc.register({
  name: "addToCart",
  arguments: {
    token: { type: "string" },
    product_id: { type: "number" },
    quantity: { type: "number" }
  },
  implementation: async (args) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: args.token
      },
      body: JSON.stringify(args)
    });
    return await res.json();
  }
});

// GET CART
rpc.register({
  name: "getCart",
  arguments: { token: { type: "string" } },
  implementation: async ({ token }) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/cart", {
      headers: { Authorization: token }
    });
    return await res.json();
  }
});

// REMOVE
rpc.register({
  name: "removeFromCart",
  arguments: {
    token: { type: "string" },
    cart_id: { type: "number" }
  },
  implementation: async ({ token, cart_id }) => {
    const res = await fetch("https://shopping-dashboard-backend.onrender.com/api/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ cart_id })
    });
    return await res.json();
  }
});


rpc.listen();