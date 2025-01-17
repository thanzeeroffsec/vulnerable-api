exports.userCart = async (req, res) => {
  try {
    const user = req.query.userId;
    if (!user) {
      return res.status(400).json({ message: "User id is required" });
    }
    const request = await fetch(`https://dummyjson.com/carts/user/${user}`);
    const data = await request.json();
    console.log(user);

    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Invalid user" });
  }
};

exports.userTemplate = async (req, res) => {
  try {
    const { message } = req.body;
    const evalMessage = eval(`\`${message}\``);
    return res.json(evalMessage);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "Invalid input. Ensure userId and products are provided.",
      });
    }
    const request = await fetch("https://dummyjson.com/carts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        products,
      }),
    });
    const data = await request.json();
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
