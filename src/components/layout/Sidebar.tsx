import {
  Button,
  Flex,
  Link,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { FiArrowLeft } from "react-icons/fi";
import {
  GoAlert,
  GoBell,
  GoFile,
  GoHome,
  GoInfo,
  GoLink,
  GoPencil,
  GoPin,
} from "react-icons/go";

export function urlConverter(url: string) {
  return url.replace(/ /g, "-").toLowerCase();
}

export const tabIcons = [
  <GoHome key="1" />,
  <GoFile key="4" />,
  <GoBell key="7" />,
  <GoInfo key="5" />,
  <GoLink key="2" />,
  <GoPin key="6" />,
  <GoAlert key="3" />,
];

const Sidebar = ({ activeKey }: { activeKey?: string }) => {
  const [isMd] = useMediaQuery(["(min-width: 768px)"]);
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const router = useRouter()
  const { data: session } = useSession();
  return (
    <Flex
      direction="column"
      width={isMd ? "calc(12vw + 5ch)" : "100%"}
      gap=".5rem"
    >
      <Flex
        cursor="pointer"
        padding=".5rem"
        width="min-content"
        _hover={{ backgroundColor: "#ffffff22" }}
        rounded="full"
        onClick={() => router.back()}
      >
        <FiArrowLeft />
      </Flex>
      {[
        "Beranda",
        "Info Angkatan",
        "Kegiatan Angkatan",
        "Info Kuliah",
        "Link Penting",
        "Tanya PR",
        "Ujian",
      ].map((item, index) => (
        <Link href={"/ms22/" + urlConverter(item)} key={index}>
          <Button
            width="100%"
            justifyContent="left"
            paddingLeft={activeKey === item ? "1rem" : ".5rem"}
            bgColor="transparent"
            leftIcon={activeKey !== item ? tabIcons[index] : <></>}
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
      ))}
      {(session?.user.role === Role.ADMIN ||
        session?.user.role === Role.SUPERADMIN) && (
          <Link href={`/ms22/${urlConverter("admin")}`}>
            <Button
              width="100%"
              justifyContent="left"
              bgColor="transparent"
              leftIcon={activeKey !== "Admin" ? <GoPencil /> : <></>}
              paddingLeft={activeKey === "Admin" ? "1rem" : ".5rem"}
              borderLeft={
                activeKey === "Admin"
                  ? isDarkMode
                    ? "2px solid #ddd"
                    : "2px solid #00000055"
                  : ""
              }
              color={
                activeKey === "Admin" ? (isDarkMode ? "#fff" : "#000") : ""
              }
              rounded={activeKey === "Admin" ? "" : "md"}
              fontWeight={activeKey === "Admin" ? "bold" : ""}
              transition={activeKey === "Admin" ? "all .2s ease-in-out" : ".1s"}
              _hover={{
                backgroundColor:
                  activeKey === "Admin"
                    ? ""
                    : isDarkMode
                    ? "rgba(255, 255, 255, .1)"
                    : "rgba(0, 0, 0, .1)",
              }}
              onClick={(e) => {
                if (activeKey === "Admin") {
                  e.preventDefault();
                  return;
                }
              }}
            >
              Admin
            </Button>
          </Link>
        )}
    </Flex>
  );
};

export default Sidebar;
