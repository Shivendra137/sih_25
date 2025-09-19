const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
app.use(express.json());
// app.use('/api.js', apiRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});