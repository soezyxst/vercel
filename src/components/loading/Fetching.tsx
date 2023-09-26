import { Flex, Spinner } from "@chakra-ui/react";

interface FetchingProps {
  isError?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  isSuccess?: boolean;
  noData?: boolean;
  children?: React.ReactNode;
}

const FetchingComponent = ({
  isError,
  isFetching,
  isLoading,
  noData,
  isSuccess,
  children,
}: FetchingProps) => {
  if (isError) {
    return <Flex justifyContent="center">Gagal memuat data...</Flex>;
  }
  if (isLoading) {
    return (
      <Flex justifyContent="center">
        <Spinner mr="1rem" /> Memuat data...
      </Flex>
    );
  }
  if (isFetching) {
    return (
      <Flex justifyContent="center">
        <Spinner mr="1rem" /> Memuat data...
      </Flex>
    );
  }
  if (noData) {
    return <Flex justifyContent="center">Tidak ada data</Flex>;
  }
  if (isSuccess) {
    return <>{children}</>;
  }
};

export default FetchingComponent;
