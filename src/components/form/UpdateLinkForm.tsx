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
import { useState } from "react";
import CustomDateInput from "../CustomDateInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  type CreateLinkFormProps,
  type CreateLinkProps,
} from "./CreateLinkForm";

const UpdateLinkForm = ({ onClose, isOpen, refetch, id }: CreateLinkProps) => {
  const toast = useToast();
  const {
    register,
    formState: { isDirty, isSubmitting, isValid, errors },
    handleSubmit,
    reset,
  } = useForm<CreateLinkFormProps>();

  const updateLink = api.link.updateLinkPenting.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
    },
  });
  const { data } = api.link.getLinkPenting.useQuery({ id: id! });
  const [date, setDate] = useState<Date>(new Date());

  const onSubmit: SubmitHandler<CreateLinkFormProps> = async (data, e) => {
    e?.preventDefault();

    let res = null;

    res = await updateLink.mutateAsync({
      id: id ?? "",
      title: data.title,
      url: data.url,
      description: data.description,
      date: data.date ?? undefined,
    });

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
          <ModalHeader>Update Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Judul</FormLabel>
              <Input
                defaultValue={data?.linkPenting?.title}
                type="text"
                {...register("title", { required: "Tambahin judul ya..." })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.url}>
              <FormLabel>Link</FormLabel>
              <Textarea
                minHeight="15vh"
                defaultValue={data?.linkPenting?.url}
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
                defaultValue={data?.linkPenting?.description}
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
                onChange={(date: Date) => {
                  register("date", { value: date, required: true });
                  setDate(date);
                }}
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

export default UpdateLinkForm;
