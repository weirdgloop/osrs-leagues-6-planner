import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { StoreProvider } from "../stores/StoreContext";

import apple_touch_icon from "../assets/apple-touch-icon.png";
import favicon_svg from "../assets/favicon.svg";
import favicon_ico from "../assets/favicon.ico";
import favicon_96x96 from "../assets/favicon-96x96.png";

import "@fontsource/ibm-plex-sans";
import "@fontsource/ibm-plex-sans/700";
import "@fontsource/pt-serif/700";
import appCss from "../styles.css?url";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Demonic Pacts Planner - OSRS Wiki",
      },
      {
        property: "og:title",
        content: "Demonic Pacts Planner - OSRS Wiki",
      },
      {
        property: "og:description",
        content:
          "Plan what you will choose in Leagues VI using our Demonic Pacts tree.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: favicon_96x96,
        sizes: "96x96",
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: favicon_svg,
      },
      {
        rel: "shortcut icon",
        href: favicon_ico,
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: apple_touch_icon,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere">
        <StoreProvider>
          <Header />
          {children}
          <Footer />
        </StoreProvider>
        <TanStackDevtools
          config={{
            position: "bottom-right",
            hideUntilHover: true,
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
