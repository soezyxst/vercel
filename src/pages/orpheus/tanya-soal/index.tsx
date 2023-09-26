import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import LoadingPage from "~/components/loading/Loading";
import SearchBar from "~/components/SearchBar";
import SignInButton from "~/components/auth/SignInButton";
import QuestionCard from "~/components/card/QuestionCard";
import TanyaPRForm from "~/components/form/TanyaPRForm";
import AkaLayout from "~/layouts/AkaLayout";
import { api } from "~/utils/api";
import FetchingComponent from '~/components/loading/Fetching';

const TanyaPR = () => {
  const [search, setSearch] = useState("" as string);
  const debounce = useDebounce(search, 500);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const alertDisclosure = useDisclosure();
  const disclosure = useDisclosure();
  const { status } = useSession();
  const [isMd] = useMediaQuery(["(min-width: 768px)"]);
  const questions = api.qna.getQuestions.useQuery({
    filterBy: "all",
    search: debounce,
  });

  if (status === "loading") {
    return <LoadingPage />;
  }

  return (
    <AkaLayout title="Tanya Soal" activeKey="Tanya Soal">
      <Flex
        position="sticky"
        top="-7.5rem"
        zIndex="1"
        gap="1rem"
        justifyContent="right"
      >
        <Button
          onClick={() => {
            if (status === "authenticated") {
              onOpen();
            } else {
              alertDisclosure.onOpen();
            }
          }}
          paddingBlock="1rem"
          colorScheme="twitter"
          width="80%"
          maxWidth="10rem"
          size={{ base: "sm", md: "md" }}
        >
          Tanya PR
        </Button>
        <SearchBar search={search} setSearch={setSearch} {...disclosure} />
        <Modal {...alertDisclosure}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Alert!!!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Login dulu buat nanya ya..</Text>
            </ModalBody>
            <ModalFooter>
              <SignInButton />
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      <TanyaPRForm
        isOpen={isOpen}
        onClose={onClose}
        refetch={questions.refetch}
      />
      <FetchingComponent {...questions} noData={questions.data?.length === 0}>
        {questions.data?.map((question) => (
          <QuestionCard
            key={question.id}
            {...question}
            authorName={question.author?.profile?.name}
            vote={question._count?.votes}
            answer={question._count?.answers}
            refetch={questions.refetch}
            isMd={isMd}
          />
        ))}
      </FetchingComponent>
    </AkaLayout>
  );
};

export default TanyaPR;
