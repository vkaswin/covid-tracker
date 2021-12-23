import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "hooks";
import { Loader } from "components/Loader";
import { Pagination } from "components/Pagination";
import { SortButton } from "components/SortButton";
import { getAllList, getListByDate } from "service/api";
import { stateCode } from "helpers";

import styles from "./StateByDate.module.scss";
import { DateInput } from "components/DateInput";

const StateByDate = () => {
  const { state } = useParams();

  const { search, pathname } = useLocation();

  const navigate = useNavigate();

  const { getItem, setItem } = useLocalStorage();

  const [date, setDate] = useState("");

  const [stateList, setStateList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(1);

  const [sortValue, setSortValue] = useState();

  const [totalPopulation, setTotalPopulation] = useState();

  const head = [
    "S.No",
    "Date",
    "Confirmed",
    "Recovered",
    "Deceased",
    "Delta",
    "Delta7",
  ];

  const page = new URLSearchParams(search).get("page");

  useEffect(() => {
    let dates = getItem("date");
    getStateByDateList();
    setDate(dates ?? "");
  }, []);

  const getStateByDateList = async () => {
    try {
      let { data } = await getListByDate();
      let { data: allState } = await getAllList();
      let [
        ,
        {
          meta: { population = 0 },
        },
      ] = Object.entries(allState).find(([code]) => {
        return (stateCode[code] ?? code) === state;
      });
      let [, count] = Object.entries(data).find(([code]) => {
        return (stateCode[code] ?? code) === state;
      });
      let list = Object.entries(count.dates).map(([date, stats]) => {
        return { date, count: stats };
      });
      setStateList(list);
      setTotalPopulation(population ?? 0);
      setTotalPages(Math.ceil(list.length / 10));
      let sort = getItem("sortTable") ?? "";
      sort !== "" && sortByFilter(sort, list);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event) => {
    navigate(`${pathname}?page=${event}`);
  };

  const handleDate = (event) => {
    const { value } = event.target;
    setItem({ key: "date", value });
    setDate(value);
    if (page) {
      navigate(`${pathname}`);
    }
  };

  const handleSort = (event) => {
    const { value } = event.target;
    setItem({ key: "sortTable", value });
    sortByFilter(value);
  };

  const sortByFilter = (value, stateData = stateList) => {
    let type = parseInt(String(value).split("-")[1]);
    let key = String(value).split("-")[0];
    let sortData = undefined;
    if (key === "confirmed") {
      sortData = stateData.sort((a, b) => {
        return type === 0
          ? (a.count?.total?.confirmed ?? 0) - (b.count?.total?.confirmed ?? 0)
          : (b.count?.total?.confirmed ?? 0) - (a.count?.total?.confirmed ?? 0);
      });
    } else if (key === "vaccinated") {
      sortData = stateData.sort((a, b) => {
        let vaccinatedA =
          ((a.count?.total?.vaccinated1 ?? 0) +
            (a.count?.total?.vaccinated2 ?? 0)) /
          2;
        let percentA = (vaccinatedA / totalPopulation) * 100;
        let vaccinatedB =
          ((b.count?.total?.vaccinated1 ?? 0) +
            (b.count?.total?.vaccinated2 ?? 0)) /
          2;
        let percentB = (vaccinatedB / totalPopulation) * 100;
        return type === 0 ? percentA - percentB : percentB - percentA;
      });
    } else if (key === "affected") {
      sortData = stateData.sort((a, b) => {
        let deceasedA = a.count?.total?.deceased ?? 0;
        let percentA = (deceasedA / totalPopulation) * 100;
        let deceasedB = b.count?.total?.deceased ?? 0;
        let percentB = (deceasedB / totalPopulation) * 100;
        return type === 0 ? percentA - percentB : percentB - percentA;
      });
    }
    setStateList(sortData);
    setSortValue(value);
  };

  const dateList = useMemo(() => {
    return date === ""
      ? stateList.slice(((page ?? 1) - 1) * 10, (page ?? 1) * 10)
      : stateList.filter((list) => {
          return list.date === date;
        });
  }, [date, stateList, page, sortValue]);

  return (
    <Fragment>
      <div className={styles.detial_filter}>
        <h1>{state}</h1>
        <DateInput value={date} onChange={handleDate} />
        {date === "" && <SortButton onChange={handleSort} value={sortValue} />}
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className={styles.table_wrapper}>
          <table className={styles.date_table}>
            <thead>
              <tr>
                {head.map((list, index) => {
                  return <th key={index}>{list}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {dateList.length > 0 ? (
                dateList.map(
                  (
                    { date, count: { delta = {}, delta7 = {}, total = {} } },
                    index
                  ) => {
                    let { confirmed = 0, deceased = 0, recovered = 0 } = total;
                    return (
                      <tr key={index}>
                        <td>{((page ?? 1) - 1) * 10 + (index + 1)}</td>
                        <td>{date}</td>
                        <td>{confirmed}</td>
                        <td>{recovered}</td>
                        <td>{deceased}</td>
                        <td>
                          <span>Confirmed - {delta?.confirmed ?? 0}</span>
                          <span>Recovered - {delta?.recovered ?? 0}</span>
                          <span>Deceased - {delta?.deceased ?? 0}</span>
                        </td>
                        <td>
                          <span>Confirmed - {delta7?.confirmed ?? 0}</span>
                          <span>Recovered - {delta7?.recovered ?? 0}</span>
                          <span>Deceased - {delta7?.deceased ?? 0}</span>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                <tr>
                  <td colSpan="7">Results Not Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {totalPages > 1 && date === "" && (
        <div className={styles.pagination_box}>
          <Pagination
            activePage={page ?? 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Fragment>
  );
};

export default StateByDate;
