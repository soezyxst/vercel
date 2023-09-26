import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  FormErrorMessage,
  Flex,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { type UploadResult, type DisclosureProps } from "./TanyaPRForm";
import { useState } from "react";
import { useSession } from "next-auth/react";
import UploadButton from "~/components/button/UploadButton";

interface CreateAnswerFormProps {
  content: string;
}

interface CreateAnswerProps extends DisclosureProps {
  questionId: string;
}

const AnswerPRForm = ({
  onClose,
  isOpen,
  refetch,
  questionId,
}: CreateAnswerProps) => {
  const toast = useToast();
  const {
    register,
    formState: { isDirty, isSubmitting, isValid, errors },
    handleSubmit,
    reset,
  } = useForm<CreateAnswerFormProps>();
  const { status } = useSession();

  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult[]>([]);

  const createAnswer = api.qna.createAnswer.useMutation({
    onSuccess: async (data) => {
      if (refetch) await refetch();
      toast({
        title: "Berhasil!",
        description: data.message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      onClose();
      reset();
    },
  });

  const onSubmit: SubmitHandler<CreateAnswerFormProps> = async (data, e) => {
    if (status === "unauthenticated") {
      toast({
        title: "Gagal!",
        description: "Silahkan login terlebih dahulu",
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
      questionId: questionId,
      filePath: temp.toString(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setIsUploaded(false);
      }}
      size={{ base: "sm", md: "2xl", lg: "5xl" }}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Input type="submit" isDisabled disabled display="none" aria-hidden />
          <ModalHeader>Answer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.content}>
              <FormLabel>Konten</FormLabel>
              <Textarea
                minHeight="40vh"
                {...register("content", {
                  required: "Link jangan kosong dong",
                })}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </FormControl>
            <Flex marginTop="1rem">
              <UploadButton
                isUploaded={isUploaded}
                setIsUploaded={setIsUploaded}
                setUploadResult={setUploadResult}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText={"Submitting..."}
              isDisabled={!isDirty || !isValid}
              colorScheme="linkedin"
            >
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AnswerPRForm;
