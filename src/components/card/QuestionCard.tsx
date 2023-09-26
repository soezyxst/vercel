import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GoComment, GoHeart, GoHeartFill } from "react-icons/go";
import { api } from "~/utils/api";
import AnswerPRForm from "../form/AnswerPRForm";
import AnswerDrawer from "../drawer/AnswerDrawer";
import { FiMoreVertical } from "react-icons/fi";
import { useSession } from "next-auth/react";
import DownloadableImage from "../image/DownloadableImage";

export interface CustomCardProps {
  filePath?: string | null;
  id?: string;
  title?: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  authorId?: string | null;
  authorName?: string | null;
  refetch?: () => unknown;
  isLoading?: boolean;
  type?: string;
  children?: React.ReactNode;
  index?: number;
}

export interface QuestionCardProps extends CustomCardProps {
  tags?: string[];
  vote?: number;
  status?: string;
  answer?: number;
  isMd?: boolean;

  answerRefetch?: () => unknown;
  voteRefetch?: () => unknown;
}

const QuestionCard = ({
  filePath,
  title,
  content,
  vote = 0,
  answer = 0,
  authorName,
  createdAt,
  id,
  isMd,
  authorId,
  refetch,
}: QuestionCardProps) => {
  const toast = useToast();
  const { data: session } = useSession();
  const isVoted = api.vote.isVoted.useQuery({ questionId: id ?? "" });
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
  const deleteQuestion = api.qna.deleteQuestion.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
      toast({
        title: "Berhasil menghapus pertanyaan",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const AnswerDisclosure = useDisclosure();

  return (
    <Card variant="outline" height="fit-content">
      <CardHeader>
        <Flex justifyContent="space-between">
          <Link href={`/orpheus/tanya-soal/${id}`} height="100%" width="100%">
            <Heading size="md" textTransform="capitalize" flexGrow="1">
              {title}
            </Heading>
          </Link>
          {session?.user.id === authorId && (
            <Menu>
              <MenuButton>
                <FiMoreVertical cursor="pointer" />
              </MenuButton>
              <MenuList fontSize="sm">
                <MenuItem
                  onClick={() => {
                    deleteQuestion.mutate({ id: id! });
                  }}
                >
                  Hapus
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </CardHeader>
      <CardBody paddingTop="0">
        <Text mb=".5rem" whiteSpace="pre-line">
          {content}
        </Text>
        <Flex flexWrap="wrap" gap=".5rem">
          {filePath
            ? filePath
                .split(",")
                .map((path, index) => (
                  <DownloadableImage key={index} src={path} height={100} />
                ))
            : null}
        </Flex>
      </CardBody>
      <CardFooter
        flexDirection="column"
        flexWrap="wrap"
        gap=".5rem"
        cursor="default"
        onClick={() => {
          return;
        }}
      >
        <Flex justifyContent="space-between" paddingInline=".5rem">
          <Text fontSize="2xs">{createdAt?.toLocaleString()}</Text>
          <Text fontSize="2xs">{authorName}</Text>
        </Flex>
        <Divider />
        <Flex justifyContent="space-between">
          <AnswerPRForm
            isOpen={isOpen}
            onClose={onClose}
            questionId={id ?? ""}
            refetch={refetch}
          />
          <AnswerDrawer {...AnswerDisclosure} questionId={id ?? ""} />
          <Button
            leftIcon={<GoComment />}
            onClick={() => {
              if (!isMd) return AnswerDisclosure.onOpen();
              onOpen();
            }}
            size={{ base: "sm", md: "md" }}
          >
            {" "}
            {answer} Answers
          </Button>
          <Button
            isLoading={votes.isLoading || unvotes.isLoading}
            bgColor="transparent"
            _hover={{ backgroundColor: "transparent" }}
            leftIcon={!isVoted.data ? <GoHeart /> : <GoHeartFill />}
            onClick={() => {
              if (isVoted.data) {
                unvotes.mutate({ questionId: id });
                return;
              }
              votes.mutate({ questionId: id });
            }}
          >
            {" "}
            {vote} Votes
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;
