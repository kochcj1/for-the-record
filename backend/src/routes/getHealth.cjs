const getHealth = async (mongoClient, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };

  try {
    // Perform a quick operation on the MongoDB to check its health:
    await mongoClient.db("admin").command({ ping: 1 });
    healthCheck.mongodb = "OK";
  } catch (error) {
    healthCheck.mongodb = "ERROR";
    healthCheck.message = "MongoDB connection error";
    console.error("MongoDB connection error:", error);
  }

  // If there's an error with MongoDB, the overall status is not OK:
  if (healthCheck.mongodb !== "OK") {
    return res.status(503).json(healthCheck);
  }

  // If everything is fine:
  res.status(200).json(healthCheck);
};

module.exports = getHealth;
