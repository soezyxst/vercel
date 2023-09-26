import { Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import SearchBar from "~/components/SearchBar";
import AnnouncementCard from "~/components/card/AnnouncementCard";
import FetchingComponent from "~/components/loading/Fetching";
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const InfoAngkatan = () => {
  const [search, setSearch] = useState("" as string);
  const debounce = useDebounce(search, 500);
  const disclosure = useDisclosure();
  const announcements = api.announcement.getAnnouncements.useQuery({
    type: "ORGANIZATION",
    filter: debounce,
  });

  return (
    <AkaLayout title="Info Angkatan" activeKey="Info Angkatan">
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
            updatedAt={item.updatedAt}
            authorName={item.author?.profile?.name}
          />
        ))}
      </FetchingComponent>
    </AkaLayout>
  );
};

export default InfoAngkatan;
