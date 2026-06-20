# UCD Operations Bot

A Discord.js v14 + TypeScript bot for managing UCD operations directly from Discord using Google Sheets as the backend database.

## Features

### Financial Management

* `/balance` — View account balances
* `/pay` — Record payments and balance adjustments
* Automatic balance tracking through Google Sheets

### Account Management

* Track client accounts
* Store contract/package information
* Monitor account status
* Track custom gear and remaining calls

### Assignment Management

* Store assignment information
* Track required roles and slot availability
* Manage vehicles and operational requirements
* Monitor assignment status

### Member Statistics

* Track jobs joined
* Reliability scoring
* Money earned statistics
* Member performance monitoring

### Google Sheets Integration

The bot uses Google Sheets as its primary database and automatically syncs data between Discord and the spreadsheet.

## Spreadsheet Structure

### Accounts Sheet

| Column          |
| --------------- |
| Client ID       |
| Name            |
| Pack/Contract   |
| Balance(UCD)    |
| Custom Gear     |
| Calls Remaining |
| Status          |

### Ledger Sheet

| Column        |
| ------------- |
| TimeStamp     |
| Type          |
| Amount(UCD)   |
| Description   |
| Client/Member |
| Reference ID  |

### Assignments Sheet

| Column           |
| ---------------- |
| Assignment ID    |
| Time             |
| TimeZone         |
| Required Roles   |
| Slots Filled     |
| Vehicle(s)       |
| Heat/Product Use |
| Status           |

### Stats Sheet

| Column            |
| ----------------- |
| Member ID         |
| Name              |
| JobsJoined        |
| Reliability       |
| Money Earned(UCD) |

## Installation

### Requirements

* Node.js 20+
* Discord Bot Application
* Google Cloud Project
* Google Sheets API enabled

### Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
npm install
```

## Environment Variables

Create a `.env` file:

```env
# Google
GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=

# Discord
DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
DISCORD_CHANNEL_ID=
```

## Google Cloud Setup

### 1. Enable Google Sheets API

Visit:

https://console.cloud.google.com/apis/library/sheets.googleapis.com

Enable the **Google Sheets API** for your project.

### 2. Create Service Account

1. Open Google Cloud Console
2. Create a Service Account
3. Generate a JSON key
4. Copy:

```json
client_email
private_key
```

into your `.env` file.

### 3. Share Spreadsheet

Share the spreadsheet with:

```text
your-service-account@project.iam.gserviceaccount.com
```

Grant **Editor** permissions.

## Discord Setup

### Required Intents

Enable:

* Server Members Intent
* Message Content Intent

### Invite Bot

Use OAuth2 URL Generator with:

* bot
* applications.commands

Permissions:

* Send Messages
* Read Messages
* Use Slash Commands
* Embed Links

## Development

Start development server:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Run production build:

```bash
npm start
```

## Current Commands

### /balance

Displays the account balance associated with the user's Discord ID.

### /pay

Records a payment transaction and updates account balances.

### /sheets-info

Displays spreadsheet connection and configuration information.

## Tech Stack

* Discord.js v14
* TypeScript
* Google Sheets API
* Google Cloud Service Accounts
* tsx
* Node.js

## Project Structure

```text
src/
├── discord/
│   ├── commands/
│   ├── events/
│   └── component-interactions/
├── spreadsheet/
├── services/
├── loaders/
├── models/
├── google-sheets/
└── types/
```

## Troubleshooting

### Google Sheets API Error

If you receive:

```text
Google Sheets API has not been used in project before or it is disabled
```

Enable the Google Sheets API in Google Cloud Console and wait a few minutes for propagation.

### Slash Commands Not Appearing

Verify:

* DISCORD_CLIENT_ID is correct
* DISCORD_GUILD_ID is correct
* Bot has applications.commands scope
* Bot has been reinvited after permission changes

### No Account Found

Ensure the user's Discord ID exists in the Accounts sheet under the Client ID column.

## License

MIT License
