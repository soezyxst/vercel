import { Divider, Flex, Heading, Select, Text, VStack, useToast } from '@chakra-ui/react';
import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import LoadingPage from '~/components/loading/Loading';
import AkaLayout from '~/layouts/AkaLayout'
import { api } from '~/utils/api';

const User = () => {
  const toast = useToast()
  const { data: session } = useSession();
  const users = api.user.getUsers.useQuery();
  const updateUser = api.user.updateUser.useMutation({
    onSuccess() {
      toast({
        title: "User updated",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    },
    onError(err) {
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
    <AkaLayout title="Admin - User" activeKey="Admin">
      <Heading fontSize={{ base: "lg", md: "3xl" }}>User</Heading>
      <VStack align="flex-start" spacing={2}>
        {users.data?.map((user, index) => (
          <>
            <Flex
              key={user.nim}
              padding=".25rem"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text
                textTransform="capitalize"
                fontSize={{ base: "sm", md: "md" }}
              >
                {user.profile?.name}
              </Text>
              {session?.user.role === "SUPERADMIN" && (
                <label>
                  <Select
                    defaultValue={user.role}
                    onChange={(e) => {
                      updateUser.mutate({
                        nim: user.nim,
                        role: e.target.value as Role,
                      });
                    }}
                  >
                    <option value={Role.ADMIN}>Admin</option>
                    <option value={Role.USER}>User</option>
                  </Select>
                </label>
              )}
            </Flex>
            <Divider key={index} />
          </>
        ))}
      </VStack>
    </AkaLayout>
  );
}

User.auth = {
  role: Role.ADMIN || Role.SUPERADMIN,
  loading: <LoadingPage />,
  unauthorized: "/orpheus",
};

export default User