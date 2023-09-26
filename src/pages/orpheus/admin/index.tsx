import { Divider, Flex, Heading, Link, VStack } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import {
  GoAlert,
  GoFileZip,
  GoGitBranch,
  GoInfo,
  GoLink,
  GoPerson,
} from "react-icons/go";
import LoadingPage from "~/components/loading/Loading";
import AkaLayout from "~/layouts/AkaLayout";

const Admin = () => {
  const icons = [
    <GoInfo key="1" />,
    <GoGitBranch key="2" />,
    <GoLink key="3" />,
    <GoFileZip key="4" />,
    <GoAlert key="5" />,
    <GoPerson key="6" />,
  ];
  return (
    <AkaLayout title="Admin" activeKey="Admin">
      <Heading fontSize={{ base: "lg", md: "2xl" }}> Settings:</Heading>
      <VStack
        align="flex-start"
        spacing={2}
        divider={<Divider />}
        paddingInline="1rem"
      >
        {[
          "Informasi",
          "Kegiatan Angkatan",
          "Link Penting",
          "Tanya Soal",
          "Ujian",
          "User",
        ].map((item, index) => (
          <Flex alignItems="center" key={index} gap=".5rem">
            {icons[index]}
            <Link
              href={`/orpheus/admin/${item.toLowerCase().replace(/\s/g, "-")}`}
            >
              {item}
            </Link>
          </Flex>
        ))}
      </VStack>
    </AkaLayout>
  );
};

Admin.auth = {
  role: Role.ADMIN || Role.SUPERADMIN,
  loading: <LoadingPage />,
  unauthorized: "/orpheus",
};
export default Admin;
