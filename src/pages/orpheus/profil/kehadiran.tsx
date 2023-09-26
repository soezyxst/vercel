import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import ProfileLayout from "~/layouts/ProfileLayout";
import { api } from "~/utils/api";
import { useState } from "react";
import PermissionForm from "~/components/form/PermissionForm";

const Kehadiran = () => {
  const toast = useToast();
  const [activeKey, setActiveKey] = useState<number | undefined>();
  const activities = api.activity.getActivities.useQuery();
  const submissions = api.attendance.userSubmissions.useQuery();
  const isSubmitted = (id: string) =>
    submissions.data?.some((submission) => submission.attendanceId === id);
  const submissionStatus = (id: string) => {
    const submission = submissions.data?.find(
      (submission) => submission.attendanceId === id
    );
    return submission?.status;
  };

  const attend = api.attendance.submitAttendance.useMutation({
    onSuccess: async () => {
      await activities.refetch();
      toast({
        title: "Attendance submitted",
        status: "success",
        duration: 1500,
        isClosable: true,
      });

      await submissions.refetch();
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    },
  });
  return (
    <ProfileLayout activeKey="Kehadiran" title="Kehadiran">
      <Flex padding="2rem" direction="column" gap="1rem" width="100%">
        {activities.data?.map((activity, index) =>
          activity.atttendance?.id ? (
            <Flex
              key={index}
              direction={{ base: "column", md: "row" }}
              justifyContent="space-between"
              padding={{ base: "1rem", md: "1.5rem" }}
              borderRadius="md"
              border="1px solid"
              gap="1rem"
              borderColor="gray.200"
              width="100%"
              alignItems="center"
            >
              <Flex
                direction="column"
                gap=".5rem"
                textAlign={{ base: "center", md: "left" }}
              >
                <Text
                  fontWeight="semibold"
                  fontSize={{ base: "lg", md: "2xl" }}
                >
                  {activity.title}
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  {activity.location}
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }}>
                  {activity.startTime.toLocaleString()} {" "} - {" "} {activity.endTime.toLocaleString()}
                </Text>
              </Flex>
              {!isSubmitted(activity.atttendance.id) ? (
                activity.atttendance.endTime > new Date() ? (
                  <Flex gap={{ base: ".5rem", md: "1rem" }}>
                    <Button
                      colorScheme="whatsapp"
                      onClick={() => {
                        attend.mutate({
                          id: activity.atttendance?.id ?? "",
                          status: "Present",
                        });
                      }}
                    >
                      Tandai Hadir
                    </Button>
                    <Button
                      colorScheme="linkedin"
                      onClick={() => {
                        setActiveKey(index);
                      }}
                    >
                      Izin
                    </Button>
                    <PermissionForm
                      isOpen={activeKey === index}
                      onClose={() => setActiveKey(undefined)}
                      id={activity.atttendance?.id}
                    />
                  </Flex>
                ) : (
                  <Text fontSize={{ base: "sm", md: "md" }} color="red">
                    Tidak Hadir
                  </Text>
                )
              ) : (
                <Text
                  fontSize={{ base: "sm", md: "md" }}
                  color={
                    submissionStatus(activity.atttendance.id) === "Present"
                      ? "green"
                      : "orange"
                  }
                >
                  {submissionStatus(activity.atttendance?.id) === "Present"
                    ? "Hadir"
                    : "Izin"}
                </Text>
              )}
            </Flex>
          ) : null
        )}
      </Flex>
    </ProfileLayout>
  );
};

export default Kehadiran;
