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

The Application is a fitness app for my person use. It is optimize for using [Myo reps protocol](https://www.youtube.com/watch?v=V71TGRQaLRs), it's a workout protocol when timing between sets of given exercise is very precise and short.

# Project structure

The app is based on architecture described in [Angular enterprise architecture](https://angularexperts.io/products/ebook-angular-enterprise-architecture).

    app
        core - business logic used by multiply features
        features - business features, contains components and specific business logic
        layout - components used for application layout
        pattern - components that modify the application but don't belong to a specific feature
        ui - generic components
    components/ui - shadcn/ui components
    lib - utils
    store - redux toolkit wiring

The session's store and domain are inside the feature folder as they are only used in the sessions feature.

For permanent storage I use IndexedDB as I don't need more, for now at least. The business logic is separated from the store. Influenced by [Modularizing React Applications with Established UI Patterns](https://martinfowler.com/articles/modularizing-react-apps.html) article.
