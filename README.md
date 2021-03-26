# `cloudflare-worker-discord-interactions-template`

An early-stage Discord Interactions template for Cloudflare Workers via Wrangler. Running completely serverless via Cloudflare provides many benefits and makes running a slash command bot basically zero-maintenance.

## 🔋 Getting Started

This template is meant to be used with [Wrangler](https://github.com/cloudflare/wrangler). If you are not already familiar with the tool, we recommend that you install the tool and configure it to work with your [Cloudflare account](https://dash.cloudflare.com). Documentation can be found [here](https://developers.cloudflare.com/workers/tooling/wrangler/).

To generate using Wrangler, run this command:

```bash
wrangler generate my-discord-project https://github.com/judge2020/cloudflare-worker-discord-interactions-template
```

Once created, edit [wrangler.toml](./wrangler.toml):

- set `account_id` to the account ID which will house the worker ([obtain from here](https://dash.cloudflare.com/?to=/:account/workers))
- change `name` to a name that works for you and represents your application. If you use a workers.dev subdomain (which is perfectly fine to do), this will be the subdomain, ie naming it `test-discord` will have the endpoint end up as `test-discord.my-username.workers.dev`)

### Client setup

If you don't have a Discord client already, go to the [Discord developer applications page](https://discord.com/developers/applications) and create one.

Run the following commands based off of the info listed in the 'general information' section of your application:

```bash
wrangler secret put CLIENT_PUB_KEY
wrangler secret put CLIENT_SECRET
wrangler secret put CLIENT_ID
```

These will be exposed to the application as global variable strings for development and are all required.

After setting up your application and deploying (see below), point the 'interactions url' in the discord app settings to `{your endpoint}/interactions`, eg `https://test-discord.my-username.workers.dev/interactions`).

### 👩 💻 Developing

[`src/handler.ts`](./src/handler.ts) contains the main logic for commands - this function is pre-authenticated (see [src/index.ts](./src/index.ts)) so all you need to worry about is [registering commands](https://discord.com/developers/docs/interactions/slash-commands#registering-a-command) (this is planned to show up in this template in the future) and [handling the different inputs](https://discord.com/developers/docs/interactions/slash-commands#receiving-an-interaction).

### 🧪 Testing

Note: tests have not been modified for this template at the moment. `npm test` will run your tests.

### ✏️ Formatting

This template uses [`prettier`](https://prettier.io/) to format the project. To invoke, run `npm run format`.

### 👀 Previewing and Publishing

For information on how to preview and publish your worker, please see the [Wrangler docs](https://developers.cloudflare.com/workers/tooling/wrangler/commands/#publish).

Note that it is perfectly fine to run an interactions endpoint on a `workers.dev` subdomain.

## 🤢 Issues

If you run into issues with this specific project, please feel free to file an issue [here](https://github.com/judge2020/cloudflare-worker-discord-interactions-template/issues). If the problem is with Wrangler, please file an issue [here](https://github.com/cloudflare/wrangler/issues).

## ⚠️ Caveats

The `service-worker-mock` used by the tests is not a perfect representation of the Cloudflare Workers runtime. It is a general approximation. We recommend that you test end to end with `wrangler dev` in addition to a [staging environment](https://developers.cloudflare.com/workers/tooling/wrangler/configuration/environments/) to test things before deploying.
