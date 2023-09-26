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
  Select,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { type UploadResult } from "./TanyaPRForm";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "../CustomDateInput";
import UploadButton from "~/components/button/UploadButton";
import {
  type CreateAnnouncementFormProps,
  type CreateAnnouncementProps,
} from "./CreateAnnouncementForm";

const UpdateAnnouncementForm = ({
  onClose,
  isOpen,
  refetch,
  id,
}: CreateAnnouncementProps) => {
  const toast = useToast();
  const {
    register,
    formState: { isDirty, isSubmitting, isValid, errors },
    handleSubmit,
    reset,
  } = useForm<CreateAnnouncementFormProps>();

  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  const updateAnnouncement = api.announcement.updateAnnouncement.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
    },
  });

  const { data } = api.announcement.getAnnouncement.useQuery({ id: id! });

  const onSubmit: SubmitHandler<CreateAnnouncementFormProps> = async (
    data,
    e
  ) => {
    e?.preventDefault();

    const temp = uploadResult.map((result) => result.info.public_id);
    const res = await updateAnnouncement.mutateAsync({
      id: id ?? "",
      title: data.title,
      content: data.content,
      type: data.type,
      filePath: temp.toString() ? temp.toString() : undefined,
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
      onClose={() => {
        onClose();
        setIsUploaded(false);
      }}
      size={{ base: "sm", md: "2xl", lg: "5xl" }}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Input type="submit" isDisabled disabled display="none" aria-hidden />
          <ModalHeader>Update Announcement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Judul</FormLabel>
              <Input
                defaultValue={data?.title}
                type="text"
                {...register("title", { required: "Tambahin judul ya..." })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.content}>
              <FormLabel>Konten</FormLabel>
              <Textarea
                minHeight="40vh"
                defaultValue={data?.content}
                {...register("content", {
                  required: "Jangan kosong dong",
                })}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.type} mb="1rem">
              <FormLabel>Tipe Pengumuman</FormLabel>
              <Select
                defaultValue={data?.type}
                {...register("type", { required: "Pilih Tipe Link" })}
                maxWidth="18rem"
              >
                <option value="ORGANIZATION">Angkatan</option>
                <option value="ACADEMIC">Akademik</option>
              </Select>
              <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>Tanggal</FormLabel>
              <DatePicker
                selected={date}
                onChange={(date: Date) => {
                  register("date", { value: date, required: true })
                  setDate(date)
                }}
                customInput={<CustomDateInput />}
                closeOnScroll
              />
            </FormControl>
            <Flex marginTop="1rem">
              <UploadButton
                isUploaded={isUploaded}
                setIsUploaded={setIsUploaded}
                setUploadResult={setUploadResult}
              />
            </Flex>
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

export default UpdateAnnouncementForm;
