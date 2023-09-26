import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputRightElement,
  InputGroup,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ProfileLayout from "~/layouts/ProfileLayout";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";

const GantiPassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();

  const changePassword = api.user.changePassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Password berhasil diganti",
        status: "success",
        isClosable: true,
        position: "top",
      });
    },
    onError: (err) => {
      toast({
        title: "Gagal",
        description: err.message,
        status: "error",
        isClosable: true,
        position: "top",
      });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid, isSubmitting },
    reset,
    watch,
  } = useForm<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();

  const onSubmit: SubmitHandler<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }> = async (data, e) => {
    e?.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Gagal",
        description: "Password baru dan konfirmasi password tidak sama",
        status: "error",
        isClosable: true,
        position: "top",
      });
      return;
    }

    await changePassword.mutateAsync(data);

    reset();
  };

  return (
    <ProfileLayout activeKey="Ganti Password" title="Ganti Password">
      <Flex
        paddingInline={{ base: "2rem", md: "4rem" }}
        paddingBlock={{ base: "1.5rem", md: "2rem" }}
        direction="column"
        gap={{ base: "1rem", md: "2rem" }}
      >
        <Heading fontSize={{ base: "larger", md: "4xl" }}>
          Ganti Password
        </Heading>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <VStack align="flex-start" spacing={6}>
            <FormControl isInvalid={!!errors.oldPassword}>
              <FormLabel>Password Lama</FormLabel>
              <InputGroup>
                <Input
                  type={showOldPassword ? "text" : "password"}
                  {...register("oldPassword", { required: "Gak boleh kosong" })}
                />
                <InputRightElement>
                  {showOldPassword ? (
                    <AiOutlineEye
                      onClick={() => setShowOldPassword(false)}
                      cursor="pointer"
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      onClick={() => setShowOldPassword(true)}
                      cursor="pointer"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.oldPassword?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.newPassword}>
              <FormLabel>Password Baru</FormLabel>
              <InputGroup>
                <Input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", {
                    required: "Gak boleh kosong",
                    validate: (value) =>
                      value !== watch("oldPassword")
                        ? value.length >= 8 || "Password minimal 8 karakter"
                        : "Password baru dan password lama tidak boleh sama",
                  })}
                />
                <InputRightElement>
                  {showNewPassword ? (
                    <AiOutlineEye
                      onClick={() => setShowNewPassword(false)}
                      cursor="pointer"
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      onClick={() => setShowNewPassword(true)}
                      cursor="pointer"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel>Konfirmasi Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Confirm dulu...",
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "Password baru dan konfirmasi password tidak sama",
                  })}
                  // size={{ base: "sm", md: "md" }}
                />
                <InputRightElement>
                  {showNewPassword ? (
                    <AiOutlineEye
                      onClick={() => setShowConfirmPassword(false)}
                      cursor="pointer"
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      onClick={() => setShowConfirmPassword(true)}
                      cursor="pointer"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.confirmPassword?.message}
              </FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              colorScheme="linkedin"
              isDisabled={!isDirty || !isValid}
              isLoading={isSubmitting}
              loadingText="Memuat"
            >
              Ganti Password
            </Button>
          </VStack>
        </form>
      </Flex>
    </ProfileLayout>
  );
};

export default GantiPassword;
