import { useRouteError } from "react-router";
import Header from "../header/Header";
import ContainerSection from "./ContainerSection";

export default function ErrorPage() {
  const error = useRouteError();
  let title = "Wystąpił błąd!";
  let message = "Coś poszło nie tak.";
  console.log(error);
  if (error.status === 500) {
    message = JSON.parse(error.data).message;
  }
  if (error.status === 404) {
    title = "Nie znaleziono!";
    message = "Nie ma takiej strony.";
  }
  return (
    <>
      <Header />
      <ContainerSection>
        <div className="text-red-600">
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
      </ContainerSection>
    </>
  );
}
