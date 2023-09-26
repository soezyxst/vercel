import { Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import SearchBar from "~/components/SearchBar";
import LinkCard from "~/components/card/LinkCard";
import FetchingComponent from "~/components/loading/Fetching";
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";

const LinkPenting = () => {
  const [search, setSearch] = useState("" as string);
  const debounce = useDebounce(search, 500);
  const disclosure = useDisclosure();
  const links = api.link.getLinkPentings.useQuery({
    filter: debounce,
  });
  return (
    <AkaLayout title="Link Penting" activeKey="Link Penting">
      <Flex justifyContent="right" gap="1rem" alignItems="center">
        <SearchBar search={search} setSearch={setSearch} {...disclosure} />
      </Flex>
      <FetchingComponent {...links} noData={links.data?.linkPenting?.length === 0}>
        {links.data?.linkPenting.map((link, index) => (
          <LinkCard
            key={index}
            index={index}
            {...link}
            authorName={link.author?.profile?.name}
          />
        ))}
      </FetchingComponent>
    </AkaLayout>
  );
};

export default LinkPenting;
