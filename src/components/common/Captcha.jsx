import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function Captcha({ onCaptchaChange }) {
  return (
    <div data-testid="captcha">
      <HCaptcha
        sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
        onVerify={onCaptchaChange}
      />
    </div>
  );
}
