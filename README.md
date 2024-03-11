# Discord Chatbot with CodeGPT Plus

## Project Setup

To integrate this chatbot into your workflow, you'll need to configure a Slack application (bot) and obtain CodeGPTPlus credentials.

### 1. Establish a Discord Application/Bot

- Navigate to the [Discord Developer Portal](https://discord.com/developers/applications) and click on "New Application".
- Assign your app a distinctive name.
- Construct your `.env` file within the root directory of this project, using `example.env` as a reference.
- In the general information, copy your application id and public key into your `.env` file.
  -Go to bot section and get your token and save on the .env. Remember tokens can only viewed once so save.
  -Go to OAuth2 section, get the client secret and save on DISCORD_CLIENT_SECRET in to your DISCORD_CLIENT_SECRET.

### 2. Acquire and Link Your Server's URL

- This Discord chatbot application is designed to operate serverlessly, hence it functions via interactions. You must have a URL where Discord can send these interactions to your server.
- Once you have the URL, go to general information and input your url on NTERACTIONS ENDPOINT URL, concluding with `/event`, this endpoint manejará los eventos que quieras manejar a través de discord y los redirigirá al bot.
  -Go to the OAuth2 tab and input your URL, concluding with `/event/discord-callback` in the Request URL field, e.g., `https://myurl.com22/event/discord-callback`, esto será con fines de autorización.

### 3. Invite the Bot to Your Server/Event Subscriptions

-Go to the “OAuth2” tab in your application.
-Under “Scopes”, select “bot”.
-Under “Bot Permissions”, select the appropriate permissions.
-Copy the generated URL and open it in your web browser to invite the bot to your server.

### 4. Configure Your Commands

- The application code supports a commands para funcionar, los comandos por defecto de esta aplicación son ask and re y channel summary, por lo tanto debes crearlos y asociarlos a tu cuenta bot de discord para poder usarlos. Para eso tendrás un endpoint que al llamarlo creará los comandos y los asociará a tu bot de discord. No es necesario hacerlo varias veces, con una vez es suficiente. Una vez creados los comandos podrán ser invocados desde tu bot.

### 5. Create an Account on CodeGPT Plus

- Head over to the [CodeGPT Plus website](https://app.codegpt.co/es/signup) and register for an account.
- Proceed to your dashboard and retrieve your API key and Agent ID.

### 6. Clone the Repository and Install Dependencies

```bash
git clone <repository-url>
npm install
```

## Usage

To activate the chatbot, execute the following command in your terminal:

```bash
npm run watch
```

The chatbot will monitor messages in the discord channels donde lo hayas invitado a través de la url de invitación. Upon receiving a command, the chatbot will craft a response utilizing the CodeGPTPlus API and relay it back to the user in the same channel.

## Tips

-Puedes jugar con el código de la manera en que quieras. Podrías crear comandos que tengan muchas más funcionalidades usando el creador de commandos, lógica y tu api de codeGPT.
