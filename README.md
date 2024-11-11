# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/RoierS/nodejs2024Q3-service.git
```

- Change folder

```
cd nodejs2024Q3-service
```

- Change the branch

```
git checkout Home-Library/part-1

```

- Installing NPM modules

```
npm install

```

- Rename .env.example to .env.

```sh
cp .env.example .env
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites:

- users:

```
npm run test test/users.e2e.spec.ts
```

- tracks:

```
npm run test test/tracks.e2e.spec.ts
```

- albums:

```
npm run test test/albums.e2e.spec.ts
```

- artists:

```
npm run test test/artists.e2e.spec.ts
```

- favorites:

```
npm run test test/favorites.e2e.spec.ts
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
