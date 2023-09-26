import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { api } from "~/utils/api";

export function generateToken(n: number) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=_+";
  let token = "";
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
export interface SepedaProps {
  name: string;
  nim: string;
  email: string;
  bike: number;
  password: string;
  link?: string;
}

const RegisterSepeda = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const createBikeUser = api.bike.createNew.useMutation({
    onError: (err) => {
      toast({
        title: "Error",
        status: "error",
        position: "top",
        duration: 1500,
        description: err.message,
        isClosable: true,
      });
    },
  });
  const token = api.bike.getNewToken.useQuery();
  const bikes = api.bike.getBikes.useQuery();
  const {
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<SepedaProps>();

  const onSubmit: SubmitHandler<SepedaProps> = async (data, e) => {
    e?.preventDefault();

    if (token.data) {
      await createBikeUser.mutateAsync({
        name: data.name,
        nim: data.nim,
        email: data.email,
        tokenId: token.data?.id,
        bikeNumber: data.bike,
        active: false,
        password: data.password,
      });
    }

    await fetch("/api/email/send", {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        name: data.name,
        nim: data.nim,
        bike: data.bike,
        link:
          "https://soezyxst.me/orpheus/sepeda/user/verify/" + token.data?.token,
        password: data.password,
      }),
    })
      .then(() => {
        toast({
          title: "Success",
          status: "success",
          position: "top",
          description: "Check your email for verification",
          isClosable: true,
          duration: 1500,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          status: "error",
          position: "top",
          description: "Error occured",
          isClosable: true,
          duration: 1500,
        });
      });
    void router.push("/orpheus/sepeda/login");
    reset();
  };

  return (
    <Center
      minHeight="100dvh"
      flexDirection="column"
      gap={{ base: "1.5rem", md: "2.5rem" }}
    >
      <Heading textAlign="center">
        Orpheus Bike <br /> Registrasi
      </Heading>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <VStack width={{ base: "80vw", md: "25rem" }}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Nama</FormLabel>
            <Input
              type="text"
              {...register("name", { required: "Isi nama sesuai data ya" })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.nim}>
            <FormLabel>NIM</FormLabel>
            <Input
              type="number"
              {...register("nim", {
                required: "NIM harus diisi",
                minLength: {
                  value: 8,
                  message: "NIM harus 8 karakter",
                },
                maxLength: {
                  value: 8,
                  message: "NIM harus 8 karakter",
                },
                validate: (value) => {
                  const nim = parseInt(value);
                  if (nim < 10000001 || nim > 19999999) {
                    return "NIM tidak valid";
                  }
                  return true;
                },
              })}
            />
            <FormErrorMessage>{errors.nim?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel>Password Baru</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password tidak boleh kosong",
                  minLength: {
                    value: 8,
                    message: "Password minimal 8 karakter",
                  },
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
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email ITB</FormLabel>
            <Input
              type="email"
              {...register("email", {
                required: "Email tidak boleh kosong",
                pattern: {
                  value: /^[0-9]+@[a-z]+\.[a-z]{2,4}\.[a-z]{2,4}\.[a-z]{2,4}$/,
                  message: "Email tidak valid",
                },
                validate: (value) => {
                  const nim = parseInt(watch("nim"));
                  if (nim < 10000001 || nim > 19999999) {
                    return "NIM tidak valid";
                  }
                  const nimEmail = value.split("@")[0];
                  if (nimEmail !== nim.toString()) {
                    return "Email tidak sesuai dengan NIM";
                  }
                  return true;
                },
              })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.bike}>
            <FormLabel>Sepeda</FormLabel>
            <Select
              placeholder="..."
              {...register("bike", {
                required: "Pilih dulu sepeda yaa",
                valueAsNumber: true,
              })}
            >
              {bikes.data?.map((bike, index) => (
                <option key={index} value={bike.number}>
                  {bike.number}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.bike?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            colorScheme="linkedin"
            isLoading={isSubmitting}
            loadingText="Submitting"
            isDisabled={!isDirty || !isValid}
          >
            Daftar
          </Button>
        </VStack>
      </form>
    </Center>
  );
};

export default RegisterSepeda;
