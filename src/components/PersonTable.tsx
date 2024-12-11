import { Fragment, useEffect, useMemo, useState, useCallback } from "react";
import { formatBirthDateFromPersonalCode, truncateText } from "../utils";
import Loading from "./Loading";
import "../style/table.css";

interface Person {
  firstName: string;
  lastName: string;
  gender: string;
  image: {
    url: string;
    alt: string;
  };
  body: string;
  personalCode: number;
  phone: string;
}

const convertDateFormat = (dateStr: string) => {
  const [day, month, year] = dateStr.split(".");
  return `${year}-${month}-${day}`;
};

const formatGender = (gender: string) => (gender === "m" ? "Mees" : "Naine");

export default function PersonTable() {
  const [list, setList] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(list.length / itemsPerPage);

  const toggleRowExpansion = (index: number) => {
    setExpandedRow((prevExpandedRow) =>
      prevExpandedRow === index ? null : index
    );
  };

  const sortedList = useMemo(() => {
    if (sortConfig !== null) {
      return [...list].sort((a, b) => {
        const key = sortConfig.key as keyof Person;
        if (key === "personalCode") {
          const dateA = formatBirthDateFromPersonalCode(a.personalCode);
          const dateB = formatBirthDateFromPersonalCode(b.personalCode);

          const dA = new Date(convertDateFormat(dateA));
          const dB = new Date(convertDateFormat(dateB));

          if (isNaN(dA.getTime()) || isNaN(dB.getTime())) {
            console.error("Invalid date format", dateA, dateB);
            return 0; // Handle invalid dates
          }

          if (dA < dB) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (dA > dB) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }

        if (a[key] < b[key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return list;
  }, [list, sortConfig]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedList.slice(indexOfFirstItem, indexOfLastItem);
  }, [sortedList, currentPage, itemsPerPage]);

  const requestSort = (key: string) => {
    let direction: string | null = "ascending";
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === "ascending") {
        direction = "descending";
      } else if (sortConfig.direction === "descending") {
        direction = null; // No sorting
      }
    }
    setSortConfig(direction ? { key, direction } : null);
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: "16px", height: "16px" }}
        >
          <path
            fillRule="evenodd"
            d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return sortConfig.direction === "ascending" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: "16px", height: "16px" }}
      >
        <path
          fillRule="evenodd"
          d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: "16px", height: "16px" }}
      >
        <path
          fillRule="evenodd"
          d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const fetchList = useCallback(async () => {
    try {
      const response = await fetch("https://proovitoo.twn.ee/api/list");
      const data = await response.json();

      const filteredData = data.list.slice(0, 108).map(
        (person: {
          firstname: string;
          surname: string;
          sex: string;
          phone: string;
          personal_code: string;
          image: {
            small: string;
            alt: string;
          };
          body: string;
        }) => ({
          firstName: person.firstname,
          lastName: person.surname,
          gender: person.sex,
          personalCode: person.personal_code,
          phone: person.phone,
          image: {
            url: person.image.small,
            alt: person.image.alt,
          },
          body: person.body,
        })
      );

      setList(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Ensure loading state is updated
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    setExpandedRow(null);
  }, [currentPage, sortConfig]);

  const handleClick = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [currentPage]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages]);

  const getPaginationRange = () => {
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);

    let start = Math.max(currentPage - halfRange, 1);
    let end = Math.min(start + maxPagesToShow - 1, totalPages);

    if (end - start < maxPagesToShow - 1) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="container">
      <h1>NIMEKIRI</h1>

      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="table-header">
                    <div
                      onClick={() => requestSort("firstName")}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      Eesnimi {getSortIndicator("firstName")}
                    </div>
                  </th>
                  <th className="table-header">
                    <div
                      onClick={() => requestSort("lastName")}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      Perekonnanimi {getSortIndicator("lastName")}
                    </div>
                  </th>
                  <th className="table-header">
                    <div
                      onClick={() => requestSort("gender")}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      Sugu {getSortIndicator("gender")}
                    </div>
                  </th>
                  <th className="table-header">
                    <div
                      onClick={() => requestSort("personalCode")}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      Sünnikuupäev {getSortIndicator("personalCode")}
                    </div>
                  </th>
                  <th className="table-header">Telefon</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((person, index) => (
                  <Fragment key={index}>
                    <tr
                      key={index}
                      className="table-row"
                      onClick={() => toggleRowExpansion(index)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: expandedRow === index ? "white" : "",
                        color: expandedRow === index ? "black" : "",
                      }}
                    >
                      <td className="table-cell">{person?.firstName}</td>
                      <td className="table-cell">{person?.lastName}</td>
                      <td className="table-cell">
                        {formatGender(person?.gender)}
                      </td>
                      <td className="table-cell">
                        {person?.personalCode
                          ? formatBirthDateFromPersonalCode(person.personalCode)
                          : "N/A"}
                      </td>
                      <td className="table-cell">
                        {person?.phone.replace(/^\+372(?! )/, "+372 ")}
                      </td>
                    </tr>
                    {expandedRow === index && (
                      <tr className="tr-expanded">
                        <td colSpan={5} className="td-expanded">
                          <div className="expanded-content">
                            <img
                              src={person.image.url}
                              alt={`${person.firstName} ${person.lastName}`}
                              style={{ width: "200px", height: "200px" }}
                            />
                            <div
                              style={{
                                paddingLeft: "1rem",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: truncateText(person.body, 46),
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination noSelect">
            <svg
              onClick={handlePreviousPage}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4.5}
              stroke="currentColor"
              className="pagination-buttons left"
              style={{
                color: currentPage > 1 ? "white" : "#4a5568",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>

            {getPaginationRange().map((page) => (
              <div
                key={page}
                onClick={() => handleClick(page)}
                style={{
                  cursor: "pointer",
                }}
                className={`button ${
                  currentPage === page ? "button-active" : "button-inactive"
                }`}
              >
                {page}
              </div>
            ))}

            <svg
              onClick={handleNextPage}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={4.5}
              stroke="currentColor"
              className="pagination-buttons right"
              style={{
                color: currentPage < totalPages ? "white" : "#4a5568",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
