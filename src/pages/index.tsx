import Layout from "~/layouts/TitleLayout";
import { Flex, Heading, Image, Link } from "@chakra-ui/react";
import Nav from "~/components/layout/Nav";

const Home = () => {
  return (
    <Layout title="Home">
      <Nav>
        <Flex
          alignItems="stretch"
          justifyContent="right"
          gap="1rem"
        >
          <Link
            href="/ms22"
            paddingInline="1rem"
            position="relative"
          >
            <Flex alignItems="center" height="100%" justifyContent="center">
              {"Orpheus"}
            </Flex>
          </Link>
        </Flex>
      </Nav>
      <Flex
        padding={{ base: "1rem", md: "2rem" }}
        height="100%"
        direction={{ base: "column", md: "row" }}
        gap="3rem"
        alignItems="center"
        justifyContent="center"
        maxWidth="100vw"
        overflowX="hidden"
      >
        <Image src="/logo.png" alt="" width="80%" maxWidth="5rem" />
        <Heading fontSize={{base: 'xl', md: '4xl'}}>Soezyxst by Adi</Heading>
      </Flex>
    </Layout>
  );
};

export default Home;
