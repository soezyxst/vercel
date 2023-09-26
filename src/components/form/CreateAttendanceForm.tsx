import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { type DisclosureProps } from "./TanyaPRForm";
import { api } from "~/utils/api";
import { type SubmitHandler, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "../CustomDateInput";
import { useState } from "react";

interface CreateAttendanceFormProps extends DisclosureProps {
  id: string;
}

const CreateAttendanceForm = ({
  isOpen,
  onClose,
  id,
}: CreateAttendanceFormProps) => {
  const activity = api.activity.getActivityById.useQuery({ id });
  const currentTime = new Date();

  const [startTime, setStartTime] = useState(
    activity.data?.atttendance?.startTime ??
      currentTime
  );
  const [endTime, setEndTime] = useState(
    activity.data?.atttendance?.endTime ??
      new Date(currentTime.getTime() + 1000 * 60 * 60 * 2)
  );
  const toast = useToast();
  const createAttendance = api.attendance.createAttendance.useMutation({
    onSuccess: () => {
      toast({
        title: "Attendance created",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    },
  });
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<{ startTime: unknown; endTime: unknown }>();

  const update = api.attendance.updateAttendance.useMutation({
    onSuccess: () => {
      toast({
        title: "Activity updated",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    },
  });

  const onSubmit: SubmitHandler<{
    startTime: unknown;
    endTime: unknown;
  }> = async (data, e) => {
    e?.preventDefault();

    if (activity.data?.atttendance?.id) {
      await update.mutateAsync({
        id: activity.data.atttendance.id,
        startTime: (data.startTime as Date) ?? startTime,
        endTime: (data.endTime as Date) ?? endTime,
      });
    } else {
      await createAttendance.mutateAsync({
        startTime: (data.startTime as Date) ?? startTime,
        endTime: (data.endTime as Date) ?? endTime,
        activityId: id,
      });
    }

    reset();
    console.log(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "2xl", lg: "5xl" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Attendance</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <FormControl isInvalid={!!errors.startTime}>
              <FormLabel>Start Time</FormLabel>
              <DatePicker
                selected={startTime}
                onChange={(date) => {
                  setStartTime(date!);
                  register("startTime", { value: date, required: true });
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
                  register("endTime", { value: date, required: true });
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
            <Button
              marginBlock="1rem"
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateAttendanceForm;
