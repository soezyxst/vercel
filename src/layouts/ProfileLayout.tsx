import {
  Flex,
  Link,
  useMediaQuery,
  Button,
  useColorMode,
  Show,
  IconButton,
  useDisclosure,
  Divider,
  Slide,
  Heading,
  CloseButton,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FcCurrencyExchange } from "react-icons/fc";
import { FiMenu } from "react-icons/fi";
import { GoArchive, GoGear, GoHome, GoKey, GoPeople } from "react-icons/go";
import SignInButton from "~/components/auth/SignInButton";
import SignOutButton from "~/components/auth/SignOutButton";
import Nav from "~/components/layout/Nav";
import ProfileMenu from "~/components/layout/ProfileMenu";

interface ProfileLayoutProps {
  activeKey: string;
  title: string;
  children: React.ReactNode;
}

const ProfileLayout = ({ activeKey, title, children }: ProfileLayoutProps) => {
  const [isMd] = useMediaQuery(["(min-width: 768px)"]);
  const { colorMode } = useColorMode();
  const icons = [
    <GoHome key="1" />,
    <GoPeople key="4" />,
    <GoKey key="2" />,
    <GoArchive key="5" />,
    <GoGear key="3" />,
  ];
  const isDarkMode = colorMode === "dark";
  const { data: session, status } = useSession();
  const router = useRouter();
  const { onOpen, onClose, isOpen } = useDisclosure();

  useEffect(() => {
    if (status === "unauthenticated") void router.push("/login");
  }, [router, status]);

  const linkRedirect = [
    "/orpheus/beranda",
    "/orpheus/profil",
    "/orpheus/profil/ganti-password",
    "/orpheus/profil/kehadiran",
    "/orpheus/profil/pengaturan",
  ];

  const Sidebar = () => (
    <Flex
      direction="column"
      width={isMd ? "calc(12vw + 5ch)" : "100%"}
      gap="1rem"
    >
      {["Beranda", "Profil", "Ganti Password", "Kehadiran", "Pengaturan"].map(
        (item, index) => (
          <Link href={linkRedirect[index]} key={index}>
            <Button
              width="100%"
              justifyContent="left"
              paddingLeft={activeKey === item ? "1rem" : ".5rem"}
              bgColor="transparent"
              leftIcon={activeKey !== item ? icons[index] : <></>}
              borderLeft={
                activeKey === item
                  ? isDarkMode
                    ? "2px solid #ddd"
                    : "2px solid #00000055"
                  : ""
              }
              color={activeKey === item ? (isDarkMode ? "#fff" : "#000") : ""}
              rounded={activeKey === item ? "" : "md"}
              fontWeight={activeKey === item ? "bold" : ""}
              _hover={{
                backgroundColor:
                  activeKey === item
                    ? ""
                    : isDarkMode
                    ? "rgba(255, 255, 255, .1)"
                    : "rgba(0, 0, 0, .1)",
              }}
              onClick={(e) => {
                if (activeKey === item) {
                  e.preventDefault();
                  return;
                }
              }}
            >
              {item}
            </Button>
          </Link>
        )
      )}
    </Flex>
  );

  return (
    <>
      <Head>
        <title>{title + " - " + (session?.user.name ?? "User")}</title>
      </Head>
      <Flex minHeight="100dvh" direction="column">
        <Nav position="sticky" top="0" justifyContent="space-between">
          <Show above="md">
            <ProfileMenu />
          </Show>
          <Show below="md">
            <Flex alignItems="center" justifyContent="center">
              <IconButton
                aria-label="menu"
                icon={<FiMenu size="1.5rem" />}
                bgColor="transparent"
                onClick={onOpen}
              />
              <Slide direction="left" in={isOpen} style={{ zIndex: 99 }}>
                <Flex
                  width="100%"
                  direction="column"
                  padding="1.5rem"
                  gap="1rem"
                  height={"100dvh" || "100vh"}
                  backgroundColor={
                    colorMode === "dark" ? "gray.700" : "gray.50"
                  }
                >
                  <Flex justifyContent="space-between">
                    <Heading size="lg">Menu</Heading>
                    <CloseButton onClick={onClose} />
                  </Flex>
                  <Divider />
                  <Flex
                    direction="column"
                    justifyContent="space-between"
                    height="100%"
                  >
                    <Sidebar />
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
                    {status === "authenticated" ? (
                      <SignOutButton />
                    ) : (
                      <SignInButton />
                    )}
                  </Flex>
                </Flex>
              </Slide>
            </Flex>
          </Show>
        </Nav>
        <Flex position="relative" flexGrow="1">
          <Show above="md">
            <Flex
              paddingInline="2rem"
              paddingBlock="4rem"
              borderRight="1px solid gray"
              position="sticky"
              top="0"
            >
              <Sidebar />
            </Flex>
          </Show>
          {children}
        </Flex>
      </Flex>
    </>
  );
};

export default ProfileLayout;
