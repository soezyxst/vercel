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
        <title>{title ? `${title} | Orpheus` : "X | orpheus"}</title>
        <meta name="description" content="Webnya ADI" />
      </Head>
      {children}
    </Flex>
  );
}
