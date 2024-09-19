import { useEffect, useState } from "react";
import { useAuth } from "../../store/auth-context";
import { getUserEmail } from "../../util/auth";
import ContainerSection from "../common/ContainerSection";
import Table from "../common/table/Table";
import TableBody from "../common/table/TableBody";
import TableHeader from "../common/table/TableHeader";
import RequestError from "../common/RequestError";
import Loader from "../common/Loader";
import TableRow from "../common/table/TableRow";
import TableData from "../common/table/TableData";
import TableDataLink from "../common/table/TableDataLink";
import {
  getUserRatedAdvicesUrl,
  getUserRatedSuggestedAdvicesUrl,
  getUserRatedSuggestedCategoriesUrl,
  getUserSuggestedAdvicesUrl,
  getUserSuggestedCategoriesUrl,
} from "../../util/endpoints";

export default function Profile() {
  const [votedAdvices, setVotedAdvices] = useState([]);
  const [votedAdvicesLoading, setVotedAdvicesLoading] = useState(false);
  const [votedAdvicesError, setVotedAdvicesError] = useState();
  const [votedSuggestedAdvices, setVotedSuggestedAdvices] = useState([]);
  const [votedSuggestedAdvicesLoading, setVotedSuggestedAdvicesLoading] =
    useState(false);
  const [votedSuggestedAdvicesError, setVotedSuggestedAdvicesError] =
    useState();
  const [suggestedAdvices, setSuggestedAdvices] = useState([]);
  const [suggestedAdvicesLoading, setSuggestedAdvicesLoading] = useState(false);
  const [suggestedAdvicesError, setSuggestedAdvicesError] = useState();
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [suggestedCategoriesLoading, setSuggestedCategoriesLoading] =
    useState(false);
  const [suggestedCategoriesError, setSuggestedCategoriesError] = useState();
  const [votedSuggestedCategories, setVotedSuggestedCategories] = useState([]);
  const [votedSuggestedCategoriesLoading, setVotedSuggestedCategoriesLoading] =
    useState(false);
  const [votedSuggestedCategoriesError, setVotedSuggestedCategoriesError] =
    useState();
  const { token } = useAuth();

  useEffect(() => {
    async function fetchUserVotedAdvices() {
      setVotedAdvicesLoading(true);
      try {
        const response = await fetch(getUserRatedAdvicesUrl(getUserEmail()));
        if (response.ok) {
          const responseData = await response.json();
          setVotedAdvices(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setVotedAdvicesError("Nie udało się pobrać ocenionych porad!");
      }
      setVotedAdvicesLoading(false);
    }
    fetchUserVotedAdvices();
  }, []);

  useEffect(() => {
    async function fetchUserVotedSuggestedAdvices() {
      setVotedSuggestedAdvicesLoading(true);
      try {
        const response = await fetch(
          getUserRatedSuggestedAdvicesUrl(getUserEmail())
        );
        if (response.ok) {
          const responseData = await response.json();
          setVotedSuggestedAdvices(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setVotedSuggestedAdvicesError(
          "Nie udało się pobrać ocenionych proponowanych porad!"
        );
      }
      setVotedSuggestedAdvicesLoading(false);
    }
    fetchUserVotedSuggestedAdvices();
  }, []);

  useEffect(() => {
    async function fetchUserSuggestedAdvices() {
      setSuggestedAdvicesLoading(true);
      try {
        const response = await fetch(getUserSuggestedAdvicesUrl(), {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setSuggestedAdvices(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setSuggestedAdvicesError("Nie udało się pobrać proponowanych porad!");
      }
      setSuggestedAdvicesLoading(false);
    }
    fetchUserSuggestedAdvices();
  }, []);

  useEffect(() => {
    async function fetchUserSuggestedCategories() {
      setSuggestedCategoriesLoading(true);
      try {
        const response = await fetch(getUserSuggestedCategoriesUrl(), {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const responseData = await response.json();
          setSuggestedCategories(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setSuggestedCategoriesError(
          "Nie udało się pobrać proponowanych kategorii!"
        );
      }
      setSuggestedCategoriesLoading(false);
    }
    fetchUserSuggestedCategories();
  }, []);

  useEffect(() => {
    async function fetchUserVotedSuggestedCategories() {
      setVotedSuggestedCategoriesLoading(true);
      try {
        const response = await fetch(
          getUserRatedSuggestedCategoriesUrl(getUserEmail())
        );
        if (response.ok) {
          const responseData = await response.json();
          setVotedSuggestedCategories(responseData);
        } else {
          throw new Error();
        }
      } catch (error) {
        setVotedSuggestedCategoriesError(
          "Nie udało się pobrać ocenionych proponowanych kategorii!"
        );
      }
      setVotedSuggestedCategoriesLoading(false);
    }
    fetchUserVotedSuggestedCategories();
  }, []);

  const votedAdvicesTableHeaders = ["Nazwa", "Kategoria", "Szczegóły"];
  const votedAdvicesTableRows = votedAdvices.map((advice) => (
    <TableRow key={advice.name}>
      <TableData>{advice.name}</TableData>
      <TableData>{advice.categoryDisplayName}</TableData>
      <TableDataLink href={"/advices/" + advice.id}>
        Wyświetl szczegóły
      </TableDataLink>
    </TableRow>
  ));

  const votedSuggestedAdvicesTableHeaders = [
    "Nazwa",
    "Kategoria",
    "Ocena",
    "Szczegóły",
  ];
  const votedSuggestedAdvicesTableRows = votedSuggestedAdvices.map((advice) => (
    <TableRow key={advice.name}>
      <TableData>{advice.name}</TableData>
      <TableData>{advice.categoryDisplayName}</TableData>
      <TableData>{advice.rating}</TableData>
      <TableDataLink href={"/advices/suggested/" + advice.id}>
        Wyświetl szczegóły
      </TableDataLink>
    </TableRow>
  ));

  const suggestedAdvicesTableHeaders = ["Nazwa", "Kategoria"];
  const suggestedAdvicesTableRows = suggestedAdvices.map((advice) => (
    <TableRow key={advice.id}>
      <TableData>{advice.name}</TableData>
      <TableData>{advice.category.displayName}</TableData>
    </TableRow>
  ));

  const suggestedCategoriesTableHeaders = ["Nazwa"];
  const suggestedCategoriesTableRows = suggestedCategories.map((category) => (
    <TableRow key={category.id}>
      <TableData>{category.name}</TableData>
    </TableRow>
  ));

  const votedSuggestedCategoriesTableHeaders = ["Nazwa", "Ocena"];
  const votedSuggestedCategoriesTableRows = votedSuggestedCategories.map(
    (category) => (
      <TableRow key={category.id}>
        <TableData>{category.name}</TableData>
        <TableData>{category.rating}</TableData>
      </TableRow>
    )
  );

  return (
    <ContainerSection data-testid="profile-section">
      <h1>Profil</h1>
      {!votedAdvicesError &&
        !votedAdvicesLoading &&
        votedAdvices &&
        votedAdvices.length === 0 && (
          <p className="py-3">Nie oceniłeś jeszcze żadnej porady.</p>
        )}
      {!votedAdvicesError && votedAdvices && votedAdvices.length > 0 && (
        <>
          <Table
            title="Ocenione porady:"
            head={<TableHeader headers={votedAdvicesTableHeaders} />}
            body={<TableBody rows={votedAdvicesTableRows} />}
          />
        </>
      )}
      {votedAdvicesLoading && <Loader />}
      <RequestError content={votedAdvicesError} />

      {!votedSuggestedAdvicesError &&
        !votedSuggestedAdvicesLoading &&
        votedSuggestedAdvices &&
        votedSuggestedAdvices.length === 0 && (
          <p className="py-3">
            Nie oceniłeś jeszcze żadnej proponowanej porady.
          </p>
        )}
      {!votedSuggestedAdvicesError &&
        votedSuggestedAdvices &&
        votedSuggestedAdvices.length > 0 && (
          <>
            <Table
              title="Ocenione proponowane porady:"
              head={<TableHeader headers={votedSuggestedAdvicesTableHeaders} />}
              body={<TableBody rows={votedSuggestedAdvicesTableRows} />}
            />
          </>
        )}
      {votedSuggestedAdvicesLoading && <Loader />}
      <RequestError content={votedSuggestedAdvicesError} />

      {!suggestedAdvicesError &&
        !suggestedAdvicesLoading &&
        suggestedAdvices &&
        suggestedAdvices.length === 0 && (
          <p className="py-3">Nie zaproponowałeś jeszcze żadnej porady.</p>
        )}
      {!suggestedAdvicesError &&
        suggestedAdvices &&
        suggestedAdvices.length > 0 && (
          <>
            <Table
              title="Proponowane porady:"
              head={<TableHeader headers={suggestedAdvicesTableHeaders} />}
              body={<TableBody rows={suggestedAdvicesTableRows} />}
            />
          </>
        )}
      {suggestedAdvicesLoading && <Loader />}
      <RequestError content={suggestedAdvicesError} />

      {!suggestedCategoriesError &&
        !suggestedCategoriesLoading &&
        suggestedCategories &&
        suggestedCategories.length === 0 && (
          <p className="py-3">Nie zaproponowałeś jeszcze żadnej kategorii.</p>
        )}
      {!suggestedCategoriesError &&
        suggestedCategories &&
        suggestedCategories.length > 0 && (
          <>
            <Table
              title="Proponowane kategorie:"
              head={<TableHeader headers={suggestedCategoriesTableHeaders} />}
              body={<TableBody rows={suggestedCategoriesTableRows} />}
            />
          </>
        )}
      {suggestedCategoriesLoading && <Loader />}
      <RequestError content={suggestedCategoriesError} />

      {!votedSuggestedCategoriesError &&
        !votedSuggestedCategoriesLoading &&
        votedSuggestedCategories &&
        votedSuggestedCategories.length === 0 && (
          <p className="py-3">
            Nie oceniłeś jeszcze żadnej proponowanej kategorii.
          </p>
        )}
      {!votedSuggestedCategoriesError &&
        votedSuggestedCategories &&
        votedSuggestedCategories.length > 0 && (
          <>
            <Table
              title="Ocenione proponowane kategorie:"
              head={
                <TableHeader headers={votedSuggestedCategoriesTableHeaders} />
              }
              body={<TableBody rows={votedSuggestedCategoriesTableRows} />}
            />
          </>
        )}
      {votedSuggestedCategoriesLoading && <Loader />}
      <RequestError content={votedSuggestedCategoriesError} />
    </ContainerSection>
  );
}
