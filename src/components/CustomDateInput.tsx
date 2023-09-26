import { Input, forwardRef } from "@chakra-ui/react";

interface CustomDateInputProps {
  value?: Date | string;
  onClick?: () => void;
  onChange?: () => void;
}

const CustomDateInput = forwardRef(
  ({ value, onClick, onChange }: CustomDateInputProps, ref) => {
    return (
      <Input
        ref={ref}
        width='18rem'
        value={value?.toString()}
        onClick={onClick}
        onChange={onChange}
      />
    );
  }
);

export default CustomDateInput;
