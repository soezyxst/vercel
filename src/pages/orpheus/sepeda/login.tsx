import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import {
  type InferGetServerSidePropsType,
  type GetServerSidePropsContext,
} from "next";
import { type SubmitHandler, useForm } from "react-hook-form";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface AdminFormValues {
  nim: string;
  password: string;
}

const Login = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const {
    formState: { isDirty, errors, isValid, isSubmitting },
    handleSubmit,
    register,
    setError,
    reset,
  } = useForm<AdminFormValues>();

  const handleLoggedIn = () => {
    toast({
      title: "Berhasil masuk",
      description: session?.user.name
        ? "Terautentikasi sebagai" + " " + session?.user.name
        : "Terautentikasi",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const handleError = (error: string) => {
    toast({
      title: "Gagal masuk",
      description: error,
      status: "error",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
  };

  const onSubmit: SubmitHandler<AdminFormValues> = async (
    data: AdminFormValues,
    e
  ) => {
    e?.preventDefault();
    const res = await signIn("bike", {
      nim: data.nim,
      password: data.password,
      redirect: false,
      csrfToken,
    });

    if (res?.error && res?.error !== "SessionRequired") {
      handleError(res.error);
      setError("root", { message: res.error });
      reset({}, { keepErrors: true, keepValues: true });
      return;
    }

    handleLoggedIn();
    void router.push('/orpheus/sepeda/' + data.nim)
    reset();
  };

  return (
    <>
      <Head>
        <title>Login | Orpheus Bike</title>
      </Head>
      <Flex
        justifyContent="center"
        alignItems="center"
        minHeight={"100dvh" || "100vh"}
      >
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <Flex
            direction="column"
            gap="1.5rem"
            width={{ base: "auto", md: "40ch" }}
            alignItems="stretch"
          >
            <Heading textAlign="center" size={{base: 'md', md: 'xl'}} mb='1rem'>Orpheus Bike<br />Login</Heading>
            <FormControl isInvalid={!!errors.nim}>
              <Input
                type="number"
                placeholder="NIM"
                {...register("nim", { required: "NIM tidak boleh kosong" })}
              />
              <FormErrorMessage>{errors.nim?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password tidak boleh kosong",
                  })}
                />
                <InputRightElement>
                  {showPassword ? (
                    <AiOutlineEye
                      onClick={() => setShowPassword(false)}
                      cursor="pointer"
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      onClick={() => setShowPassword(true)}
                      cursor="pointer"
                    />
                  )}
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Memuat..."
              isDisabled={!isValid || !isDirty}
              colorScheme='whatsapp'
            >
              Login
            </Button>
          </Flex>
        </form>
      </Flex>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}

export default Login;
