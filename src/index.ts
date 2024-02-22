import { app as expressApp } from "./router/app";

// Iniciar el servidor Express
const port = process.env.PORT || 3009;
expressApp.listen(port, () => {
  console.log(`⚡️ Express server is running on port ${port}!`);
});
