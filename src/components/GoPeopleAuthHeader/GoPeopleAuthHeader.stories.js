import React from "react";
import GoPeopleAuthHeader from "./index";
import { withKnobs, text, select } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";

export default {
  title: "GoPeopleAuthHeader",
  component: GoPeopleAuthHeader,
  decorators: [StoryRouter(), withKnobs],
};

const apiBaseUrl = text("API Base URL", "http://localhost:8080");

export const DefaultGoPeopleAuthHeader = () => {
  const appName = text("App Name", "tamtam");
  const language = select("Language", ["fr", "nl", "en"], "fr");

  return (
    <GoPeopleAuthHeader
      apiBaseUrl={apiBaseUrl}
      lng={language}
      app={{
        name: appName,
      }}
      onSuccess={(data) => {
        console.log("Authentication successful:", data);
      }}
      onError={(error) => {
        console.error("Authentication error:", error);
      }}
      onClose={() => {
        console.log("Modal closed");
      }}
    />
  );
};

export const GoPeopleAuthHeaderEnglish = () => (
  <GoPeopleAuthHeader
    apiBaseUrl={apiBaseUrl}
    lng="en"
    onSuccess={(data) => {
      console.log("Authentication successful:", data);
      alert(
        `Authentication successful! Token: ${data.token.substring(0, 20)}...`
      );
    }}
    onError={(error) => {
      console.error("Authentication error:", error);
    }}
  />
);

export const GoPeopleAuthHeaderDutch = () => (
  <GoPeopleAuthHeader
    apiBaseUrl={apiBaseUrl}
    lng="nl"
    onSuccess={(data) => {
      console.log("Authentication successful:", data);
      alert(
        `Authentication successful! Token: ${data.token.substring(0, 20)}...`
      );
    }}
    onError={(error) => {
      console.error("Authentication error:", error);
    }}
  />
);

export const GoPeopleAuthHeaderWithCustomAPI = () => (
  <GoPeopleAuthHeader
    apiBaseUrl={apiBaseUrl}
    lng="fr"
    onSuccess={(data) => {
      // Custom success handler - could store token in localStorage
      localStorage.setItem("authToken4555", data.token);
      console.log("Token stored in localStorage");
      alert("Authentication successful! Token stored.");
    }}
    onError={(error) => {
      console.error("Authentication error:", error);
      alert(`Authentication failed: ${error.message}`);
    }}
  />
);

export const GoPeopleAuthHeaderInHeaderContext = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
    }}
  >
    <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>My Application</div>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <span>Navigation</span>
      <GoPeopleAuthHeader
        apiBaseUrl={apiBaseUrl}
        lng="fr"
        onSuccess={(data) => {
          console.log("User authenticated in header:", data);
          alert("Welcome! You are now logged in.");
        }}
        onError={(error) => {
          console.error("Authentication error:", error);
        }}
      />
    </div>
  </div>
);

// Story to test different app_name values for OTP branding
export const WithDifferentAppBranding = () => {
  const appName = text("App Name for Branding", "ua");

  return (
    <GoPeopleAuthHeader
      apiBaseUrl={apiBaseUrl}
      lng="fr"
      app={{
        name: appName,
      }}
      onSuccess={(data) => {
        console.log("Authentication successful with custom branding:", data);
        alert(`Authentication successful with ${appName} branding!`);
      }}
      onError={(error) => {
        console.error("Authentication error:", error);
      }}
    />
  );
};

// Story to test different language values for OTP email content
export const WithDifferentLanguages = () => {
  const language = select("Email Content Language", ["fr", "en", "nl"], "en");

  return (
    <GoPeopleAuthHeader
      apiBaseUrl={apiBaseUrl}
      lng={language}
      app={{
        name: "tamtam",
      }}
      onSuccess={(data) => {
        console.log("Authentication successful:", data);
      }}
      onError={(error) => {
        console.error("Authentication error:", error);
      }}
    />
  );
};

