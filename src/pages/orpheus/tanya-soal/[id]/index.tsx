import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Spinner,
  Text,
  Textarea,
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import UploadButton from "~/components/button/UploadButton";
import AnswerCard from "~/components/card/AnswerCard";
import { type UploadResult } from "~/components/form/TanyaPRForm";
import DownloadableImage from '~/components/image/DownloadableImage';
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const Id = () => {
  const toast = useToast();
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult[]>([]);
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { id } = router.query;
  const { data, refetch, isLoading, isError } = api.qna.getQuestion.useQuery({
    id: id as string,
  });
  const {
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid, errors },
    register,
    reset,
  } = useForm<{ content: string }>();
  const { status } = useSession();

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
      questionId: id as string,
      filePath: temp.toString(),
    });
  };

  if (isLoading) {
    return (
      <AkaLayout title="Tanya Soal" activeKey="">
        <Flex justifyContent="center">
          <Spinner mr=".5rem" />
          Memuat data...
        </Flex>
      </AkaLayout>
    );
  }

  if (isError) {
    return (
      <AkaLayout title="Tanya Soal" activeKey="">
        <Flex justifyContent="center">
          <Text>Terjadi kesalahan</Text>
        </Flex>
      </AkaLayout>
    );
  }

  return (
    <AkaLayout title="Tanya Soal" activeKey="">
      <VStack spacing="1rem" align="strecth">
        <Heading textTransform="capitalize" fontSize="xl">
          {data?.title}
        </Heading>
        <Flex direction="column" gap="1rem">
          <Text>{data?.content}</Text>
          <DownloadableImage src={data?.filePath ?? ''} width={250} height={250} />
        </Flex>
        <Flex>
          <Flex
            justifyContent="space-between"
            paddingInline=".5rem"
            width="100%"
          >
            <Text fontSize="2xs">{data?.createdAt.toLocaleString()}</Text>
            <Text fontSize="2xs">{data?.author?.profile?.name}</Text>
          </Flex>
        </Flex>
        <Divider />
      </VStack>
      <Box
        position="sticky"
        top="-2rem"
        zIndex="1"
        backgroundColor={colorMode === "dark" ? "#1a202c" : "white"}
        paddingBlock="1rem"
      >
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Flex direction="column" gap="1rem">
            <FormControl isInvalid={!!errors.content}>
              <Textarea
                placeholder="Tulis jawabanmu di sini"
                {...register("content", { required: "Jangan kosong yaa..." })}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </FormControl>
            <Flex justifyContent="space-between">
              <UploadButton
                isUploaded={isUploaded}
                setIsUploaded={setIsUploaded}
                setUploadResult={setUploadResult}
              />
              <Button
                type="submit"
                isDisabled={!isDirty || !isValid}
                isLoading={isSubmitting}
                loadingText="Submitting"
                size={{ base: "sm", md: "md" }}
                colorScheme="linkedin"
              >
                Answer
              </Button>
            </Flex>
          </Flex>
        </form>
      </Box>
      <VStack spacing="1rem" align="stretch">
        <Divider />
        {data?.answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            {...answer}
            refetch={refetch}
            vote={answer._count.votes}
            authorName={answer.author?.profile?.name}
          />
        ))}
      </VStack>
    </AkaLayout>
  );
};

export default Id;
