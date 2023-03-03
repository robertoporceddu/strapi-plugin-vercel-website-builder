# strapi-plugin-vercel-website-builder

A plugin for [Strapi](https://github.com/strapi/strapi) that provides the ability to trigger Verel website builds manually, periodically or through model events and check Vercel status.
This plugin is a fork from https://github.com/ComfortablyCoding/strapi-plugin-website-builder .

## Requirements

The installation requirements are the same as Strapi itself and can be found in the documentation on the [Quick Start](https://strapi.io/documentation/developer-docs/latest/getting-started/quick-start.html) page in the Prerequisites info card.

### Supported Strapi versions

- v4.x.x

**NOTE**: While this plugin may work with the older Strapi versions, they are not supported, it is always recommended to use the latest version of Strapi.

## Configuration

The plugin configuration is stored in a config file located at `./config/plugins.js`.

The plugin has different structures depending on the type of trigger for the build. Each of the following sample configurations is the minimum needed for their respective trigger type.

### Add Vercel Configuration

```javascript
module.exports = ({ env }) => ({
  // ...
  'website-builder': {
    enabled: true,
    config: {
     // ...
     vercel: {
      app: "vercelAppName",
      teamId: "vercelTeamId",
      accessToken: "VercelAccessToken"
     }
    }
  },
  // ...
});
```

### Manual Configuration

```javascript
module.exports = ({ env }) => ({
  // ...
 'website-builder': {
    enabled: true,
    config: {
      url: 'https://link-to-hit-on-trigger.com',
      trigger: {
        type: 'manual',
      },
      vercel: {
       app: "vercelAppName",
       teamId: "vercelTeamId",
       accessToken: "VercelAccessToken"
      }
    }
  },
  // ...
});
```

### Cron/Periodic Configuration

```javascript
module.exports = ({ env }) => ({
  // ...
 'website-builder': {
    enabled: true,
    config: {
      url: 'https://link-to-hit-on-trigger.com',
      trigger: {
        type: 'cron',
        cron: '* * 1 * * *',
      },
      vercel: {
       app: "vercelAppName",
       teamId: "vercelTeamId",
       accessToken: "VercelAccessToken"
      }
    }
  },
  // ...
});
```

### Event Configuration

```javascript
module.exports = ({ env }) => ({
  // ...
 'website-builder': {
    enabled: true,
    config: {
      url: 'https://link-to-hit-on-trigger.com',
      trigger: {
        type: 'event',
        events: [
          {
            params: (record) => ({
              id: `${record.id}_${record.title}`
            }),
            model: 'recipe',
            types: ['create', 'delete'],
          },
          {
            params: {
              page: "home"
            },
            model: 'homepage',
            types: ['update'],
          },
        ],
      },
      vercel: {
       app: "vercelAppName",
       teamId: "vercelTeamId",
       accessToken: "VercelAccessToken"
      }
    }
  },
  // ...
});
```

**IMPORTANT NOTE**: Make sure any sensitive data is stored in env files.

#### The Complete Plugin Configuration  Object

| Property | Description | Type | Required |
| -------- | ----------- | ---- | -------- |
| url | The trigger URL for the website build. | String | Yes |
| headers | Any headers to send along with the request. | Object | No |
| body | Any body data to send along with the request. | Object | No |
| trigger | The trigger conditions for the build.  | Object | Yes |
| trigger.type | The type of trigger. The current supported options are `manual`,`cron` and `event` | String | Yes |
| trigger.cron | The cron expression to use for cron trigger. The supported expressions are the same as in the [strapi docs](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/cronjobs.html#cron-jobs) | String | Only if the type is cron |
| trigger.events | The events to use for the event trigger. | Array | Only if the type is event |
| trigger.events.url | The model specific url to hit on event trigger. | String | No |
| trigger.events.params | The model specific params to add on event trigger. | Object `or` Function | No |
| trigger.events.model | The model to listen for events on. | String | Yes |
| trigger.events.types | The model events to trigger on. The current supported events are `create`, `update`, `delete`, `publish` and `unpublish`. Publish/Unpublish is only supported for non media models. | Array | Yes |
| vercel.app | The Vercel App name. | String | Yes |
| vercel.teamId | The Vercel Team Id, get it from https://vercel.com/teams/<team_name>/settings | String | Yes |
| vercel.accessToken | The Vercel API Access Token, create it from https://vercel.com/account/tokens | String | Yes |

## Usage

Once the plugin has been installed and configured, it will show in the sidebar as `Vercel Website Builder`.
To trigger a manual build select the `Vercel Website Builder` menu item in the sidebar and click
the `Trigger Build` button to start a build process.

If the plugin does not show in the sidebar in the admin after the plugin is enabled then a clean rebuild of the admin is required. This can be done by deleting the generated .cache and build folders and then re-running the develop command.

Strapi automatically check if any triggered build was issued and checks build status every minute. It's also available a `Force Check Vercel Status` button to force refresh.
## Bugs

If any bugs are found please report them as a [Github Issue](https://github.com/robertoporceddu/strapi-plugin-vercel-website-builder/issues)
