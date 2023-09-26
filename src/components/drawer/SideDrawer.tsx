import {
  Flex,
  Link,
  Slide,
  Heading,
  CloseButton,
  useColorMode,
  Divider,
} from "@chakra-ui/react";
import SignInButton from "../auth/SignInButton";
import SignOutButton from "../auth/SignOutButton";
import Sidebar from "../layout/Sidebar";
import { FcCurrencyExchange } from "react-icons/fc";
import { useSession } from "next-auth/react";
import ProfileMenu from "../layout/ProfileMenu";

const SideDrawer = ({
  onClose,
  isOpen,
  activeKey,
}: {
  onClose: () => void;
  isOpen: boolean;
  activeKey: string;
}) => {
  const { status } = useSession();
  const { colorMode } = useColorMode();
  return (
    <Slide direction="left" in={isOpen} style={{ zIndex: 99 }}>
      <Flex
        width="100%"
        direction="column"
        padding="1.5rem"
        gap="1rem"
        height={"100dvh" || "100vh"}
        backgroundColor={colorMode === "dark" ? "gray.700" : "gray.50"}
      >
        <Flex justifyContent="space-between">
          <Heading size="lg">Menu</Heading>
          <CloseButton onClick={onClose} />
        </Flex>
        <Divider />
        <Flex direction="column" justifyContent="space-between" height="100%">
          <Sidebar activeKey={activeKey} />
          <Link>
            <Flex alignItems="center" gap=".5rem">
              <FcCurrencyExchange />
              Donate
            </Flex>
          </Link>
        </Flex>
        <Divider />
        <Flex justifyContent="space-between" width="100%">
          <ProfileMenu />
          {status === "authenticated" ? <SignOutButton /> : <SignInButton />}
        </Flex>
      </Flex>
    </Slide>
  );
};

export default SideDrawer;
