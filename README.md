# Installation

The application was developed on MacBook Air M1 with node v20.11.0.

If you have [volta](https://volta.sh) you can install this node version with:

```
volta install node
```

Install dependencies:

```
npm install
```

# Running the application

Server will run on http://localhost:5173/.

```
npm run dev
```

# Application's overview

The Application is a fitness app for my person use. It is optimize for using Myo reps protocol (https://www.youtube.com/watch?v=V71TGRQaLRs).

# Project structure

The app is eagerly loaded, as for my I didn't need lazy loading, but the application was designed the way that allows lazy loading.

    app
        core - business logic used by multiply features
        features - business features, contains components and specific business logic
        layout - components used for application layout
        pattern - components that modify the application but don't belong to a specific feature
        ui - generic components
    components - shadcn/ui components
    lib - utils
    store - redux toolkit wiring
