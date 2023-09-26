import { Flex, IconButton, Input, useOutsideClick } from "@chakra-ui/react";
import { useRef } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({
  search,
  setSearch,
  isOpen = false,
  onOpen,
  onClose,
}: {
  search: string;
  setSearch: (value: string) => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  useOutsideClick({
    ref: ref,
    handler: () => {
      ref.current?.blur();
      if (isOpen && !search) {
        onClose && onClose();
      }
    },
  });
  return (
    <Flex position="relative" justifyContent="right" width="100%">
      <Input
        ref={ref}
        type="search"
        width={{ base: isOpen ? "100%" : "0%", md: "18rem" }}
        opacity={{ base: isOpen ? 1 : 0, md: 1 }}
        placeholder="Search"
        border={{
          base: isOpen ? "1px solid gray" : "none",
          md: "1px solid gray",
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        transitionDelay=".2s"
        rounded="md"
        _focus={{
          outline: "none",
          boxShadow: "none",
          WebkitBoxShadow: "none",
          border: "1px solid gray",
        }}
      />
      <IconButton
        aria-label="search"
        icon={<FiSearch />}
        display={{ base: isOpen ? "none" : "block", md: "none" }}
        position="absolute"
        right="0"
        top="0"
        onClick={() => {
          onOpen && onOpen();
          ref.current?.focus();
        }}
      />
    </Flex>
  );
};

export default SearchBar;
