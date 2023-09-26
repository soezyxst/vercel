import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { type DisclosureProps } from "./TanyaPRForm";
import { useState } from "react";
import CustomDateInput from "../CustomDateInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface CreateLinkFormProps {
  title: string;
  url: string;
  description: string;
  date: Date;
}

export interface CreateLinkProps extends DisclosureProps {
  type?: "create" | "update";
  id?: string;
}

const CreateLinkForm = ({
  onClose,
  isOpen,
  refetch,
  id,
  type = "create",
}: CreateLinkProps) => {
  const toast = useToast();
  const {
    register,
    formState: { isDirty, isSubmitting, isValid, errors },
    handleSubmit,
    reset,
  } = useForm<CreateLinkFormProps>();

  const createLink = api.link.createLinkPenting.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
    },
  });

  const updateLink = api.link.updateLinkPenting.useMutation();
  const [date, setDate] = useState<Date>(new Date());

  const onSubmit: SubmitHandler<CreateLinkFormProps> = async (data, e) => {
    e?.preventDefault();

    let res = null;

    if (type === "create") {
      res = await createLink.mutateAsync({
        title: data.title,
        url: data.url,
        description: data.description,
        date: date,
      });
    } else {
      res = await updateLink.mutateAsync({
        id: id ?? "",
        title: data.title,
        url: data.url,
        description: data.description,
      });
    }

    if (res.message) {
      toast({
        title: "Berhasil!",
        description: res.message,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      onClose();
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "2xl", lg: "5xl" }}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Input type="submit" isDisabled disabled display="none" aria-hidden />
          <ModalHeader>
            {type === "create" ? "New Link" : "Update Link"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Judul</FormLabel>
              <Input
                type="text"
                {...register("title", { required: "Tambahin judul ya..." })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.url}>
              <FormLabel>Link</FormLabel>
              <Textarea
                minHeight="15vh"
                {...register("url", {
                  required: "Link jangan kosong dong",
                })}
              />
              <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Deskripsi</FormLabel>
              <Textarea
                minHeight="40vh"
                {...register("description", {
                  required: "Kasih deskripsi singkat yeee",
                })}
              />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>Tanggal</FormLabel>
              <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
                customInput={<CustomDateInput />}
                closeOnScroll
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText={"Submitting..."}
              isDisabled={!isDirty || !isValid}
              colorScheme="linkedin"
            >
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateLinkForm;
