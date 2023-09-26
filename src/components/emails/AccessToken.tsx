import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { type SepedaProps } from "~/pages/orpheus/sepeda/register";

const baseUrl = process.env.LOGO_URL ?? "";

export const AccessToken = ({ name, nim, bike, link: url }: SepedaProps) => (
  <Html>
    <Head />
    <Preview>
      Verification email for {name} {" - "} ({nim})
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section
          style={{
            paddingInline: "16px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "16px",
              alignItems: "center",
            }}
          >
            <Img
              src={baseUrl}
              width="32"
              height="32"
              alt="Orpheus"
              style={{
                borderRadius: "50%",
                marginRight: "8px",
              }}
            />
            <div>
              <strong>Orpheus</strong>
            </div>
          </div>

          <Text style={title}>
            @<strong>{name}</strong> verifikasi akun Anda
          </Text>
        </Section>

        <Section style={section}>
          <Text style={text}>
            Halo <strong>{name}</strong>!
          </Text>
          <Text style={text}>
            Seseorang telah menggunakan email Anda untuk membuat akun Orpheus
            Bike untuk nomor sepeda <strong>{bike}</strong>. Jika ini Anda, klik
            tombol di bawah ini untuk memverifikasi akun Anda.
          </Text>

          <Link href={url} style={button}>
            Verifikasi
          </Link>

          <Text
            style={{
              marginTop: "20px",
              textAlign: "left" as const,
            }}
          >
            Jika ini bukan Anda, abaikan email ini dan akun tidak akan dibuat.
          </Text>
        </Section>

        <Text style={links}>
          <Link style={link}>Why do I get this email?</Link> ・{" "}
          <Link style={link}>Contact support</Link>
        </Text>

        <Text style={footer}>
          Orpheus Engine ・ Teknik Mesin ITB 2022, Jl. Ganesha 10, Bandung, Jawa
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AccessToken;

const main = {
  backgroundColor: "transparent",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  width: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "16px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};

const text = {
  margin: "0 0 20px 0",
  textAlign: "left" as const,
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  borderRadius: "6px",
  padding: ".75em 1.5em",
};

const links = {
  textAlign: "center" as const,
};

const link = {
  color: "#0366d6",
  fontSize: "12px",
};

const footer = {
  color: "#6a737d",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "60px",
};
