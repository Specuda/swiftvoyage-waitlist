import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userFirstname: string;
}

export const SwiftVoyagesEmail = ({ userFirstname }: EmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome aboard SwiftVoyages, {userFirstname}! 🛫</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://swiftvoyages.com/waitlist-logo.png`}
          width="220"
          height="100"
          alt="SwiftVoyages Logo"
          style={logo}
        />
        <Text style={greeting}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Thanks for joining the SwiftVoyages waitlist! We're thrilled to have you on board
          as we prepare to revolutionize the way people book and plan their flights.
        </Text>
        <Text style={paragraph}>
          We're working hard to create a flight booking experience that's truly transparent,
          simple, and seamless. You'll be among the first to know when we're ready for takeoff.
          In the meantime, if you have any questions or thoughts about what you'd like to see
          in a flight booking platform, feel free to reply to this email.
        </Text>
        <Text style={paragraph}>
          Get ready for a smoother way to travel!
        </Text>
        <Text style={signOff}>
          Safe travels,
          <br />
          The SwiftVoyages Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          You received this email because you signed up for the SwiftVoyages waitlist.
          If you believe this is a mistake, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

SwiftVoyagesEmail.PreviewProps = {
  userFirstname: "Traveler",
} as EmailProps;

export default SwiftVoyagesEmail;

const main = {
  background: "linear-gradient(135deg, #00C6FB 0%, #005BEA 100%)",
  fontFamily: 'figtree, "Helvetica Neue", Helvetica, Arial, sans-serif',
  padding: "40px 0",
  color: "#cccccc",
};

const container = {
  margin: "0 auto",
  padding: "24px 32px 48px",
  backgroundColor: "#1a1a1a",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const logo = {
  margin: "0 auto",
  paddingBottom: "20px",
};

const greeting = {
  fontSize: "18px",
  lineHeight: "28px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  marginBottom: "20px",
};

const link = {
  color: "#00C6FB",
  textDecoration: "underline",
};

const signOff = {
  fontSize: "16px",
  lineHeight: "26px",
  marginTop: "20px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8c8c8c",
  fontSize: "12px",
};