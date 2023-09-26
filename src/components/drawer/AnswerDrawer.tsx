import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  Spinner,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { type UploadResult } from "../form/TanyaPRForm";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import AnswerCard from "../card/AnswerCard";
import { useSession } from "next-auth/react";
import UploadButton from "~/components/button/UploadButton";

interface AnswerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  questionId?: string;
}

const AnswerDrawer = ({ isOpen, onClose, questionId }: AnswerDrawerProps) => {
  const toast = useToast();
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult[]>([]);

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid, errors },
    register,
    reset,
  } = useForm<{ content: string }>();
  const { status } = useSession();

  const getAnswers = api.qna.getAnswers.useQuery({ questionId: questionId! });
  const createAnswer = api.qna.createAnswer.useMutation({
    onSuccess: async (data) => {
      await getAnswers.refetch();
      toast({
        title: "Berhasil!",
        description: data.message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      reset();
    },
  });

  const onSubmit: SubmitHandler<{ content: string }> = async (data, e) => {
    if (status !== "authenticated") {
      toast({
        title: "Gagal!",
        description: "Kamu harus login terlebih dahulu",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    e?.preventDefault();

    const temp = uploadResult.map((result) => result.info.public_id);

    await createAnswer.mutateAsync({
      content: data.content,
      questionId: questionId!,
      filePath: temp.toString(),
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" isFullHeight>
      <DrawerOverlay />
      <DrawerContent height="100dvh">
        <DrawerCloseButton />
        <DrawerHeader>Answer</DrawerHeader>
        <DrawerBody>
          <Flex direction="column" gap="1rem" height="100%">
            <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
              <Flex direction="column" gap="1rem">
                <FormControl isInvalid={!!errors.content}>
                  <Textarea
                    placeholder="Tulis jawabanmu di sini"
                    {...register("content", {
                      required: "Jangan kosong yaa...",
                    })}
                  />
                  <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
                </FormControl>
                <Flex justifyContent="space-between">
                  <UploadButton setIsUploaded={setIsUploaded} setUploadResult={setUploadResult} isUploaded={isUploaded} />
                  <Button
                    type="submit"
                    isDisabled={!isDirty || !isValid}
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                  >
                    Answer
                  </Button>
                </Flex>
              </Flex>
            </form>
            <Divider />
            <Flex direction="column" height="100%" overflow="hidden">
              <Flex
                direction="column"
                gap="1rem"
                height="100%"
                overflowY="scroll"
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "0",
                  },
                }}
              >
                {getAnswers.isLoading ? (
                  <Flex justifyContent="center">
                    <Spinner />
                  </Flex>
                ) : (
                  getAnswers.data?.map((answer) => (
                    <AnswerCard
                      key={answer.id}
                      {...answer}
                      refetch={getAnswers.refetch}
                      vote={answer._count.votes}
                      authorName={answer.author?.profile?.name}
                    />
                  ))
                )}
              </Flex>
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default AnswerDrawer;
