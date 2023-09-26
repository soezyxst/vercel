import { Divider, Flex, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const Id = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.link.getLinkPenting.useQuery({
    id: id as string,
  });

  return (
    <AkaLayout activeKey="Link Penting" title="Link Penting">
      <VStack spacing="1rem" align="left">
        <Heading fontSize={{ base: "xl", md: "3xl" }} textTransform='capitalize'>
          {data?.linkPenting?.title}
        </Heading>
        <Divider />
        <Text fontSize={{ base: "sm", md: "md" }}>
          {"URL: "}
          <Link isExternal href={data?.linkPenting?.url}>{data?.linkPenting?.url}</Link>
        </Text>
        <Text whiteSpace="pre-line" fontSize={{ base: "xs", md: "sm" }}>
          {"--- " + data?.linkPenting?.description + " ---"}
        </Text>
        <Divider />
        <Flex justifyContent="space-between">
          <Text fontSize="xs">
            {data?.linkPenting?.updatedAt.toLocaleString()}
          </Text>
          <Text fontSize="xs">{data?.linkPenting?.author?.profile?.name}</Text>
        </Flex>
      </VStack>
    </AkaLayout>
  );
};

export default Id;
