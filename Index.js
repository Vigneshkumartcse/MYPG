// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const TestingRouter = require('./Routes/TestingRoutes');
const connectToDatabase = require('./Connection/Connect');
const PGRouter = require('./Routes/PGroutes');
const AuthRouter = require('./Routes/AuthRoute');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3333;




// routes
app.use('/testing', TestingRouter);
app.use('/pg', PGRouter);
app.use('/auth', AuthRouter);




 connectToDatabase().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Accessible from emulator at http://10.0.2.2:${port}`);
  })
}).catch((error) => {
  console.error('Failed to start server:', error);
});

