import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Role } from '@prisma/client';
import { useState } from "react";
import LoadingPage from '~/components/loading/Loading';
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const TanyaPR = () => {
  const toast = useToast();
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const questionsTitle = api.qna.getQuestionsTitle.useQuery({});
  const deleteQuestion = api.qna.deleteQuestion.useMutation({
    onSuccess: async () => {
      await questionsTitle.refetch();
      toast({
        title: "Question deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    },
  });
  return (
    <AkaLayout title="Admin - Tanya PR" activeKey="Admin">
      <Heading fontSize={{ base: "lg", md: "3xl" }}>Tanya PR</Heading>
      <VStack align="flex-start" spacing={2}>
        {questionsTitle.data?.map((question, index) => (
          <>
            <Flex
              key={question.id}
              padding=".5rem"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text
                textTransform="capitalize"
                fontSize={{ base: "sm", md: "md" }}
              >
                {question.title + " - " + question.author?.profile?.name}
              </Text>
              <Flex gap=".5rem">
                <Button
                  colorScheme="red"
                  isDisabled={deleteQuestion.isLoading}
                  isLoading={
                    deleteQuestion.isLoading && activeKey === question.id
                  }
                  loadingText="Deleting..."
                  onClick={() => {
                    setActiveKey(question.id);
                    deleteQuestion.mutate({ id: question.id });
                  }}
                >
                  Delete
                </Button>
              </Flex>
            </Flex>
            <Divider key={index} />
          </>
        ))}
      </VStack>
    </AkaLayout>
  );
};

TanyaPR.auth = {
  role: Role.ADMIN || Role.SUPERADMIN,
  loading: <LoadingPage />,
  unauthorized: "/orpheus",
};

export default TanyaPR;
