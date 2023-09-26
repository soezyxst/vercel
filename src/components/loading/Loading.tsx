import { Flex, Heading, Spinner } from "@chakra-ui/react";

const LoadingPage = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100%"
    >
      <Spinner mr="1rem" size="lg" />
      <Heading>Loading...</Heading>
    </Flex>
  );
};

export default LoadingPage;
