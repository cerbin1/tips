import { useRouteError } from "react-router";
import Header from "../header/Header";

export default function ErrorPage() {
  const error = useRouteError();
  let title = "Wystąpił błąd!";
  let message = "Coś poszło nie tak.";
  console.log(error);
  if (error.status === 500) {
    message = JSON.parse(error.data).message;
  }
  console.log(error);
  console.log(error.status);

  console.log(error.status === 404);
  if (error.status === 404) {
    title = "Nie znaleziono!";
    message = "Nie ma takiej strony.";
  }
  return (
    <>
      <Header />
      <h2>{title}</h2>
      <p>{message}</p>
    </>
  );
}
