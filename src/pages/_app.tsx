import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { type AppProps, type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "~/styles/theme";
import { type NextComponentType } from "next";
import FramerMotion from "~/layouts";
import LoadingPage from "~/components/loading/Loading";

type CustomAppProps = AppProps & {
  Component: NextComponentType & { auth?: boolean }; // add auth type
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) => {
  return (
      <SessionProvider session={session as Session}>
        <ChakraProvider theme={theme}>
          <FramerMotion>
            {Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </FramerMotion>
        </ChakraProvider>
      </SessionProvider>
  );
};

function Auth({ children }: { children: React.ReactNode }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <LoadingPage />;
  }

  return children;
}
export default api.withTRPC(MyApp);
