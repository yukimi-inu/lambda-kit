# Lambda Dev Kit

LambdaKit is a package that helps you develop Lambda Functions in AWS. With this package in place, you can very quickly
run local tests, build involving packages, create ZIP packages for deployment, and deploy them.

LambdaDevKit can also be used as a "ts-node" replacement for TypeScript utilizing ESModules. ld-build command generates
JavaScript files with resolved dependencies. The ld-build command generates JavaScript files with resolved dependencies,
allowing you to easily run complex TypeScript without the need for complex module resolution in ts-node.

---

In particular, in JavaScript, there are cases where external packages are used, or TypeScript is used, and it is
necessary to build and resolve modules when running in Lambda. This package suggests a better way and provides a quick
way to perform that function. With this package, you will be able to develop more comfortably.

## Usage

### Build script

```shell
npx ld-build -e src/index.js -o dist/app/index.js
```

Of course, you can build TypeScript as well.

```shell
npx ld-build -e src/index.ts -o dist/app/index.js
```

If you specify the static folder, static files will be copied to the output destination. This allows external resources
such as JSON and binaries to be used in Lambda as well.

```shell
npx ld-build -e src/app/index.ts -s src/app -o dist/app/index.js
```

### Run script

Run the built script.

```shell
npx ld-run -e dist/app/index.js
```

By specifying JSON describing the event, it can be passed as an argument.

```shell
npx ld-run -e dist/app/index.js -i samples/test.json
```

### ZIP packages

You can generate a ZIP file for deployment with a simple command.

```shell
npx ld-pack -e ./dist/app -o dist/app.zip
```

By specifying the static folder when building, static resources (images, JSON, binaries, etc.) can be packaged at the
same time.

### Deploy your function

You can do everything from build to deployment in one go. Usually, a Function is updated in a very short time unless it
is a large build.

```shell
npx ld-deploy -n "your-function-name" -e ./src/index.ts -o ./dist/app/index.js -d ./dist/app -z ./dist/app.zip
```

### NPM Script Snippets

**Example**

```shell
{
    "build:app": "ld-build -e src/index.ts -o dist/app/index.js",
    "run:app": "yarn build:app; ld-run -e dist/app/index.js",
    "deploy:app": "ld-deploy -n test -e ./src/index.ts -o ./dist/app/index.js -d ./dist/app -z ./dist/app.zip"
}
```

With this kind of description, it is possible to specify JSON at any time when running tests.

**Example**

```shell
yarn run:app -i ./samples/test.json
```
