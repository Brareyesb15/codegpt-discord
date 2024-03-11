# Discord Chatbot with CodeGPT Plus

## Project Setup

To integrate this chatbot into your workflow, you'll need to configure a Discord application (bot) and obtain CodeGPT Plus credentials.

### 1. Establish a Discord Application/Bot

- Head over to the [Discord Developer Portal](https://discord.com/developers/applications) and hit "New Application".
- Give your app a snazzy name.
- Whip up your `.env` file in the root directory of this project, taking `example.env` as your blueprint.
- In the general info, snag your application id and public key and drop them into your `.env` file.
  - Slide into the bot section, grab your token, and stash it in the `.env`. Tokens are a one-time peek, so lock it down.
  - Skedaddle over to the OAuth2 section, secure the client secret, and park it in `DISCORD_CLIENT_SECRET` in your `.env`.

### 2. Acquire and Link Your Server's URL

- This Discord chatbot is all about that serverless life, running on interactions. You'll need a URL for Discord to ping these interactions to your server.
- Once you've got the URL, pop over to general info on your discord developer portal and plug your URL into `INTERACTIONS ENDPOINT URL` topping it off with `/event`. This endpoint will handle the Discord events you want to juggle and pass them to your bot.
  Si encuentras un mensaje de error con error de validación asegurate de levantar tu servidor para ser verificado por discord y establecer la conexión.
  - Hit up the OAuth2 tab and input your URL, finishing with `/event/discord-callback` in the Redirects field, like `https://myurl.com/event/discord-callback`, for auth purposes.

### 3. Invite the Bot to Your Server/Event Subscriptions

- Jump to the “OAuth2” tab in your app settings.
- Under “Scopes”, tick “bot”.
- In “Bot Permissions”, pick the powers your bot needs.
- Nab the URL that pops up and drop it into your browser to bring your bot into your server.

### 4. Configure Your Commands

- The app's got a few default commands like `ask` and `channel summary`, but you're the boss. You'll have an endpoint get llamado /createCommand to call that'll whip up these commands and buddy them up with your Discord bot. One and done – no need to spam it. Once set, you can summon these commands through your bot.

### 5. Create an Account on CodeGPT Plus

- Cruise over to the [CodeGPT Plus website](https://app.codegpt.co/signup) and sign up.
- Dash to your dashboard and grab your API key and Agent ID.

### 6. Clone the Repository and Install Dependencies

```bash
git clone <repository-url>
npm install
```

## Usage

To get this chatbot up and running, fire up this command in your terminal:

```bash
npm run watch
```

The chatbot will keep an eye on messages in the Discord channels you've invited it to. When it catches a command, it'll cook up a response with the CodeGPT Plus API and shoot it back in the same channel.

## Tips

- Feel free to hack the code to bits. You can rig up commands with more bells and whistles using the command builder, some savvy logic, and your CodeGPT API.
