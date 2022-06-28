import * as Sentry from "@sentry/browser"
import { BrowserTracing } from "@sentry/tracing"

Sentry.init({
    dsn: "https://9b9db137855b41c2b2da9fe13880e5ae@o1282782.ingest.sentry.io/6491331",
    integrations: [ new BrowserTracing() ],
    tracesSampleRate: 1.0,
});