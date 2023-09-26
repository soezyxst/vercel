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
import CreateAnnouncementForm from "~/components/form/CreateAnnouncementForm";
import UpdateAnnouncementForm from "~/components/form/UpdateAnnouncementForm";
import LoadingPage from '~/components/loading/Loading';
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const Informasi = () => {
  const toast = useToast();
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  const announcementForm = useDisclosure();
  const updateAnnouncementForm = useDisclosure();
  const announcementsTitle = api.announcement.getAnnouncementsTitle.useQuery({
    type: "all",
  });
  const deleteAnnouncement = api.announcement.deleteAnnouncement.useMutation({
    onSuccess: async () => {
      await announcementsTitle.refetch();
      toast({
        title: "Announcement deleted",
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
    <AkaLayout title="Admin - Info" activeKey="Admin">
      <Heading fontSize={{ base: "lg", md: "3xl" }}>Informasi</Heading>
      <Button
        onClick={announcementForm.onOpen}
        width="12rem"
        colorScheme="linkedin"
      >
        Tambah Informasi
      </Button>
      <CreateAnnouncementForm
        {...announcementForm}
        refetch={announcementsTitle.refetch}
      />
      <VStack align="flex-start" spacing={2}>
        {announcementsTitle.data?.map((announcement, index) => (
          <>
            <Flex
              key={announcement.id}
              padding=".25rem"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text
                textTransform="capitalize"
                fontSize={{ base: "sm", md: "md" }}
              >
                {announcement.title}
              </Text>
              <Flex gap=".5rem">
                <Button
                  colorScheme="red"
                  isDisabled={deleteAnnouncement.isLoading}
                  isLoading={
                    deleteAnnouncement.isLoading &&
                    activeKey === announcement.id
                  }
                  loadingText="Deleting..."
                  onClick={() => {
                    setActiveKey(announcement.id);
                    deleteAnnouncement.mutate({ id: announcement.id });
                  }}
                >
                  Delete
                </Button>
                <Button
                  colorScheme="whatsapp"
                  onClick={() => {
                    updateAnnouncementForm.onOpen();
                    setActiveKey(announcement.id);
                  }}
                  isDisabled={deleteAnnouncement.isLoading}
                >
                  Edit
                </Button>
                <UpdateAnnouncementForm
                  isOpen={
                    updateAnnouncementForm.isOpen &&
                    activeKey === announcement.id
                  }
                  onClose={updateAnnouncementForm.onClose}
                  onOpen={updateAnnouncementForm.onOpen}
                  refetch={announcementsTitle.refetch}
                  id={announcement.id}
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

Informasi.auth = {
  role: Role.ADMIN || Role.SUPERADMIN,
  loading: <LoadingPage />,
  unauthorized: "/ms22",
};

export default Informasi;