// Comprehensive story combining all OTP parameters
export const OTPFlowWithCustomParameters = () => {
  const appName = text("App Name (for OTP logo)", "tamtam");
  const language = select(
    "Language (for UI & OTP email)",
    ["fr", "en", "nl"],
    "fr"
  );
  const apiBaseUrl = text("API Base URL", "https://peopleapi.tamtam.pro");

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Test OTP Flow with Custom Parameters</h2>
      <p>
        This story demonstrates how the OTP email will be customized based on
        app_name and language.
      </p>
      <ul>
        <li>
          <strong>app_name:</strong> Controls the logo branding in the OTP email
        </li>
        <li>
          <strong>language:</strong> Controls the email content language (fr,
          en, nl)
        </li>
      </ul>
      <GoPeopleAuthHeader
        apiBaseUrl={apiBaseUrl}
        lng={language}
        app={{
          name: appName,
        }}
        onSuccess={(data) => {
          console.log("Authentication successful:", data);
          alert("Authentication successful! Check console for details.");
        }}
        onError={(error) => {
          console.error("Authentication error:", error);
          alert(`Error: ${error.message}`);
        }}
        onClose={() => {
          console.log("Modal closed");
        }}
      />
    </div>
  );
};

// Story to test the set password flow after OTP verification
export const SetPasswordAfterOTP = () => (
  <GoPeopleAuthHeader
    apiBaseUrl="http://localhost:8080"
    lng="fr"
    onSuccess={(tokenData) => {
      console.log("Password set successfully:", tokenData);
      alert("Mot de passe défini avec succès !");
    }}
    onError={(error) => {
      console.error("Error:", error);
    }}
  />
);

// log in with an existing user without a password, then you should be prompted to set a new password after OTP verification
export const SetPasswordAfterReset = () => (
  <GoPeopleAuthHeader
    apiBaseUrl="http://localhost:8080"
    lng="fr"
    onSuccess={(tokenData) => {
      console.log("Password reset successfully:", tokenData);
    }}
    onError={(error) => {
      console.error("Error:", error);
    }}
  />
);

// Mocked backend for the "receive the code by email or SMS" flow (no GoPeople
// server needed). Use "Forgot?" or "Continue without password" with:
//   sms@example.com     → SMS offered (****61); the right number is 0470123461
//   nophone@example.com → no mobile: email only + "contact your admin" help line
//   old@example.com     → otp-channels returns 404 (older backend): email only
// After 5 wrong numbers, SMS requests get a 429 (the backend caps SMS requests per account per hour).
// Any 6-digit code is rejected by the mocked verify-otp.
const MOCK_API = "http://mock-gopeople.local";
const MOCK_PHONE_DIGITS = "0470123461";
let mockPhoneMismatches = 0;

const mockJson = (status, body) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );

const installOtpChannelFetchMock = () => {
  if (window.__otpChannelFetchMock) return;
  const realFetch = window.fetch.bind(window);
  window.__otpChannelFetchMock = true;
  window.fetch = (input, init = {}) => {
    const url = String(input instanceof Request ? input.url : input);
    if (!url.startsWith(MOCK_API)) return realFetch(input, init);
    const path = url.slice(MOCK_API.length).split("?")[0];
    const body = init.body ? JSON.parse(init.body) : {};
    console.log("[mock GoPeople]", path, { ...body, phone: undefined });

    if (path === "/auth/initiate")
      return Promise.resolve(new Response(null, { status: 202 }));
    if (path === "/auth/otp-channels") {
      if (body.identifier === "sms@example.com")
        return mockJson(200, { sms_available: true, masked_phone: "****61" });
      if (body.identifier === "old@example.com")
        return mockJson(404, { error: "not found" });
      return mockJson(200, { sms_available: false });
    }
    if (
      path === "/auth/request-reset" ||
      path === "/auth/login-with-otp/initiate"
    ) {
      if (body.channel === "sms") {
        if (body.identifier !== "sms@example.com")
          return mockJson(400, { error: "no mobile", type: "SMS_UNAVAILABLE" });
        if (mockPhoneMismatches >= 5)
          return mockJson(429, {
            error: "too many attempts",
            type: "TOO_MANY_REQUESTS",
          });
        const digits = String(body.phone || "").replace(/\D/g, "");
        if (!digits.endsWith(MOCK_PHONE_DIGITS.slice(1))) {
          mockPhoneMismatches += 1;
          return mockJson(400, {
            error: "phone mismatch",
            type: "PHONE_MISMATCH",
          });
        }
      }
      return mockJson(200, { status: "OTP_SENT", message: "OTP sent" });
    }
    if (path === "/auth/verify-otp")
      return mockJson(400, { error: "invalid code", type: "INVALID_OTP" });
    return mockJson(404, { error: "not mocked" });
  };
};

export const OTPChannelChoiceMocked = () => {
  installOtpChannelFetchMock();
  const language = select("Language", ["fr", "en", "nl"], "fr");
  return (
    <GoPeopleAuthHeader
      apiBaseUrl={MOCK_API}
      lng={language}
      onError={(error) => console.log("onError:", error.type, error)}
    />
  );
};
