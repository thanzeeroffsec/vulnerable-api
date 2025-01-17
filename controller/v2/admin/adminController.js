const axios = require("axios");
const dns = require("dns");
const util = require("util");

exports.userDetails = async (req, res) => {
  try {
    const id = req.params.id;

    const request = await fetch(`https://dummyjson.com/users/${id}`);
    const data = await request.json();

    return res.json(data);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.webHookUrk = async (req, res) => {
  const { webhookUrl } = req.body;

  try {
    if (!webhookUrl) {
      return res.status(400).json({ error: "webhookUrl is required" });
    }

    // Log the incoming request
    console.log(`Validating webhook URL: ${webhookUrl}`);

    // Validate URL format
    const url = new URL(webhookUrl);

    // Simulate a DNS resolution check (but not restricting internal IPs)
    const resolve = util.promisify(dns.lookup);
    const resolvedIP = await resolve(url.hostname);

    // Fetch the URL to validate its response
    const response = await axios.get(webhookUrl);

    // Return validation result to the user
    return res.status(200).json({
      status: "success",
      message: `Webhook validated successfully with status code ${response.status}`,
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Webhook validation failed",
      error: error.message,
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const request = await fetch("https://dummyjson.com/products");
    const products = await request.json();
    return res.json(products);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to fetch products" });
  }
};
exports.getSingleProdcut = async (req, res) => {
  try {
    const id = req.params.id;
    const request = await fetch(`https://dummyjson.com/products/${id}`);
    const product = await request.json();
    return res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to fetch products" });
  }
};
