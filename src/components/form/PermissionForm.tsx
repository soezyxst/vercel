import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { type UploadResult, type DisclosureProps } from "./TanyaPRForm";
import { type SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { useState } from "react";
import UploadButton from '../button/UploadButton';

interface PermissionFormProps extends DisclosureProps {
  id: string;
}

interface PermissionFormValues {
  type: string;
  content: string;
}

const PermissionForm = ({ isOpen, onClose, id, refetch }: PermissionFormProps) => {
  const toast = useToast();

  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult[]>([]);
  const attendance = api.attendance.submitAttendance.useMutation();

  const permission = api.attendance.submitPermission.useMutation({
    onSuccess: async () => {
      toast({
        title: "Berhasil",
        description: "Berhasil mengirim izin",
        status: "success",
        duration: 1500,
        isClosable: true,
      });

      if (refetch) await refetch();
    },
    onError: () => {
      toast({
        title: "Gagal",
        description: "Gagal mengirim izin",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isValid, isSubmitting },
    reset,
  } = useForm<PermissionFormValues>();

  const onSubmit: SubmitHandler<PermissionFormValues> = async (data, e) => {
    e?.preventDefault();

    const attendanceSubmit = await attendance.mutateAsync({
      id: id,
      status: "Permitted",
    });

    const temp = uploadResult.map((result) => result.info.public_id);

    await permission.mutateAsync({
      submissionId: attendanceSubmit.id,
      type: data.type,
      content: data.content,
      filePath: temp.toString(),
    });

    reset();
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
        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <Input type="submit" isDisabled disabled display="none" aria-hidden />
          <ModalHeader>Izin</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!errors.content}>
              <FormLabel>Alasan</FormLabel>
              <Textarea
                minHeight="15rem"
                {...register("content", { required: "Jangan kosong yaaa" })}
              />
              <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.type}>
              <FormLabel>Tipe</FormLabel>
              <Select
                placeholder="..."
                {...register("type", { required: "Isi dulu frenn" })}
              >
                <option value="sakit">Sakit</option>
                <option value="akademik">Akademik</option>
                <option value="keluarga">Keluarga</option>
                <option value="lainnya">Lainnya</option>
              </Select>
              <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
            </FormControl>
            <Flex marginBlock="1rem" justifyContent="space-between">
              <UploadButton
                isUploaded={isUploaded}
                setIsUploaded={setIsUploaded}
                setUploadResult={setUploadResult}
              />
              <Button
                type="submit"
                isLoading={isSubmitting}
                isDisabled={!isDirty || !isValid}
                colorScheme="blue"
              >
                Submit
              </Button>
            </Flex>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default PermissionForm;
