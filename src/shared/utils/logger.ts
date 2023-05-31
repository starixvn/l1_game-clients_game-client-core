declare global {
    interface Window {
        Sentry: any;
    }
}

export const sentryLogger = {
    sentryUrl: "",
    env: "",
    identifier: "",
    loaded: false,
    isEnabled: () => {
        return sentryLogger.sentryUrl && document && document.head;
    },
    loadScript: () => {
        if (window.Sentry && !sentryLogger.loaded) {
            window.Sentry.init({
                dsn: sentryLogger.sentryUrl,
                environment: sentryLogger.env,
                maxValueLength: 5000,
                ignoreErrors: [
                    "fullscreen error",
                    "exitFullscreen",
                    "start the audio device",
                    "Network Error",
                    "zaloJSV2",
                    "socket disconnect",
                    "UnhandledRejectionhttps",
                    "cocos2d-js-min",
                    "cocos-creator",
                    "timeout",
                    "WebGLRenderingContext",
                    "websocket error",
                    "undefined is not an object (evaluating 'cc.RedT.user')",
                    /^.*Cannot read properties.*(?:user|setAvatar|onSet|setLoadingVisibility).*$/gm,
                    /^.*not an object.*(?:openGame|openNewSocket|gameName|language|this.percent|this.pagination|remoteBundle).*$/gm,
                ],
            });
            window.Sentry.setTag("game-client", sentryLogger.identifier);

            sentryLogger.loaded = true;
        }
    },
    start: (sentryUrl = "", env = "", identifier = "") => {
        try {
            if (!sentryUrl) {
                return;
            }
            sentryLogger.sentryUrl = sentryUrl;
            sentryLogger.env = env;
            sentryLogger.identifier = identifier;

            const sentryScript = document?.createElement("script");
            if (sentryScript) {
                sentryScript.setAttribute("id", "sentry-logger");
                sentryScript.setAttribute("src", "https://browser.sentry-cdn.com/5.15.0/bundle.min.js");
                sentryScript.setAttribute("integrity", "sha384-+ysfQckQvwCB5SppH41IScIz/Iynt2pePnJNMl+D7ZOzDJ+VYhQEuwB0pA60IDM0");
                sentryScript.setAttribute("crossorigin", "anonymous");
                sentryScript.onload = () => {
                    sentryLogger.loadScript();
                };
            }

            document?.head.appendChild(sentryScript);
        } catch (err) {
            console.log(err);
        }
    },

    logInfo: (message: string) => {
        if (sentryLogger.isEnabled()) {
            sentryLogger.loadScript();
            window.Sentry?.captureMessage(`${sentryLogger.identifier}: ${message}`);
        }
    },

    logError: (exception: string | Error) => {
        if (sentryLogger.isEnabled()) {
            sentryLogger.loadScript();
            if (typeof exception === "string") {
                window.Sentry?.captureMessage(`${sentryLogger.identifier}: ${exception}`, "error");
            } else {
                window.Sentry?.captureMessage(`${sentryLogger.identifier}: ${exception.message}`, "error");
            }
        }
    },
};
