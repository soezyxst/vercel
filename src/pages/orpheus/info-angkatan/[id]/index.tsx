import { Divider, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { useRouter } from "next/router";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import { markdownTheme } from "~/components/card/AnnouncementCard";
import DownloadableImage from "~/components/image/DownloadableImage";
import FetchingComponent from "~/components/loading/Fetching";
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const Id = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading, isError, isSuccess, isFetching } =
    api.announcement.getAnnouncement.useQuery({
      id: id as string,
    });

  return (
    <AkaLayout activeKey="Info Angkatan" title="Info Angkatan">
      <FetchingComponent
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        isSuccess={isSuccess}
        noData={!data}
      >
        <VStack spacing="1rem" align="left">
          <Heading
            fontSize={{ base: "xl", md: "3xl" }}
            textTransform="capitalize"
          >
            {data?.title}
          </Heading>
          <Divider />
          {data?.filePath && <DownloadableImage src={data?.filePath ?? ""} />}
          <Text whiteSpace="pre-line">
            <ReactMarkdown
              components={ChakraUIRenderer(markdownTheme)}
              remarkPlugins={[remarkGfm]}
            >
              {data?.content ?? ""}
            </ReactMarkdown>
          </Text>
          <Divider />
          <Flex justifyContent="space-between">
            <Text fontSize="xs">{data?.updatedAt.toLocaleString()}</Text>
            <Text fontSize="xs">{data?.author?.profile?.name}</Text>
          </Flex>
        </VStack>
      </FetchingComponent>
    </AkaLayout>
  );
};

export default Id;
