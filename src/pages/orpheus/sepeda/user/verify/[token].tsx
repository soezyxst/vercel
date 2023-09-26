import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { prisma } from "~/server/db";
import { Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { TRPCError } from "@trpc/server";

const Token = ({
  verified,
  redirect,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      void router.push(redirect);
    }, 3000);
  }, [redirect, router]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
    >
      <Icon
        as={verified ? FaCheckCircle : GoAlertFill}
        boxSize={{ base: "7rem", md: "10rem" }}
        color={verified ? "green.500" : "red.500"}
      />
      <Heading
        as="h1"
        size={{ base: "md", md: "xl" }}
        textAlign="center"
        my={{ base: 4, md: 6 }}
      >
        {verified ? "You are verified!" : "Ups, something went wrong!"}
      </Heading>
      {verified && (
        <Text fontSize={{ base: "sm", md: "lg" }} textAlign="center">
          Thank you for verifying your account.
        </Text>
      )}
    </Flex>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { token } = context.params as Record<string, string>;

  const user = await prisma.bikeUser.findFirst({
    where: {
      token: {
        some: {
          token,
          updatedAt: {
            gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          },
        },
      },
      // active: false,
    },
    include: {
      bike: true,
      token: true,
    },
  });

  try {
    await prisma.bikeRelation.create({
      data: {
        token: {
          connect: {
            token,
          },
        },
        bike: {
          connect: {
            number: user?.bike[0]?.number,
          },
        },
        bikeUser: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
  } catch {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Unknown Error",
    });
  }

  let redirect = "";

  if (user) {
    await prisma.bikeUser.update({
      where: {
        id: user?.id,
      },
      data: {
        active: true,
      },
    });

    redirect = "/ms22/sepeda/login";
  } else {
    redirect = "/ms22/sepeda/register";
  }

  return {
    props: {
      verified: !!user,
      redirect,
    },
  };
};

export default Token;
