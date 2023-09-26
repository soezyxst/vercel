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

export interface CreateActivityFormProps {
  title: string;
  content: string;
  location: string;
  kuorum: number;
  startTime: unknown;
  endTime: unknown;
}

export interface CreateActivityProps extends DisclosureProps {
  id?: string;
}

const CreateActivityForm = ({
  onClose,
  isOpen,
  refetch,
}: CreateActivityProps) => {
  const toast = useToast();
  const {
    register,
    formState: { isDirty, isSubmitting, isValid, errors },
    handleSubmit,
    reset,
  } = useForm<CreateActivityFormProps>();

  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult[]>([]);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const createActivity = api.activity.createActivity.useMutation({
    onSuccess: async () => {
      if (refetch) await refetch();
      toast({
        title: "Activity created.",
        description: "Activity berhasil dibuat.",
        status: "success",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      });
    },
  });

  const onSubmit: SubmitHandler<CreateActivityFormProps> = async (data, e) => {
    e?.preventDefault();

    const temp = uploadResult.map((result) => result.info.public_id);

    await createActivity.mutateAsync({
      title: data.title,
      content: data.content,
      filePath: temp.toString(),
      location: data.location,
      kuorum: Number(data.kuorum),
      startTime: data.startTime as Date ?? startTime,
      endTime: data.endTime as Date ?? endTime,
    });
    reset();
    onClose();
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
          <ModalHeader>New Activity</ModalHeader>
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
              <FormLabel>Deskripsi</FormLabel>
              <Textarea
                minHeight="30vh"
                {...register("content", {
                  required: "Jangan kosong dong",
                })}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.kuorum}>
              <FormLabel>Kuorum</FormLabel>
              <Input
                type="number"
                {...register("kuorum", {
                  required: "Tambahin kuorum dong",
                })}
              />
              <FormErrorMessage>{errors.kuorum?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.location}>
              <FormLabel>Lokasi</FormLabel>
              <Input
                type="text"
                {...register("location", {
                  required: "Tambahin lokasi dong",
                })}
              />
              <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.startTime}>
              <FormLabel>Start Time</FormLabel>
              <DatePicker
                selected={startTime}
                onChange={(date) => {
                  setStartTime(date!);
                  register("startTime", { value: date!, required: true });
                }}
                customInput={<CustomDateInput />}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                timeCaption="time"
                dateFormat="d MMMM yyyy, h:mm:ss aa"
              />
              <FormErrorMessage>{errors.startTime?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.endTime}>
              <FormLabel>End Time</FormLabel>
              <DatePicker
                selected={endTime}
                onChange={(date) => {
                  setEndTime(date!);
                  register("endTime", { value: date!, required: true });
                }}
                customInput={<CustomDateInput />}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                timeCaption="time"
                dateFormat="d MMMM yyyy, h:mm:ss aa"
              />
              <FormErrorMessage>{errors.endTime?.message}</FormErrorMessage>
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

export default CreateActivityForm;
