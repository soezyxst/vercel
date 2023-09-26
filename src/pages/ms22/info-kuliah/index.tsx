import {
  Divider,
  Flex,
  Grid,
  Heading,
  Link,
  Text,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { Subject } from "@prisma/client";
import { useState } from "react";
import { BsFolder } from "react-icons/bs";
import { useDebounce } from "usehooks-ts";
import SearchBar from "~/components/SearchBar";
import AnnouncementCard from "~/components/card/AnnouncementCard";
import FetchingComponent from "~/components/loading/Fetching";
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const InfoKuliah = () => {
  const { colorMode } = useColorMode();
  const [search, setSearch] = useState("" as string);
  const debounce = useDebounce(search, 500);
  const disclosure = useDisclosure();
  const announcements = api.announcement.getAnnouncements.useQuery({
    type: "ACADEMIC",
    filter: debounce,
  });

  return (
    <AkaLayout title="Info Kuliah" activeKey="Info Kuliah">
      <Heading fontSize={{ base: "md", md: "2xl" }}>Folder</Heading>
      <Grid
        gap="1rem"
        gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
      >
        {Object.keys(Subject).map((subject, index) => {
          return (
            <Link
              key={index}
              href={"/ms22/info-kuliah/mata-kuliah/" + subject.toLowerCase()}
              _hover={{
                textDecoration: "none",
              }}
            >
              <Flex
                alignItems="center"
                fontSize={{ base: "2rem", md: "4rem" }}
                gap="1rem"
                padding={{ base: ".5rem", md: ".75rem" }}
                rounded="xl"
                backgroundColor={
                  colorMode === "light" ? "gray.200" : "gray.700"
                }
                _hover={{
                  backgroundColor:
                    colorMode === "light" ? "gray.300" : "gray.600",
                }}
                color={colorMode === "light" ? "gray.700" : "gray.300"}
                transitionDuration=".2s"
              >
                <BsFolder />
                <Text fontSize={{ base: "sm", md: "md" }}>{subject}</Text>
              </Flex>
            </Link>
          );
        })}
      </Grid>
      <Divider />
      <Heading fontSize={{ base: "md", md: "2xl" }}>Info</Heading>
      <Flex justifyContent="right">
        <SearchBar search={search} setSearch={setSearch} {...disclosure} />
      </Flex>
      <FetchingComponent
        {...announcements}
        noData={announcements.data?.length === 0}
      >
        {announcements.data?.map((item, index) => (
          <AnnouncementCard
            id={item.id}
            key={index}
            title={item.title}
            filePath={item.filePath}
            content={item.content}
            createdAt={item.createdAt}
            authorName={item.author?.profile?.name}
            type={item.type}
          />
        ))}
      </FetchingComponent>
    </AkaLayout>
  );
};

export default InfoKuliah;
