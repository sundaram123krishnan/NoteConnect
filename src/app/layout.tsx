import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from "classnames";
import { headers } from "next/headers";
import { Metadata, Viewport } from "next";

import {
  baseURL,
  style,
  meta,
  og,
  schema,
  social,
} from "@/once-ui/resources/config";
import { Background, Column, Flex, ToastProvider } from "@/once-ui/components";

import { Inter, Raleway, Sora } from "next/font/google";
import Navbar from "@/once-ui/components/Navbar";

const primary = Raleway({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const code = Sora({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
});

type FontConfig = {
  variable: string;
};

/*
	Replace with code for secondary and tertiary fonts
	from https://once-ui.com/customize
*/
const secondary: FontConfig | undefined = undefined;
const tertiary: FontConfig | undefined = undefined;
/*
 */

// export async function generateMetadata(): Promise<Metadata> {
//   const host = (await headers()).get("host");
//   const metadataBase = host ? new URL(`https://${host}`) : undefined;

//   return {
//     title: meta.title,
//     description: meta.description,
//     openGraph: {
//       title: og.title,
//       description: og.description,
//       url: "https://" + baseURL,
//       images: [
//         {
//           url: og.image,
//           alt: og.title,
//         },
//       ],
//       type: og.type as
//         | "website"
//         | "article"
//         | "book"
//         | "profile"
//         | "music.song"
//         | "music.album"
//         | "music.playlist"
//         | "music.radio_station"
//         | "video.movie"
//         | "video.episode"
//         | "video.tv_show"
//         | "video.other",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: og.title,
//       description: og.description,
//       images: [og.image],
//     },
//     metadataBase,
//   };
// }

// const schemaData = {
//   "@context": "https://schema.org",
//   "@type": schema.type,
//   url: "https://" + baseURL,
//   logo: schema.logo,
//   name: schema.name,
//   description: schema.description,
//   email: schema.email,
//   sameAs: Object.values(social).filter(Boolean),
// };
const APP_NAME = "NoteConnect";
const APP_DEFAULT_TITLE = "NoteConnect - Share and Download Notes";
const APP_TITLE_TEMPLATE = "NoteConnect";
const APP_DESCRIPTION = "NoteConnect - Share and Download Notes";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      as="html"
      lang="en"
      fillHeight
      background="page"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-border={style.border}
      data-theme={style.theme}
      data-solid={style.solid}
      data-solid-style={style.solidStyle}
      data-surface={style.surface}
      data-transition={style.transition}
      data-scaling={style.scaling}
      dir="ltr"
      className={classNames(
        primary.variable,
        code.variable,
        secondary ? secondary.variable : "",
        tertiary ? tertiary.variable : ""
      )}
    >
      <head />
      <ToastProvider>
        <Column as="body" fillWidth margin="0" padding="0" vertical="start">
          <Background
            position="absolute"
            mask={{
              x: 100,
              y: 0,
              radius: 100,
            }}
            gradient={{
              display: true,
              x: 100,
              y: 60,
              width: 70,
              height: 50,
              tilt: -40,
              opacity: 90,
              colorStart: "accent-background-strong",
              colorEnd: "page-background",
            }}
            grid={{
              display: true,
              opacity: 100,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          />
          <Flex direction="column" center>
            <Navbar />
            <Column
              overflow="hidden"
              as="main"
              maxWidth="l"
              position="relative"
              radius="xl"
              paddingX="s"
              marginTop="l"
              fillWidth
              zIndex={5}
              center
            >
              {children}
            </Column>
          </Flex>
        </Column>
      </ToastProvider>
    </Flex>
  );
}
