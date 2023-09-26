import { Flex } from "@chakra-ui/react";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <Flex direction="column" width="100%" minHeight="100dvh" height="100dvh">
      <Head>
        <title>{title ? `${title} | MS22` : "X | MS22"}</title>
        <meta name="description" content="Webnya ADI" />
      </Head>
      {children}
    </Flex>
  );
}
