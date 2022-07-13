### How to spin up:

1. `npm install`
2. `make start/prod` - this will download app's image from [dockerhub](https://hub.docker.com/repository/docker/wardroid/base-app) and spin up app and db containers. Read more about available commands in TEMPLATE_README.MD
3. Open `./cURLs` file for request examples
4. Only E2E tests are created, run `npm run test:e2e`. They assume DB already up and seeded with data. If not run `make start/db` first before running them.
