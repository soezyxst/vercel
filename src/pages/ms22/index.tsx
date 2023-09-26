import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AkaMS22 = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/ms22/beranda");
  }, [router]);

  return null;
};

export default AkaMS22;
