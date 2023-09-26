import {
  Flex,
  Text as ChakraText,
  VStack,
  Heading,
  Divider,
  Button,
  type TextProps,
  useToast,
  Select,
  useOutsideClick,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Nav from "~/components/layout/Nav";
import { api } from "~/utils/api";

const Text = ({ ...props }: TextProps) => {
  return <ChakraText fontSize={{ base: "sm", md: "md" }} {...props} />;
};

const Id = () => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    undefined
  );
  const butRef = useRef(null);
  const tokenRef = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { isDirty, isValid, isSubmitting },
    reset,
  } = useForm<{ bike: number }>();
  const { status, data: session } = useSession();
  const router = useRouter();
  const { nim } = router.query;
  const bikes = api.bike.getBikes.useQuery();
  const user = api.bike.getBikeUserByNIM.useQuery({ nim: nim as string });
  const usersBikes = user.data?.bikeRelation.map(
    (relation) => relation.bike?.number
  );
  const newToken = api.bike.getNewToken.useQuery();
  const addBike = api.bike.addNewRelation.useMutation({
    onSuccess: async () => {
      toast({
        title: "Berhasil menambahkan sepeda",
        status: "success",
        duration: 1500,
        isClosable: true,
      });

      await bikes.refetch();
      await user.refetch();
      await newToken.refetch();
    },
    onError: (error) => {
      toast({
        title: "Gagal menambahkan sepeda",
        description: error.message,
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    },
  });

  useOutsideClick({
    ref: butRef,
    handler: () => {
      if (isSubmitting) return;
      setIsOpen(false);
    },
  });

  useOutsideClick({
    ref: tokenRef,
    handler: () => setShowToken(false),
  });

  const onSubmit: SubmitHandler<{ bike: number }> = async (data, e) => {
    e?.preventDefault();

    if (newToken.data?.token) {
      await addBike.mutateAsync({
        token: newToken.data?.token,
        bikeNumber: data.bike,
      });
    } else {
      toast({
        title: "Gagal menambahkan sepeda",
        description: "Gagal memuat token",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }

    setIsOpen(false);
    reset();
  };

  if (status === "unauthenticated")
    return void router.push("/ms22/sepeda/login");
  
  if (session?.user?.accType !== "Bike") {
    return (
      <Center height="100vh">
        <Text fontSize="xl">You are not authorized to access this page</Text>
      </Center>
    )
  }

  return (
    <>
      <Nav></Nav>
      <Flex
        direction="column"
        padding={{ base: "2rem", md: "3rem 8rem" }}
        gap={{ base: "1rem", md: "2rem" }}
      >
        <Heading fontSize={{ base: "lg", md: "xl" }}>Profil</Heading>
        <Flex gap=".5rem">
          <VStack spacing={{ base: 4, md: 6 }} align="flex-start">
            <Text>Nama</Text>
            <Text>NIM</Text>
            <Text>Email</Text>
          </VStack>
          <VStack spacing={{ base: 4, md: 6 }} align="flex-start">
            <Text>:</Text>
            <Text>:</Text>
            <Text>:</Text>
          </VStack>
          <VStack spacing={{ base: 4, md: 6 }} align="flex-start">
            <Text>{user.data?.name}</Text>
            <Text>{user.data?.nim}</Text>
            <Text>{user.data?.email}</Text>
          </VStack>
        </Flex>
        <Divider />
        <Heading fontSize={{ base: "lg", md: "xl" }}>Sepeda</Heading>
        {user.data?.active ? (
          <Flex direction="column" gap="1rem">
            <Flex gap=".5rem">
              <VStack
                spacing={{ base: 2, md: 4 }}
                align="flex-start"
                minWidth={{ base: "5rem", md: "35ch" }}
              >
                <Text fontWeight="semibold">Sepeda</Text>
                {user.isLoading && (
                  <Spinner mr=".5rem" size={{ base: "xs", md: "sm" }} />
                )}
                {user.data?.bikeRelation.length === 0 && (
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                    none
                  </Text>
                )}
                {user.data?.bikeRelation.map((relation, index) => (
                  <Text key={index}>{relation.bike?.number}</Text>
                ))}
              </VStack>
              <VStack
                spacing={{ base: 2, md: 4 }}
                align="flex-start"
                ref={tokenRef}
              >
                <Text fontWeight="semibold">Token</Text>
                {user.isLoading && (
                  <Spinner mr=".5rem" size={{ base: "xs", md: "sm" }} />
                )}
                {user.data?.bikeRelation.length === 0 && (
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
                    none
                  </Text>
                )}
                {user.data?.bikeRelation.map((relation, index) => (
                  <InputGroup key={index}>
                    <Input
                      type={
                        showToken && selectedToken === relation.token?.token
                          ? "text"
                          : "password"
                      }
                      variant="unstyled"
                      readOnly
                      defaultValue={relation.token?.token}
                    />
                    <InputRightElement height="100%">
                      {showToken && selectedToken === relation.token?.token ? (
                        <AiOutlineEye
                          onClick={() => {
                            setSelectedToken(undefined);
                            setShowToken(false);
                          }}
                          cursor="pointer"
                        />
                      ) : (
                        <AiOutlineEyeInvisible
                          onClick={() => {
                            setSelectedToken(relation.token?.token);
                            setShowToken(true);
                          }}
                          cursor="pointer"
                        />
                      )}
                    </InputRightElement>
                  </InputGroup>
                ))}
              </VStack>
            </Flex>
            <Flex ref={butRef}>
              <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <Flex
                  gap={isOpen ? "1rem" : "0.5rem"}
                  width="100%"
                  maxWidth="25rem"
                >
                  <label>
                    {isOpen && (
                      <Select
                        cursor="pointer"
                        placeholder="..."
                        {...register("bike", {
                          required: "Tambah dulu nomor sepeda",
                          valueAsNumber: true,
                        })}
                        size={{ base: "sm", md: "md" }}
                      >
                        {bikes.data?.map((bike, index) => {
                          if (usersBikes?.includes(bike.number)) return null;
                          return (
                            <option key={index} value={bike.number}>
                              {bike.number}
                            </option>
                          );
                        })}
                      </Select>
                    )}
                  </label>
                  {isOpen && (
                    <Button
                      isLoading={isSubmitting}
                      isDisabled={!isValid || !isDirty}
                      type="submit"
                      variant="outline"
                      width="fit-content"
                    >
                      +
                    </Button>
                  )}
                </Flex>
              </form>
              {isOpen || (
                <Button
                  variant="outline"
                  width="fit-content"
                  onClick={isOpen ? undefined : () => setIsOpen(true)}
                >
                  Tambah Sepeda
                </Button>
              )}
            </Flex>
          </Flex>
        ) : (
          <Text>Not Verified User</Text>
        )}
        <Divider />
        <Heading fontSize={{ base: "lg", md: "xl" }}>Atur Password</Heading>
        <Flex gap=".5rem"></Flex>
      </Flex>
    </>
  );
};

export default Id;
