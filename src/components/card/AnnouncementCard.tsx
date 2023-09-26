import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Heading,
  CardFooter,
  Flex,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { type CustomCardProps } from "./QuestionCard";
import { AnnouncementType } from "@prisma/client";
import { type ReactNode, useState } from "react";
import DownloadableImage from "../image/DownloadableImage";
import ReactMarkdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import remarkGfm from "remark-gfm";

export const markdownTheme = {
  p: ({ children }: { children: ReactNode }) => {
    return (
      <Text lineHeight="1.75rem">
        {children}
      </Text>
    );
  },
};

const AnnouncementCard = ({
  title,
  filePath,
  content = "description",
  authorName,
  id,
  type,
  updatedAt
}: CustomCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { colorMode } = useColorMode();

  return (
    <Card id={id}>
      <CardHeader>
        <Link
          href={
            type === AnnouncementType.ACADEMIC
              ? `info-kuliah/${id}`
              : `info-angkatan/${id}`
          }
        >
          <Heading size="md" textTransform="capitalize">
            {title}
          </Heading>
        </Link>
      </CardHeader>
      <CardBody gap="2rem" paddingBlock={0}>
        <Flex gap="1rem" direction="column">
          {filePath
            ? filePath
                .split(",")
                .map((path, index) => (
                  <DownloadableImage src={path} key={index} />
                ))
            : null}
          <Text
            fontSize={{ base: "sm", md: "md" }}
            whiteSpace="pre-line"
            display={isExpanded ? "block" : "-webkit-box"}
            overflow={isExpanded ? "auto" : "hidden"}
            sx={
              isExpanded
                ? {}
                : {
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: "5",
                  }
            }
          >
            <ReactMarkdown
              components={ChakraUIRenderer(markdownTheme)}
              remarkPlugins={[remarkGfm]}
            >
              {content}
            </ReactMarkdown>
          </Text>
          {content.split("\n").length > 5 && (
            <Text
              color={colorMode === "dark" ? "blue.400" : "blue.600"}
              cursor="pointer"
              onClick={() => setIsExpanded(!isExpanded)}
              fontSize={{ base: "xs", md: "sm" }}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Text>
          )}
        </Flex>
      </CardBody>
      <CardFooter>
        <Flex justifyContent="space-between" width="100%">
          <Text fontSize="2xs">{authorName}</Text>
          <Text fontSize="2xs">
            {"Last update: " + updatedAt?.toLocaleString()}
          </Text>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default AnnouncementCard;
