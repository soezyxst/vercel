import { motion } from "framer-motion";
import { CldOgImage } from "next-cloudinary";
import Head from "next/head";

const FramerMotion = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Head>
        <title>Soezyxst</title>
        <meta property="og:title" content="Soezyxst" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:url" content="https://soezyxst.me/" />
        <meta name="twitter:title" content="Soezyxst by Adi" />
        <meta
          name="twitter:description"
          content="Soezyxst by Adi"
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/dnbfcoads/image/upload/v1694053741/logo_jljfjb.png"
        />
        <CldOgImage src="logo_jljfjb" alt="soezyxst" />
      </Head>
      {children}
    </motion.div>
  );
};

export default FramerMotion;
