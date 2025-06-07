require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Middlewares
app.use(cors()); // Permite requisições de outros domínios
app.use(express.json()); // Permite que o express entenda JSON

// Rotas
app.get("/", (req, res) => {
  res.send("API de Eventos funcionando!");
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
