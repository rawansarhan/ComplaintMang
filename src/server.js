const app = require('./app');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to database
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
