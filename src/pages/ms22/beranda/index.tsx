import {
  Flex,
  Heading,
  Text,
  Image,
  IconButton,
  Grid,
  Box,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEventListener } from "usehooks-ts";
import AkaLayout from "~/layouts/AkaLayout";

const Beranda = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);
  const tempRef = useRef<boolean>(false);

  const startSliding = () => {
    intervalRef.current = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += carouselRef.current.offsetWidth;
      }
    }, 5000);
  };

  const stopSliding = () => {
    intervalRef.current && clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (carouselRef.current && !tempRef.current) {
      [...carouselRef.current.children]
        .slice(-1)
        .reverse()
        .forEach((child) => {
          carouselRef.current?.insertAdjacentHTML(
            "afterbegin",
            child.outerHTML
          );
        });

      [...carouselRef.current.children].slice(1, 2).forEach((child) => {
        carouselRef.current?.insertAdjacentHTML("beforeend", child.outerHTML);
      });
    }

    return () => {
      tempRef.current = true;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += carouselRef.current.offsetWidth;
      }
    }, 5000);

    intervalRef.current = interval;

    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, []);

  useEventListener(
    "scroll",
    () => {
      stopSliding();
      if (carouselRef.current) {
        if (carouselRef.current.scrollLeft === 0) {
          carouselRef.current.style.scrollBehavior = "auto";
          carouselRef.current.scrollLeft =
            carouselRef.current.scrollWidth -
            2 * carouselRef.current.offsetWidth;
          carouselRef.current.style.scrollBehavior = "smooth";
        } else if (
          Math.abs(
            Math.ceil(carouselRef.current.scrollLeft) -
              (carouselRef.current.scrollWidth -
                carouselRef.current.offsetWidth)
          ) <= 5
        ) {
          carouselRef.current.style.scrollBehavior = "auto";
          carouselRef.current.scrollLeft = carouselRef.current.offsetWidth;
          carouselRef.current.style.scrollBehavior = "smooth";
        }
      }
      startSliding();
    },
    carouselRef
  );

  return (
    <AkaLayout title="Beranda" activeKey="Beranda">
      <Flex direction="column" width="100%" gap="1.5rem" alignItems="stretch">
        <Flex justifyContent="center" position="relative" width="100%">
          <Grid
            ref={carouselRef}
            gridAutoFlow="column"
            gridAutoColumns="100%"
            overflowX="scroll"
            overflowY="hidden"
            width="90%"
            aspectRatio={16 / 9}
            sx={{
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            scrollSnapType="x mandatory"
            scrollBehavior="smooth"
          >
            <Box
              height="100%"
              overflow="hidden"
              paddingInline=".5rem"
              scrollSnapAlign="center"
            >
              <Image
                src={"/foto-angkatan.jpg"}
                alt=""
                objectFit="cover"
                objectPosition="center"
              />
            </Box>
            <Box
              height="100%"
              overflow="hidden"
              paddingInline=".5rem"
              scrollSnapAlign="center"
            >
              <Image
                src={"/gath-1.jpg"}
                alt=""
                objectFit="cover"
                objectPosition="center"
              />
            </Box>
            <Box
              height="100%"
              overflow="hidden"
              paddingInline=".5rem"
              scrollSnapAlign="center"
            >
              <Image
                src={"/gath-2.jpg"}
                alt=""
                objectFit="cover"
                objectPosition="center"
              />
            </Box>
          </Grid>
          <IconButton
            aria-label="right-button"
            icon={<FiChevronRight />}
            position="absolute"
            right={0}
            zIndex={1}
            insetBlock={0}
            transform="translateX(50%)"
            marginBlock="auto"
            bgColor="transparent"
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollLeft +=
                  carouselRef.current.offsetWidth;
              }
            }}
          />
          <IconButton
            aria-label="left-button"
            icon={<FiChevronLeft />}
            position="absolute"
            left={0}
            insetBlock={0}
            transform="translateX(-50%)"
            marginBlock="auto"
            bgColor="transparent"
            onClick={() => {
              if (carouselRef.current) {
                carouselRef.current.scrollLeft -=
                  carouselRef.current.offsetWidth;
              }
            }}
          />
        </Flex>
        <Heading>MS 22</Heading>
        <Text textAlign="justify">
          {
            "Web ini dibuat sebagai database MS'22. Ke depannya masih butuh banyak pengembangan dan masukan. Mungkin masih ada beberapa yang non-fungsional dan tidak tertutup kemungkinan akan ada fitur lain. Buat sekarang, ini belum siap untuk digunakan secara penuh. Semoga bermanfaat!!"
          }
        </Text>
      </Flex>
    </AkaLayout>
  );
};

export default Beranda;
