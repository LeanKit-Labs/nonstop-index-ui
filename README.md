# nonstop-index-ui
Web UI for the nonstop index

## Getting Setup
Clone this repo and run `npm install`.

### Install the nonstop CLI
Run `npm install -g nonstop-cli`.

### Running Nonstop Index
This project depends on a running nonstop-index. You will need to clone Alex's fork [here](https://github.com/arobson/nonstop-index). After cloning that repo, run `npm install`.

#### Creating agent credentials
At the root of the nonstop-index repo, run `node src/index.js`. At the menu, follow the steps to create agent credentials, and then also for client credentials. Be sure to hang on to the tokens created for both.

#### Uploading some packages
To populate your local index (if you haven't already), use nonstop on any existing nonstop-enabled projects by running `ns` in the root of the project. For example, run `ns` at the root of both nonstop-index and nonstop-index-ui. This will create a packages folder that contains tarballs created by nonstop. (Optionally run it as `ns --verbose` to see detailed output.)

Once you've created some tarballs, while still at the root of the project you built/packed, run `ns upload --index {your index IP} --port 4444 --token {The agent token you saved earlier}`. Follow any CLI prompts to select the tarball(s) you want to upload.

Start the nonstop index by going to the root of the repo and running `node src/index.js -s`

###Running the Nonstop Index UI
Now that you have the index running, you need to configure the nonstop-index-ui to point to it. Create a config.json file at the root of the nonstop-index-ui repo (this file isn't tracked by git), and use it to configure the IP/port of the index, and the client token you created earlier:

```javascript
{
	"client" : {
		"nonstop-index-api" : "http://127.0.0.1:4444/api",
		"headers": {
			"Authorization": "Bearer b77065a8-9413-48ce-a603-ee9572de1f36"
		}
	}
}
```
The token generated when you created the client credentials earlier should go in the Authorization header where the GUID is in the example above (be sure to keep "Bearer " in place!).

To start the nonstop-index-ui, run `gulp dev`.

### Environment Variables

<!-- EnvironmentVariables -->
| Group / Variable | Default |
|-------------|---------|
| **auth** | |
| NS_AUTH_ENABLED | `true` |
| NS__AUTH__SESSION_MESSAGES | `true` |
| NS__AUTH__LOGIN_ENDPOINT | `"/nonstop/auth/login"` |
| NS__AUTH__AUTH_ENDPOINT | `"/nonstop/auth/github"` |
| NS_AUTH_GITHUB_ORGANIZATION\* | `"YOUR_GITHUB_ORG"` |
| NS__AUTH__GITHUB__CLIENT_ID\* | `"YOUR_CLIENT_ID_HERE"` |
| NS__AUTH__GITHUB__CLIENT_SECRET\* | `"YOUR_CLIENT_SECRET_HERE"` |
| NS__AUTH__GITHUB__CALLBACK_URL\* | `"http://localhost:8048/nonstop/auth/github/callback"` |
| **client** | |
| NS__CLIENT__LUX_AUTOHOST__FILTER__ACTIONS | `[]` |
| NS__CLIENT__LUX_AUTOHOST__METRICS__TIMEOUT | `15000` |
| NS__CLIENT__LUX_AUTOHOST__METRICS__MESSAGES | `500` |
| NS__CLIENT__LUX_AUTOHOST__LOGGING__TIMEOUT | `5000` |
| NS__CLIENT__LUX_AUTOHOST__LOGGING__MESSAGES | `25` |
| NS__CLIENT__THEME_OPTIONS | `[]` |
| NS__CLIENT__FEATURE_OPTIONS__CONFIG | `true` |
| NS__CLIENT__NONSTOP_INDEX_API | `"http://nsindex.com:4444/api"` |
| NS_CLIENT_HEADERS__AUTHORIZATION | `"Bearer SooPurSeekretTokin"` |
| **name** | |
| NS_NAME | `"nonstop-index-ui"` |
| **environment** | |
| NS_ENVIRONMENT | `"dev"` |
| **rootUrl** | |
| NS__ROOT_URL | `""` |
| **host** | |
| NS_HOST_RESOURCES | `"server/resource"` |
| NS__HOST__APP_NAME | `"nonstop-index-ui"` |
| NS_HOST_PORT | `8048` |
| NS__HOST__SOCKET_I_O | `false` |
| NS__HOST__NO_OPTIONS | `true` |
| NS_HOST_ANONYMOUS | `["/nonstop/_status","/nonstop/auth/login","/nonstop/images","/nonstop/js","/nonstop/css","/nonstop/fonts"]` |
| NS_HOST_MODULES | `["autohost-logging-collector","autohost-metrics-collector","autohost-pubsub"]` |
| NS__HOST__API_PREFIX | `""` |
| NS_HOST_STATIC_PATH | `"public"` |
| NS__HOST__STATIC__MAX_AGE | `"1d"` |
| NS__HOST__URL_PREFIX | `"/nonstop"` |
| **logging** | |
| NS__LOGGING__LOG_CHANNEL | `"log"` |
| NS_LOGGING_NAMESPACE | `"nonstop-index-ui"` |
| NS__LOGGING__ADAPTERS__STD_OUT__LEVEL\* | `5` |
| NS__LOGGING__ADAPTERS__STD_OUT__TOPIC | `"autohost.access,nonstop-index-ui.#"` |
| NS__LOGGING__ADAPTERS__STD_OUT__BAIL_IF_DEBUG | `true` |
| **metrics** | |
| NS_METRICS_FANOUT | `"metronic.all.ex"` |
| NS_METRICS_TOPIC | `"metronic.topic.ex"` |
| **redis** | |
| NS_REDIS_HOST\* | `"localhost"` |
| NS_REDIS_PORT\* | `6379` |
| **session** | |
| NS_SESSION_CONFIG_NAME | `"nonstop-index-ui.sid"` |
| NS_SESSION_CONFIG_SECRET | `"I eat my peas with honey, I've done it all my life"` |
| NS_SESSION_REDIS_ENABLED | `false` |
| NS_SESSION_REDIS_HOST\* | `"127.0.0.1"` |
| NS_SESSION_REDIS_PORT\* | `6379` |
| NS_SESSION_REDIS_PREFIX\* | `"nonstop-index-ui"` |
<!-- /EnvironmentVariables -->
