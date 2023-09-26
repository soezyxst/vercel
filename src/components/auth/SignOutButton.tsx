import { Button, type ButtonProps } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

const SignOutButton = ({ ...props }: ButtonProps) => {
  return (
    <Button
      onClick={() => void signOut()}
      leftIcon={<FiLogOut />}
      colorScheme="red"
      size={{ base: "sm", md: "md" }}
      {...props}
    >
      Logout
    </Button>
  );
};

export default SignOutButton;
