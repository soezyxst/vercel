import {
  Flex,
  Link,
  Box,
  useMediaQuery,
  IconButton,
  useColorMode,
  Show,
  useDisclosure,
  Heading,
  Divider,
  VStack,
} from "@chakra-ui/react";
import Nav from "../components/layout/Nav";
import Head from "next/head";
import { FiChevronRight, FiMenu, FiPhone, FiX } from "react-icons/fi";
import { FcCurrencyExchange } from "react-icons/fc";
import Sidebar, { urlConverter } from "~/components/layout/Sidebar";
import SideDrawer from "~/components/drawer/SideDrawer";
import ProfileMenu from "~/components/layout/ProfileMenu";
import { api } from "~/utils/api";
import { useState } from "react";

interface AkaLayoutProps {
  children?: React.ReactNode;
  activeKey: string;
  title: string;
}

const AkaLayout = ({ children, activeKey, title }: AkaLayoutProps) => {
  const [isMd] = useMediaQuery(["(min-width: 768px)"]);
  const { colorMode } = useColorMode();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(true);
  const isDarkMode = colorMode === "dark";
  const latestAnnouncements = api.announcement.getAnnouncementsTitle.useQuery({
    take: 5,
  });
  const latestLinks = api.link.getLinkPentingsTitle.useQuery({
    take: 5,
  });

  const titles = api.grand.getTitles.useQuery({
    category: urlConverter(activeKey),
  });

  return (
    <>
      <Head>
        <title>{title + " | " + "Akademik MS22"}</title>
        <meta name="description" content="Akademik MS22" />
      </Head>
      <Flex minHeight={"100dvh" || "100vh"} height="100dvh" direction="column">
        {/* Navbar */}
        <Nav>
          <Show breakpoint="(min-width: 768px)">
            <ProfileMenu />
          </Show>
          <Show breakpoint="(max-width: 768px)">
            <Flex alignItems="center">
              <IconButton
                aria-label="menu"
                icon={<FiMenu size="1.5rem" />}
                bgColor="transparent"
                onClick={onOpen}
              />
            </Flex>
          </Show>
        </Nav>
        <SideDrawer activeKey={activeKey} isOpen={isOpen} onClose={onClose} />

        {/* Sidebar */}
        <Flex flex="1" height="calc(100% - 4rem)">
          <Show breakpoint="(min-width: 768px)">
            <Flex
              direction="column"
              justifyContent="space-between"
              padding="2rem"
              position={isExpanded ? "sticky" : "fixed"}
              // position='sticky'
              // top='0'
              top={isExpanded ? "0" : "4rem"}
              borderRight={
                isDarkMode
                  ? "1px solid rgba(255, 255, 255, .2)"
                  : "1px solid rgba(0, 0, 0, .2)"
              }
              transform={isExpanded ? "translateX(0)" : "translateX(-100%)"}
              transition="transform .25s ease"
            >
              <Sidebar activeKey={activeKey} />
              <Link>
                <Flex alignItems="center" gap=".5rem">
                  <FcCurrencyExchange />
                  Donate
                </Flex>
              </Link>
              <Flex
                position="absolute"
                padding="1rem"
                top={0}
                right={0}
                transform={isExpanded ? "translateX(0)" : "translateX(100%)"}
                transition="transform .25s ease"
                onClick={() => {
                  setIsExpanded((prev) => !prev);
                }}
                cursor="pointer"
                fontSize="1.25rem"
              >
                {isExpanded ? <FiX /> : <FiChevronRight />}
              </Flex>
            </Flex>
          </Show>

          {/* Content */}
          <Box
            flex="1"
            overflow="hidden"
            transition={isExpanded ? "none" : ".3s ease"}
          >
            <Flex
              paddingInline={isExpanded ? "2rem" : "3rem"}
              paddingBlock="2rem"
              gap="1.5rem"
              direction="column"
              borderRight={
                isDarkMode
                  ? "1px solid rgba(255, 255, 255, .2)"
                  : "1px solid rgba(0, 0, 0, .2)"
              }
              overflowY="auto"
              height="100%"
              sx={{
                "&::-webkit-scrollbar": {
                  width: ".4rem",
                },
                "&::-webkit-scrollbar-track": {
                  width: ".4rem",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: isDarkMode
                    ? "rgba(255, 255, 255, .2)"
                    : "rgba(0, 0, 0, .2)",
                  borderRadius: "1rem",
                },
              }}
            >
              {children}
            </Flex>
          </Box>

          {/* Latest */}
          <Show breakpoint="(min-width: 1280px)">
            <Flex
              width="calc(15vw + 5ch)"
              padding="2rem"
              gap=".75rem"
              direction="column"
            >
              <Heading size="md">
                {activeKey === "Beranda" || activeKey === "Admin"
                  ? "Latest"
                  : "On This Page"}
              </Heading>
              <Divider />
              {activeKey === "Beranda" || activeKey === "Admin" ? (
                <VStack
                  spacing=".75rem"
                  align="start"
                  color={
                    colorMode === "dark" ? "whiteAlpha.700" : "blackAlpha.700"
                  }
                >
                  {latestAnnouncements.data?.map((announcement) => (
                    <Link
                      fontSize="sm"
                      key={announcement.id}
                      href={
                        announcement.type === "ACADEMIC"
                          ? `/ms22/info-kuliah/${announcement.id}`
                          : `/ms22/info-angkatan/${announcement.id}`
                      }
                      textTransform="capitalize"
                    >
                      {announcement.title}
                    </Link>
                  ))}
                  <Divider />
                  {latestLinks.data?.linkPenting.map((link) => (
                    <Link
                      fontSize="sm"
                      key={link.id}
                      href={`/ms22/link-penting/${link.id}`}
                      textTransform="capitalize"
                    >
                      {link.title}
                    </Link>
                  ))}
                </VStack>
              ) : (
                <VStack
                  spacing=".75rem"
                  align="start"
                  color={
                    colorMode === "dark" ? "whiteAlpha.700" : "blackAlpha.700"
                  }
                >
                  {titles.data?.map((title) => (
                    <Link
                      fontSize="sm"
                      key={title.id}
                      href={`/ms22/${urlConverter(activeKey)}/${title.id}`}
                      textTransform="capitalize"
                    >
                      {title.title}
                    </Link>
                  ))}
                </VStack>
              )}
            </Flex>
          </Show>
        </Flex>

        {/* Help */}
        <Link
          position="absolute"
          bottom={isMd ? "2rem" : "1rem"}
          right={isMd ? "2rem" : "1rem"}
          zIndex={10}
        >
          <IconButton
            isRound
            colorScheme="green"
            aria-label="help"
            icon={<FiPhone />}
          />
        </Link>
      </Flex>
    </>
  );
};

export default AkaLayout;
