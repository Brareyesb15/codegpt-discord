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

- The application code supports a commands para funcionar, los comandos por defecto de esta aplicación son ask and re y handleResumenCanalCommand por lo tanto debes crearlos y asociarlos a tu cuenta bot de discord para poder usarlos. 





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

The chatbot will monitor messages in the Slack channel specified by the `SLACK_CHANNEL_ID` variable. Upon receiving a message, the chatbot will craft a response utilizing the CodeGPTPlus API and relay it back to the user in the same channel.

To integrate this chatbot into your workflow, you'll need to configure a Slack application (bot) and obtain CodeGPTPlus credentials.

### 1. Create a Discord bot and get the bot token.

- Go to the Discord Developer Portal : https://discord.com/developers/applications
- Click on "New Application" and give it a name.
- Under the "Token" section, click "Copy" to get your bot token.

### 2. Acquire and Link Your Server's URL

- This Slack chatbot application is designed to operate serverlessly, hence it functions via interactions. You must have a URL where Discord can send these interactions to your server.
- If operating locally, consider using a tunneling service like ngrok.
- Once you have the URL, go to the Interactivity & Shortcuts tab and input your URL, concluding with `/slack/events` in the Request URL field, e.g., `https://myurl.com22/slack/events`.

### 3. Invite the Bot to Your Server/Event Subscriptions

- Input the URL from step 2 in the Event Subscriptions tab, enable events, and insert your URL in the new request URL option. This will initiate a request to your server; if it's active, it will authenticate, and the connection will be nearly complete.

### 4. Configure Your Commands

- The application code supports a command, but you must create it in your bot to utilize it. Visit the Slash Commands tab, create a command named `/configureagent`, and ensure the request URL matches the one set previously: `https://myurl.com22/slack/events`.

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

The chatbot will monitor messages in the Slack channel specified by the `SLACK_CHANNEL_ID` variable. Upon receiving a message, the chatbot will craft a response utilizing the CodeGPTPlus API and relay it back to the user in the same channel.
