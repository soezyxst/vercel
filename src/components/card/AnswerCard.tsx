import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { api } from "~/utils/api";
import { type QuestionCardProps } from "./QuestionCard";
import DownloadableImage from '../image/DownloadableImage';

const AnswerCard = ({
  filePath,
  content,
  vote = 0,
  authorName,
  updatedAt,
  id,
  refetch,
}: QuestionCardProps) => {
  const toast = useToast();
  const isVoted = api.vote.isVoted.useQuery({ answerId: id ?? "" });
  const votes = api.vote.vote.useMutation({
    onSuccess: async () => {

      if (refetch) await refetch();
      await isVoted.refetch();
    },
    onError: (error) => {
      toast({
        title: "Vote gagal",
        description: error.message,
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    },
  });
  const unvotes = api.vote.unvote.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
      await isVoted.refetch();
    },
    onError: (error) => {
      toast({
        title: "Unvote gagal",
        description: error.message,
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    },
  });

  return (
    <Card variant="unstyled" height="fit-content" backgroundColor="transparent">
      <CardBody paddingTop="0">
        <Text fontWeight="bold" fontSize="small">
          {authorName}
        </Text>
        <Text whiteSpace='pre-line' mb={filePath ? ".5rem" : "0"} fontSize="small">
          {content}
        </Text>
        {filePath && (
          <DownloadableImage src={filePath} />
        )}
      </CardBody>
      <CardFooter flexDirection="column" flexWrap="wrap" gap=".5rem">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="2xs">{updatedAt?.toLocaleString()}</Text>
          <Button
            backgroundColor="transparent"
            fontSize="small"
            _hover={{ backgroundColor: "transparent" }}
            isLoading={votes.isLoading || unvotes.isLoading}
            leftIcon={!isVoted.data ? <GoHeart /> : <GoHeartFill />}
            onClick={() => {
              if (isVoted.data) {
                unvotes.mutate({ answerId: id });
                return;
              }
              votes.mutate({ answerId: id });
            }}
          >
            {" "}
            {vote} Votes
          </Button>
        </Flex>
        <Divider />
      </CardFooter>
    </Card>
  );
};

export default AnswerCard;
