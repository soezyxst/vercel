import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { type CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { z } from "zod";
import AccessToken from "~/components/emails/AccessToken";
import { env } from "~/env.mjs";

const resend = new Resend(env.RESEND_API_KEY);

const sendRouteSchema = z.object({
  name: z.string().min(2),
  nim: z.string().min(2),
  email: z.string().email(),
  bike: z.number(),
  link: z.string().url(),
  password: z.string().min(8),
});

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const { name, email, nim, bike, link, password } = sendRouteSchema.parse(
      JSON.parse(req.body as string)
    );

    const emailOptions: CreateEmailOptions = {
      from: "Orpheus <orpheus@soezyxst.me>",
      to: [email],
      subject: `Email Verification - ${name}`,
      react: AccessToken({ name, email, nim, bike, link, password }),
      reply_to: "soezyxst@gmail.com",
    };

    const data = await resend.emails.send(emailOptions);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};

export default sendEmail;
