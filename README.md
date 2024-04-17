# shireburn-test

This is a Vue 3 application built with Vite. It's configured with TypeScript for static type checking, ESLint for enforcing code quality, and Prettier for consistent code formatting.

## Reasoning behind design choices

### Vue 3

Not limited by a previous limitation, but although Vue 2 is different from Vue 3, some of the features might be compatible

### TypeScript

Type checking is very convenient and saves hours of debugging problems caused by loosely typed languages such as JavaScript

### ESLint and Prettier

Linting tools help me focus on the problem at hand, not formatting code. ESLint was chosen because it was supported by Vue 3 out of the box.

### PNPM

Habit and already installed on my system. Comes very handy when installing other local projects as dependencies

### Bootstrap

Bootstrap provides resetting, theming, and viewport support out of the box. It is widely used and as such may be already cached on the user's device. It can be further customized to cut out any unused properties, but this comes at the cost of being unable to use the already-cached version on the user's device.

### Data Server

I used https://jsonbin.io to store and serve the data in instead of spinning up a server so that I can focus on developing the project.

## Project Structure

* `/pages` contains the two pages needed for the project
* `/components` contains the one component that is used by EmployeeDetails to show (and edit, if applicable) details and avoid repeated code for each detail
* `/enums` some enums to keep track of status
* `/objects` objects that are are used by the application
* `/services` provides classes that have functions, such as fetching data
* `config.ts` the config for the project
* `router.ts` the routing data for the project

## Getting Started

First, install the project dependencies (you may use `npm` instead of `pnpm`):

```sh
pnpm install
```

To start the development server with hot-reload:

```sh
pnpm dev
```

To type-check, compile, and minify for production:

```sh
pnpm build
```

To lint the code with ESLint:

```sh
pnpm lint
```

## IDE Setup

For the best development experience, we recommend using [VSCode](https://code.visualstudio.com/) with the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension. Make sure to disable Vetur if you have it installed.

## TypeScript Support

This project uses `vue-tsc` for type checking instead of the default TypeScript compiler to provide type information for `.vue` imports. In your editor, you'll need the Volar extension to make the TypeScript language service aware of `.vue` types.

## Testing

Testing wasn't set up for this project

## Customizing Configuration

For more details on how to customize the Vite configuration, see the [Vite Configuration Reference](https://vitejs.dev/config/).