import { Card, CardBody, Heading, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { urlConverter } from '~/components/layout/Sidebar';
import AkaLayout from "~/layouts/AkaLayout";

const Matkul = () => {
  const router = useRouter();
  const { matkul } = router.query;
  return (
    <AkaLayout
      activeKey="Info Kuliah"
      title={matkul?.toString()?.toUpperCase() ?? ""}
    >
      <Heading size="lg" mb="1rem" textTransform="capitalize">
        {matkul}
      </Heading>
      {["Materi", "Bank Soal", "Pembahasan", "Tutor"].map((item, index) => (
        <Link key={index} href={matkul as string + '/' + urlConverter(item)} _hover={{ textDecoration: "none" }}>
          <Card variant="outline" height="15vh">
            <CardBody>
              <Heading size={{ base: "sm", md: "md" }}>{item}</Heading>
            </CardBody>
          </Card>
        </Link>
      ))}
    </AkaLayout>
  );
};

export default Matkul;
