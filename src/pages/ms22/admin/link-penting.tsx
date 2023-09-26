import {
  Button,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Role } from '@prisma/client';
import { useState } from "react";
import CreateLinkForm from "~/components/form/CreateLinkForm";
import UpdateLinkForm from "~/components/form/UpdateLinkForm";
import LoadingPage from '~/components/loading/Loading';
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const LinkPenting = () => {
  const toast = useToast();
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const linkForm = useDisclosure();
  const updateLinkForm = useDisclosure();
  const linksTitle = api.link.getLinkPentingsTitle.useQuery({ type: "all" });
  const deleteLink = api.link.deleteLinkPenting.useMutation({
    onSuccess: async () => {
      await linksTitle.refetch();
      toast({
        title: "Link deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    },
  });
  return (
    <AkaLayout title="Admin - Link Penting" activeKey="Admin">
      <Heading fontSize={{ base: "lg", md: "3xl" }}>Link</Heading>
      <Button
        onClick={linkForm.onOpen}
        width="12rem"
        colorScheme="linkedin"
      >
        Tambah Link Penting
      </Button>
      <CreateLinkForm {...linkForm} refetch={linksTitle.refetch} />
      <VStack align="flex-start" spacing={2}>
        {linksTitle.data?.linkPenting.map((link, index) => (
          <>
            <Flex
              key={link.id}
              padding=".25rem"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text
                textTransform="capitalize"
                fontSize={{ base: "sm", md: "md" }}
              >
                {link.title}
              </Text>
              <Flex gap=".5rem">
                <Button
                  colorScheme="red"
                  isDisabled={deleteLink.isLoading}
                  isLoading={deleteLink.isLoading && activeKey === link.id}
                  loadingText="Deleting..."
                  onClick={() => {
                    setActiveKey(link.id);
                    deleteLink.mutate({ id: link.id });
                  }}
                >
                  Delete
                </Button>
                <Button
                  isDisabled={deleteLink.isLoading}
                  colorScheme="whatsapp"
                  onClick={() => {
                    updateLinkForm.onOpen();
                    setActiveKey(link.id);
                  }}
                >
                  Edit
                </Button>
                <UpdateLinkForm
                  id={link.id}
                  isOpen={updateLinkForm.isOpen && activeKey === link.id}
                  onClose={updateLinkForm.onClose}
                  onOpen={updateLinkForm.onOpen}
                  refetch={linksTitle.refetch}
                />
              </Flex>
            </Flex>
            <Divider key={index} />
          </>
        ))}
      </VStack>
    </AkaLayout>
  );
};

LinkPenting.auth = {
  role: Role.ADMIN || Role.SUPERADMIN,
  loading: <LoadingPage />,
  unauthorized: "/ms22",
};
export default LinkPenting;
