import {
  Button,
  Divider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import CreateActivityForm from "~/components/form/CreateActivityForm";
import CreateAttendanceForm from "~/components/form/CreateAttendanceForm";
import UpdateActivityForm from "~/components/form/UpdateActivityForm";
import LoadingPage from "~/components/loading/Loading";
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const KegiatanAngkatan = () => {
  const toast = useToast();
  const [isMd] = useMediaQuery(["(min-width: 768px)"]);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const activityDisclosure = useDisclosure();
  const attendnceDisclosure = useDisclosure();
  const updateActivity = useDisclosure();
  const activityTitles = api.activity.getActivitiesTitle.useQuery();
  const deleteActivity = api.activity.deleteActivity.useMutation({
    onSuccess: async () => {
      await activityTitles.refetch();
      toast({
        title: "Activity deleted",
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
    <AkaLayout title="Kegiatan Angkatan" activeKey="Admin">
      <Heading fontSize={{ base: "lg", md: "3xl" }}>Kegiatan Angkatan</Heading>
      <Button
        onClick={activityDisclosure.onOpen}
        minWidth="12rem"
        width="fit-content"
        maxWidth="18rem"
        colorScheme="linkedin"
      >
        {isMd ? "Tambah Kegiatan Angkatan" : "Tambah"}
      </Button>
      <CreateActivityForm
        isOpen={activityDisclosure.isOpen}
        onClose={activityDisclosure.onClose}
        refetch={activityTitles.refetch}
      />
      <VStack align="flex-start" spacing={2}>
        {activityTitles.data?.map((activity, index) => (
          <VStack key={index} align="flex-start" spacing={2} width="100%">
            <Flex
              padding=".25rem"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text
                textTransform="capitalize"
                fontSize={{ base: "sm", md: "md" }}
              >
                {activity.title}
              </Text>
              <Flex gap=".5rem">
                <Menu>
                  <MenuButton>
                    <FiMoreVertical cursor="pointer" />
                  </MenuButton>
                  <MenuList fontSize="sm">
                    <MenuItem
                      onClick={() => {
                        attendnceDisclosure.onOpen();
                        setActiveKey(activity.id);
                      }}
                    >
                      Atur Absensi
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        deleteActivity.mutate({ id: activity.id });
                      }}
                    >
                      Hapus
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        updateActivity.onOpen();
                        setActiveKey(activity.id);
                      }}
                    >
                      Edit
                    </MenuItem>
                  </MenuList>
                </Menu>
                <CreateAttendanceForm
                  isOpen={
                    attendnceDisclosure.isOpen && activeKey === activity.id
                  }
                  onClose={attendnceDisclosure.onClose}
                  id={activity.id}
                />
                <UpdateActivityForm
                  isOpen={updateActivity.isOpen && activeKey === activity.id}
                  onClose={updateActivity.onClose}
                  onOpen={updateActivity.onOpen}
                  refetch={activityTitles.refetch}
                  id={activity.id}
                />
              </Flex>
            </Flex>
            <Divider />
          </VStack>
        ))}
      </VStack>
    </AkaLayout>
  );
};

KegiatanAngkatan.auth = {
  role: Role.ADMIN || Role.SUPERADMIN,
  loading: <LoadingPage />,
  unauthorized: "/ms22",
};

export default KegiatanAngkatan;
