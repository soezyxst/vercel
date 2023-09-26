import {
  Flex,
  Heading,
  Text,
  VStack,
  useColorMode,
  useMediaQuery,
} from "@chakra-ui/react";
import { type CustomCardProps } from "./QuestionCard";
import CloImage from "../image/CloImage";
import { FiCalendar } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";
import { api } from '~/utils/api';

interface ActivityCardProps extends CustomCardProps {
  kuorum?: number;
  permitted?: number;
  present?: number;
  startTime?: Date | string;
  endTime?: Date | string;
  location?: string;
}

const ActivityCard = ({
  title,
  content,
  filePath,
  startTime,
  endTime,
  kuorum,
  location,
  id,
}: ActivityCardProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [isMd] = useMediaQuery(["(min-width: 768px)"]);
  const presences = api.attendance.countIsPresent.useQuery({ activityId: id! }) || 0;
  const permitted = api.attendance.countIsPermitted.useQuery({ activityId: id! }) || 0;

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      width="100%"
      rounded="lg"
      border="1px solid"
      borderColor={isDark ? "gray.300" : "gray.800"}
    >
      <CloImage
        src={filePath? filePath?.split(",")[0] : ""}
        width={{ base: "100%", md: "12.5rem" }}
        aspectRatio={{ base: 1, md: 9 / 16 }}
        objectFit="cover"
        objectPosition="center"
        rounded='lg'
      />
      <Flex
        direction="column"
        padding={{ base: "1.5rem", md: "2rem" }}
        gap="1rem"
        flexGrow={1}
      >
        <Flex alignItems="center" flexGrow={1}>
          <Heading size={{ base: "lg", md: "2xl" }}>{title}</Heading>
        </Flex>
        <VStack align="flex-start" spacing={2}>
          <Text>{content}</Text>
          <Flex
            alignItems="center"
            gap={{ base: ".5rem", md: "1rem" }}
            fontSize={{ base: "xs", md: "sm" }}
          >
            <SlLocationPin />
            <Text>{location}</Text>
          </Flex>
          <Flex
            alignItems="center"
            gap={{ base: ".5rem", md: "1rem" }}
            fontSize={{ base: "2xs", md: "sm" }}
          >
            <FiCalendar />
            <Text>{startTime?.toLocaleString()} {" "} - {" "} {endTime?.toLocaleString()}</Text>
          </Flex>
        </VStack>
      </Flex>
      <Flex
        rounded='lg'
        fontSize={{ base: "xs", md: "sm" }}
        direction={{ base: "row", md: "column" }}
        backgroundColor={isDark ? "blue.800" : "orange.200"}
        sx={{
          div: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            padding: "1rem",
            borderLeft: isMd ? "1px solid" : "none",
            borderTop: isMd ? "none" : "1px solid",
          },
        }}
      >
        <Flex
          borderBottom={{ base: "", md: "1px solid" }}
          borderRight={{ base: "1px solid", md: "none" }}
        >
          <Text>{"Kuorum"}</Text>
          <Text>{kuorum}</Text>
        </Flex>
        <Flex
          borderBottom={{ base: "", md: "1px solid" }}
          borderRight={{ base: "1px solid", md: "none" }}
        >
          <Text>{"Partisipan"}</Text>
          <Text>{presences.data}</Text>
        </Flex>
        <Flex>
          <Text>{"Izin"}</Text>
          <Text>{permitted.data}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ActivityCard;
