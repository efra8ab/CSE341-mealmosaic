const { app } = require('./app');
const { connectDb } = require('./db/connect');

const PORT = process.env.PORT || 8080;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to the database', error);
    process.exit(1);
  });
