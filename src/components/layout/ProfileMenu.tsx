import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Avatar,
  AvatarBadge,
  Link,
  Text,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { FiUserCheck, FiLogIn, FiLogOut, FiEdit, FiUser } from "react-icons/fi";
import { api } from "~/utils/api";

const ProfileMenu = () => {
  const { status } = useSession();
  const { data } = api.user.getUserInfo.useQuery();
  return (
    <Menu>
      <MenuButton>
        <Flex alignItems="center">
          <Avatar
            icon={
              data?.profile?.image ? (
                <Flex
                  width="100%"
                  aspectRatio={1 / 1}
                  rounded="full"
                  overflow="hidden"
                >
                  <CldImage
                    src={data?.profile?.image ?? ""}
                    alt=""
                    width="100"
                    height="100"
                  />
                </Flex>
              ) : (
                <FiUser />
              )
            }
            marginRight=".75rem"
            size="sm"
            backgroundColor="blue.300"
          >
            <AvatarBadge
              backgroundColor={
                status === "authenticated" ? "green.500" : "red.500"
              }
              boxSize=".75rem"
            />
          </Avatar>
          <Text fontSize={{ base: "sm", md: "md" }}>
            {status === "authenticated" ? data?.profile?.name : "Tamu"}
          </Text>
        </Flex>
      </MenuButton>
      {status === "authenticated" ? (
        <MenuList>
          <Link href={"/orpheus/profil/"}>
            <MenuItem>
              <Flex alignItems="center" gap=".5rem">
                <FiUserCheck />
                Profil
              </Flex>
            </MenuItem>
          </Link>
          <Link href={"/orpheus/profil/ganti-password"}>
            <MenuItem>
              <Flex alignItems="center" gap=".5rem">
                <FiEdit />
                Ganti Password
              </Flex>
            </MenuItem>
          </Link>
          <MenuItem onClick={() => void signOut()}>
            <Flex alignItems="center" gap=".5rem">
              <FiLogOut />
              Logout
            </Flex>
          </MenuItem>
        </MenuList>
      ) : (
        <MenuList>
          <MenuItem onClick={() => void signIn()}>
            <Flex alignItems="center" gap=".5rem">
              <FiLogIn />
              Login
            </Flex>
          </MenuItem>
        </MenuList>
      )}
    </Menu>
  );
};

export default ProfileMenu;
