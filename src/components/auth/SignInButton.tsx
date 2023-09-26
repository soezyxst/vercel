import { Button, type ButtonProps } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { FiLogIn } from "react-icons/fi";

const SignInButton = ({ ...props }: ButtonProps) => {
  return (
    <Button
      onClick={() => void signIn()}
      leftIcon={<FiLogIn />}
      colorScheme="green"
      size={{ base: "sm", md: "md" }}
      {...props}
    >
      Login
    </Button>
  );
};

export default SignInButton;
