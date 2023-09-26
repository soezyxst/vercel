import { Flex, Heading } from "@chakra-ui/react";
import ProfileLayout from "~/layouts/ProfileLayout";

const Pengaturan = () => {
  return (
    <ProfileLayout activeKey="Pengaturan" title="Pengaturan">
      <Flex
        paddingInline={{ base: "2rem", md: "4rem" }}
        paddingBlock={{ base: "1.5rem", md: "2rem" }}
      >
        <Heading fontSize={{ base: "larger", md: "4xl" }}>Pengaturan</Heading>
      </Flex>
    </ProfileLayout>
  );
};

export default Pengaturan;
