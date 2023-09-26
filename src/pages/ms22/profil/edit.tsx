import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CldUploadWidget } from "next-cloudinary";
import { type SubmitHandler, useForm } from "react-hook-form";
import LoadingPage from "~/components/loading/Loading";
import ProfileLayout from "~/layouts/ProfileLayout";
import { api } from "~/utils/api";
import { useState } from "react";
import { type UploadResult } from "~/components/form/TanyaPRForm";
import { FiCamera } from "react-icons/fi";
import CloImage from "~/components/image/CloImage";

const Edit = () => {
  const toast = useToast();
  const { data, isLoading } = api.user.getUserInfo.useQuery();
  const user = api.user.getUserInfo.useQuery();
  const updateUser = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await user.refetch();
      toast({
        title: "Berhasil",
        description: "Berhasil mengubah profil",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    },
  });
  const [upload, setUpload] = useState<UploadResult>({
    info: {
      public_id: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
  } = useForm<{ nama: string; email: string }>();

  const onSubmit: SubmitHandler<{ nama: string; email: string }> = async (
    data,
    e
  ) => {
    e?.preventDefault();

    if (upload.info.public_id) {
      await updateUser.mutateAsync({
        nim: user.data?.nim,
        name: data.nama,
        email: data.email,
        image: upload.info.public_id,
      });
    } else {
      await updateUser.mutateAsync({
        nim: user.data?.nim,
        name: data.nama,
        email: data.email,
      });
    }
  };
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ProfileLayout activeKey="Profil" title="Profil">
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: "2rem", md: "6rem" }}
        padding={{ base: "2rem", md: "2rem 3rem" }}
        height="100%"
        width="100%"
        alignItems={{ md: "center", base: "flex-start" }}
      >
        <Flex
          width={{ base: "100%", md: "auto" }}
          justifyContent={{ base: "center", md: "left" }}
        >
          <CldUploadWidget
            uploadPreset="soezyxst"
            onUpload={(result) => {
              setUpload(result as UploadResult);
            }}
          >
            {({ open }) => {
              function handleUpload() {
                open();
              }
              return (
                <Flex position="relative">
                  <CloImage
                    src={data?.profile?.image ?? ""}
                    width={{ base: "200px", md: "300px" }}
                    objectFit="cover"
                    objectPosition="center"
                    rounded="full"
                    aspectRatio={1}
                  />
                  <IconButton
                    icon={<FiCamera />}
                    aria-label="Edit Foto"
                    position="absolute"
                    fontSize={{ base: "1rem", md: "2rem" }}
                    bottom={{ base: ".75rem", md: "1.5rem" }}
                    right={{ base: ".75rem", md: "1.5rem" }}
                    bgColor="whiteAlpha.300"
                    width={{ base: "2.5rem", md: "3rem" }}
                    height={{ base: "2.5rem", md: "3rem" }}
                    rounded="full"
                    onClick={() => {
                      handleUpload();
                    }}
                  />
                </Flex>
              );
            }}
          </CldUploadWidget>
        </Flex>

        <Flex flexGrow="1">
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <VStack spacing="1rem" width="100%" align={"flex-start"}>
              <FormControl isInvalid={!!errors.nama}>
                <FormLabel>Nama</FormLabel>
                <Input
                  type="text"
                  defaultValue={data?.profile?.name}
                  size={{ base: "sm", md: "md" }}
                  minWidth={{ base: "15rem", md: "20rem" }}
                  {...register("nama", { required: "Ga boleh kosong" })}
                />
                <FormErrorMessage>{errors?.nama?.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>NIM</FormLabel>
                <Input
                  readOnly
                  type="text"
                  defaultValue={data?.nim}
                  size={{ base: "sm", md: "md" }}
                  minWidth={{ base: "15rem", md: "20rem" }}
                />
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="text"
                  defaultValue={data?.profile?.email ?? ""}
                  placeholder={data?.profile?.email ? "" : "Belum ada email"}
                  size={{ base: "sm", md: "md" }}
                  minWidth={{ base: "15rem", md: "20rem" }}
                  {...register("email")}
                />
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Prodi</FormLabel>
                <Input
                  type="text"
                  readOnly
                  defaultValue={data?.profile?.prodi ?? ""}
                  size={{ base: "sm", md: "md" }}
                  minWidth={{ base: "15rem", md: "20rem" }}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="linkedin"
                isLoading={isSubmitting}
                loadingText="Menyimpan"
                size={{ base: "sm", md: "md" }}
              >
                Simpan
              </Button>
            </VStack>
          </form>
        </Flex>
      </Flex>
    </ProfileLayout>
  );
};

export default Edit;
