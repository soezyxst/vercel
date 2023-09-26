import { Button, useToast } from "@chakra-ui/react";
import { CldUploadButton } from "next-cloudinary";
import { FiCheckCircle } from "react-icons/fi";
import { type UploadResult } from "~/components/form/TanyaPRForm";

interface UploadButtonProps {
  isUploaded: boolean;
  setIsUploaded: (value: boolean) => void;
  setUploadResult: (
    value: UploadResult[] | ((prevState: UploadResult[]) => UploadResult[])
  ) => void;
}

const UploadButton = ({
  isUploaded,
  setIsUploaded,
  setUploadResult,
}: UploadButtonProps) => {
  const toast = useToast();
  return isUploaded ? (
    <Button
      leftIcon={<FiCheckCircle />}
      isDisabled
      colorScheme="green"
      size={{ base: "sm", md: "md" }}
    >
      Uploaded
    </Button>
  ) : (
    <CldUploadButton
      uploadPreset="soezyxst"
      className="rounded-xl bg-blue-500 px-3 py-[6px] text-sm font-bold text-white duration-150 hover:bg-blue-700 md:px-4 md:py-2 md:text-base"
      onSuccess={(results) => {
        setUploadResult((prev) => [...prev, results as UploadResult]);
        toast({
          title: "Upload success",
          description: "File berhasil diupload",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setIsUploaded(true);
      }}
    >
      Upload
    </CldUploadButton>
  );
};

export default UploadButton;
