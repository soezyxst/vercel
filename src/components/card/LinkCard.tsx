import {
  Card,
  CardBody,
  Heading,
  Text,
  Link,
  Flex,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { type CustomCardProps } from "./QuestionCard";

interface LinkCardProps extends CustomCardProps {
  description?: string;
  url?: string;
  type?: string;
}

const LinkCard = ({
  title,
  description,
  url,
  updatedAt,
  authorName,
  id,
  index = 0,
}: LinkCardProps) => {
  const { colorMode } = useColorMode();
  return (
    <Card
      id={id}
      backgroundColor={
        colorMode === "dark"
          ? index % 2 === 0
            ? "blue.800"
            : "gray.700"
          : index % 2 === 0
          ? "blue.100"
          : "green.100"
      }
      variant="filled"
    >
      <CardBody>
        <Flex direction="column" gap=".5rem" width="100%" alignItems="stretch">
          <Link href={`link-penting/${id}`}>
            <Heading size="md" textTransform="capitalize" mb=".5rem">
              {title}
            </Heading>
          </Link>
          <VStack spacing=".5rem" align='left'>
            {url?.split("\n").map((link, index) => (
              <Link
                key={index}
                href={link}
                isExternal
                fontSize={{ base: 'sm', md: 'md' }}
                fontFamily="mono"
                fontWeight={300}
                color={colorMode === 'dark' ? "blue.300" : "blue.600"}
                fontStyle='italic'
              >
                {link}
              </Link>
            ))}
          </VStack>
          <Text
            fontSize="sm"
            whiteSpace="pre-line"
            paddingInline="1.5rem"
            paddingBlock="1rem"
            border="1px solid gray"
            rounded="md"
            backgroundColor={
              colorMode === "light"
                ? index % 2 === 0
                  ? "green.50"
                  : "blue.50"
                : index % 2 === 0
                ? "gray.700"
                : "blue.700"
            }
          >
            {description}
          </Text>
          <Flex justifyContent="space-between" mt="1rem">
            <Text fontSize="2xs">{authorName}</Text>
            <Text fontSize="2xs">
              {"Last update: " + updatedAt?.toLocaleString()}
            </Text>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default LinkCard;
