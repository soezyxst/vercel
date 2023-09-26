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
import { type UploadResult, type DisclosureProps } from "./TanyaPRForm";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "../CustomDateInput";
import UploadButton from "../button/UploadButton";

export interface CreateAnnouncementFormProps {
  title: string;
  content: string;
  type: "ORGANIZATION" | "ACADEMIC";
  date: Date;
}

export interface CreateAnnouncementProps extends DisclosureProps {
  type?: "create" | "update";
  id?: string;
}

const CreateAnnouncementForm = ({
  onClose,
  isOpen,
  refetch,
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

  const createAnnouncement = api.announcement.createAnnouncement.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
    },
  });

  const onSubmit: SubmitHandler<CreateAnnouncementFormProps> = async (
    data,
    e
  ) => {
    e?.preventDefault();

    const temp = uploadResult.map((result) => result.info.public_id);

    const res = await createAnnouncement.mutateAsync({
      title: data.title,
      content: data.content,
      type: data.type,
      filePath: temp.toString(),
      date: data.date ?? date,
    });

    if (res.message) {
      toast({
        title: "Berhasil!",
        description: res.message,
        status: "success",
        duration: 1500,
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
          <ModalHeader>New Announcement</ModalHeader>
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
            <FormControl isInvalid={!!errors.content}>
              <FormLabel>Konten</FormLabel>
              <Textarea
                minHeight="40vh"
                {...register("content", {
                  required: "Jangan kosong dong",
                })}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.type} mb="1rem">
              <FormLabel>Tipe Pengumuman</FormLabel>
              <Select
                placeholder="..."
                {...register("type", { required: "Pilih Tipe Link" })}
                size={{ base: "sm", md: "md" }}
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
                  setDate(date);
                  register("date", { value: date, required: true });
                }}
                customInput={<CustomDateInput />}
                closeOnScroll
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm:ss aa"
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

export default CreateAnnouncementForm;
