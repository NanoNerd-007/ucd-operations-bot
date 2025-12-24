# I Owe You Discord Bot

**A Discord bot to keep track of who owes who money.**

This bot keeps track of your financial exchanges with a roommate or friend, storing data securely in a Google Sheets file. It allows for easy submission of new entries and quick balance checks, all within your Discord server.


<img width="675" alt="Sending and receiving a message to the bot" src="https://github.com/user-attachments/assets/a7ffc4ad-9a0d-4449-bbb5-4a47ea5c121b" />


<img width="1449" alt="Overview of the spreadseet" src="https://github.com/user-attachments/assets/7ff32b47-b4be-418d-b7d5-d04e70131b6c" />

## Why Use This Bot?

This bot was created to simplify expense tracking for two individuals, removing the need to manually update a shared spreadsheet.

The bot doesn't require commands to add entries. Instead, it uses regular Discord messages with a flexible syntax that is very forgiving and can make a lot of assumptions on your behalf. This is especially useful when you're outside and want to add an entry immediately after making a purchase, so you don't forget to do it later.

The short message syntax also works well for quickly adding entries using your phone's voice dictation.

## Submitting Entries

Depending on how you've set your environment variables, messages are parsed using either an LLM or regular expressions and consist of four parts:

### Required arguments

-   `Amount` - The cost of the purchase
-   `Description` - The description of what was purchased

### Optional arguments

-   `Name` - The name of the person who made the purchase
    -   The name / nickname of the other person can be used to indicate that the amount is owed to them
    -   If no name is found, the name of the user who submitted the message will be used
-   `Category` - Text that matches one of the configured categories / category keywords will be used as the category
    -   If no category is found, the default category will be used
-   `Split` - How the purchase should be divided, this can either by `50/50`, or `Paid in full by other`
    -   By default, this is assumed to be `50/50` 

### Full length message example

```
John spent $12.48 for Netflix in subscriptions
```

### Shortened message example

Assuming John is the user writing this message, and Netflix is a keyword for the subscriptions category, the example above can be shortened to:

```
12.48 Netflix
```

## Commands

`/balance (month)` - Shows the current balance of the user. If no month is specified, the balance of the current month will be shown

`/pay (month)` - Add an entry to pay off any outstanding balances. If no month is specified, the balance will be paid off for the current month

## Installation requirements

This bot requires self-hosting.

_Hosting on a service such as Railway or Render is recommended. Make sure to set the environment variables in the hosting service._

## Getting started

-   Clone the repository
-   Create a `.env` file in the root directory with the content found in [.env.example](.env.example)
    -   Only variables starting with `GOOGLE` and `DISCORD` are required, the rest are optional and should only be changed if you intend on changing the layout of the spreadsheet

### Creating a service account

A service account is required to access the Google Sheets API. Follow the instructions [here](https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication?id=setting-up-your-quotapplicationquot) to create a service account and download the JSON file.

**Make sure not to commit this file to source control.**

From the JSON file, Add `client_email` as the value for `GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL`, and `private_key` for `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` to your `.env` file.

## Setting up the spreadsheet

-   Create a copy of the spreadsheet from [here](https://docs.google.com/spreadsheets/d/1q1HUeqKJajuoatVEWKznHumix4eqtkqrik-XKWadWgw/copy)
-   Share the spreadsheet with the `client_email` value, make sure to give it **Edit** permissions
-   Populate the cells found in the `Configuration` worksheet.
-   Copy the `Spreadsheet ID` from the URL of the spreadsheet and add it to `GOOGLE_SHEETS_SPREADSHEET_ID` in your `.env` file

_The spreadsheet ID can be found in the URL of the spreadsheet:_

```
https://docs.google.com/spreadsheets/d/<SPREADSHEET ID>/edit#gid=0
```

## Configuring for use with LLMs (OPTIONAL)

This project uses Google's Gemini API to perform natural language processing.
To get an API key, visit https://aistudio.google.com/api-keys.

Once you have a key, add it to your `.env` file as `GOOGLE_GEMINI_API_KEY`.

## Running the bot

### Local development

-   Run `npm install`
-   Run `npm run dev`

### Production

-   Run `npm build`, followed by `npm start`

### Testing

-   Run `npm test` to run the test suite

## Setting up in your server

-   If you haven't already enabled developer mode in Discord, go to settings > advanced, and enable developer mode.
    This will allow you to copy IDs for servers and channels.
-   Right click on the server you want to add the bot to and select `Copy Server ID`
    -   Add the server ID to `DISCORD_GUILD_ID` in your `.env` file
-   Right click on the text channel you want to use to interact with the bot and select `Copy Channel ID`
    -   Add the channel ID to `DISCORD_CHANNEL_ID` in your `.env` file


-   Create a new Discord application and bot [here](https://discord.com/developers/applications)
-   Copy the bot token and add it to `DISCORD_TOKEN` in your `.env` file
-   Under `Bot`, enable `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT`

    ![Discord privileged gateway intents](https://github.com/Lyubomir-Todorov/i-owe-you-discord-bot/assets/73316704/5d89b006-098a-4643-9205-ab3d9c74cd34)

-   Under `OAuth2`, select the client ID and add it to `DISCORD_CLIENT_ID` in your `.env` file

    ![Discord OAuth2](https://github.com/Lyubomir-Todorov/i-owe-you-discord-bot/assets/73316704/a4518787-3848-454c-8ae1-0f70ab5c58b3)

-   Finally, head to `Installation`. Set `Install link` to `Discord provided link` and use it to invite the bot to your server