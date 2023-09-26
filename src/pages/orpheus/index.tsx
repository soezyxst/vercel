import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AkaMS22 = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/orpheus/beranda");
  }, [router]);

  return null;
};

export default AkaMS22;
