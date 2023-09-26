import { Button, Flex, Link, Text, VStack } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import CloImage from "~/components/image/CloImage";
import ProfileLayout from "~/layouts/ProfileLayout";
import { api } from "~/utils/api";

const Id = () => {
  const { data } = api.user.getUserInfo.useQuery();

  return (
    <ProfileLayout activeKey="Profil" title="Profil">
      <Flex
        direction={{ base: "column", md: "row" }}
        padding={{ base: "2rem", md: "2rem 5rem" }}
        width="100%"
        height="100%"
        gap={{ base: "2rem", md: "6rem" }}
        alignItems={{ base: "left", md: "center" }}
      >
        <Flex
          width={{ base: "100%", md: "auto" }}
          justifyContent={{ base: "center", md: "left" }}
        >
          <CloImage
            alt=""
            src={data?.profile?.image ?? ""}
            width={{ base: "200px", md: "300px" }}
            aspectRatio={1}
            objectFit="cover"
            objectPosition="center"
            rounded="full"
          />
        </Flex>
        <Flex direction="column" gap={{ base: "1.5rem", md: "2rem" }}>
          <Flex gap={{ base: "2rem", md: "2.5rem" }}>
            <VStack
              alignItems="flex-start"
              spacing={{ base: 4, md: 6 }}
              fontSize={{ base: "sm", md: "lg" }}
              fontWeight="semibold"
            >
              <Text>Nama</Text>
              <Text>NIM</Text>
              <Text>Email</Text>
              <Text>Prodi</Text>
            </VStack>
            <VStack
              alignItems="flex-start"
              spacing={{ base: 4, md: 6 }}
              fontSize={{ base: "sm", md: "lg" }}
            >
              <Text>{": " + data?.profile?.name}</Text>
              <Text>{": " + data?.nim}</Text>
              <Text>{": " + data?.profile?.email}</Text>
              <Text>{": " + data?.profile?.prodi}</Text>
            </VStack>
          </Flex>
          <Link href={"/orpheus/profil/edit"} width="min-content">
            <Button leftIcon={<FiEdit />} width="fit-content">
              Edit
            </Button>
          </Link>
        </Flex>
      </Flex>
    </ProfileLayout>
  );
};

export default Id;
