import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import UploadButton from "~/components/button/UploadButton";
import { api } from "~/utils/api";

export interface DisclosureProps {
  onClose: () => void;
  onOpen?: () => void;
  refetch?: () => unknown;
  isOpen: boolean;
}

interface TanyaPRFormProps {
  title: string;
  content: string;
}

export type UploadResult = {
  info: {
    public_id: string;
  };
};

const TanyaPRForm = ({ onClose, isOpen, refetch }: DisclosureProps) => {
  const toast = useToast();
  const {
    register,
    formState: { isDirty, isSubmitting, isValid, errors },
    handleSubmit,
    reset,
  } = useForm<TanyaPRFormProps>();
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult[]>([]);

  const createQuestion = api.qna.createQuestion.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
      onClose();
      setIsUploaded(false);
      reset();
    },
  });

  const onSubmit: SubmitHandler<TanyaPRFormProps> = async (data, e) => {
    e?.preventDefault();

    const temp = uploadResult.map((result) => result.info.public_id);

    const res = await createQuestion.mutateAsync({
      title: data.title,
      content: data.content,
      filePath: temp.toString(),
    });

    if (res?.message) {
      toast({
        title: "Berhasil!",
        description: res.message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
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
          <ModalHeader>Ayo Tanya!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Judul</FormLabel>
              <Input
                type="text"
                {...register("title", { required: "Tambahin judul ya..." })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.content}>
              <FormLabel>Konten</FormLabel>
              <Textarea
                minHeight="40vh"
                {...register("content", {
                  required: "Kasih deskripsi singkat dong",
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

export default TanyaPRForm;
