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
