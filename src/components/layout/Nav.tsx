import {
  Flex,
  Link,
  Image,
  type FlexProps,
  Text,
  Icon,
  useColorMode,
  Divider,
} from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

const Nav = ({ children, ...props }: FlexProps) => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <nav>
      <Flex
        alignItems="stretch"
        height="4rem"
        paddingInline="2rem"
        boxShadow="0px 0px 5px rgba(0, 0, 0, .4)"
        gap="3rem"
        position="sticky"
        top="0"
        justifyContent="space-between"
        {...props}
        zIndex={10}
      >
        <Flex alignItems="center" justifyContent="center" gap="1rem">
          <Link href="/" _hover={{ textDecoration: "none" }}>
            <Flex alignItems="center" gap="1rem">
              <Image src="/logo.png" alt="logo" height="2rem" />
              <Text
                fontWeight="semibold"
                display={{ base: "none", md: "block" }}
              >
                Soezyxst
              </Text>
            </Flex>
          </Link>
        </Flex>
        <Flex alignItems="stretch" gap="1rem" height="100%">
          <Flex alignItems="center" gap="1rem">
            <Icon
              as={colorMode === "dark" ? FiSun : FiMoon}
              onClick={toggleColorMode}
              cursor="pointer"
            />
            <Text
              fontSize="sm"
              fontWeight="semibold"
              display={{ base: "none", md: "block" }}
            >
              {colorMode === "dark" ? "Night" : "Day"}
            </Text>
            <Divider orientation="vertical" height="80%" />
          </Flex>
          {children}
        </Flex>
      </Flex>
    </nav>
  );
};

export default Nav;
