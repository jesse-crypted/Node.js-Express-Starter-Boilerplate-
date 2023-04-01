const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// Database URI from env variable
const DB = process.env.DB_URI;

// Database connection
mongoose.set('strictQuery', false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'));

// Start the server and Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app running on port ${port}`));
