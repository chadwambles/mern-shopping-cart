const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:
    "mongodb+srv://dbuser:badpassword@cluster0.neowe.mongodb.net/sampledb?retryWrites=true&w=majority",
  stripe_connect_test_client_id: "YOUR TEST CLIENT ID",
  stripe_test_secret_key:
    "YOUR SECRET KEY",
  stripe_test_api_key:
    "YOUR PUBLISHABLE KEY",
};

export default config;
