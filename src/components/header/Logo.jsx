import logo from "/logo.png";

export default function Logo() {
  return (
    <div className="flex gap-1">
      <span className="no-underline text-2xl font-bold text-blue-to-dark">
        Afterady
      </span>
      <img src={logo} alt="logo-bulb-icon" />
    </div>
  );
}
