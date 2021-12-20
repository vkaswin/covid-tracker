import React, { Fragment, useEffect, useMemo, useState } from "react";
import { StateCard } from "components/StateCard";
import { SearchInput } from "components/SearchInput";
import { SortButton } from "components/SortButton";
import { Loader } from "components/Loader";
import { DateInput } from "components/DateInput";
import { useLocation, useNavigate } from "react-router-dom";
import { debounce } from "helpers";
import { stateCode } from "helpers";
import { useLocalStorage } from "hooks";
import { getAllList, getListByDate } from "service/api";

import styles from "./AllState.module.scss";

const AllState = () => {
  const { search } = useLocation();

  const { getItem, setItem } = useLocalStorage();

  const navigate = useNavigate();

  const [stateList, setStateList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchValue, setSearchValue] = useState();

  const [sortValue, setSortValue] = useState();

  const [selectValue, setSelectValue] = useState();

  const [dateWiseList, setDateWiseList] = useState();

  const [dates, setDates] = useState("");

  const q = new URLSearchParams(search).get("q");

  useEffect(() => {
    getStateList();
  }, []);

  useEffect(() => {
    setSearchValue(q ?? "");
  }, [search]);

  const getStateList = async () => {
    try {
      let { data } = await getAllList();
      let { data: dateList } = await getListByDate();
      let stateData = Object.entries(data)
        .map(([code, count]) => {
          return { state: stateCode[code] ?? code, count };
        })
        .sort((a, b) => {
          return a.state.localeCompare(b.state);
        });
      setDateWiseList(dateList);
      setStateList(stateData);
      let sort = getItem("sortList") ?? "";
      let date = getItem("listDate") ?? "";
      date !== "" && sort === "" && sortByDate(date, false, dateList);
      sort !== "" && date === "" && sortByFilter(false, sort, stateData, date);
      date !== "" && sort !== "" && sortByDate(date, true, sort, dateList);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const sortByDate = (
    date,
    isSortByFilter = false,
    sort,
    list = dateWiseList
  ) => {
    let stateByDates = Object.entries(list).map(([code, { dates }]) => {
      return {
        state: stateCode[code] ?? code,
        count: dates[date] ?? {},
      };
    });
    isSortByFilter && sortByFilter(false, sort, stateByDates, date);
    setStateList(stateByDates);
    setDates(date);
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    let search = String(value).trim();
    navigate(search.length === 0 ? `/covid/list` : `/covid/list?q=${value}`);
  };

  const handleSort = (event) => {
    const { value } = event.target;
    setItem({ key: "sortList", value });
    sortByFilter(false, value);
  };

  const sortByFilter = (
    isSelectChange = false,
    value,
    stateData = stateList,
    date = dates
  ) => {
    let dropdown = getItem("dropdown") ?? [];
    let type = parseInt(String(value).split("-")[1]);
    let key = String(value).split("-")[0];
    let sortData = undefined;
    if (key === "confirmed") {
      sortData = stateData.sort((a, b) => {
        let districtA = dropdown.find((list) => {
          return (
            list.state === a.state && !Object.keys(stateCode).includes(a.state)
          );
        });
        let districtB = dropdown.find((list) => {
          return (
            list.state === b.state && !Object.keys(stateCode).includes(b.state)
          );
        });
        return type === 0
          ? (typeof districtA === "object" && date === ""
              ? a.count?.districts[districtA?.value]?.total?.confirmed ?? 0
              : a.count?.total?.confirmed ?? 0) -
              (typeof districtB === "object" && date === ""
                ? b.count?.districts[districtB?.value]?.total?.confirmed ?? 0
                : b.count?.total?.confirmed ?? 0)
          : (typeof districtB === "object" && date === ""
              ? b.count?.districts[districtB?.value]?.total?.confirmed ?? 0
              : b.count?.total?.confirmed ?? 0) -
              (typeof districtA === "object" && date === ""
                ? a.count?.districts[districtA?.value]?.total?.confirmed ?? 0
                : a.count?.total?.confirmed ?? 0);
      });
    } else if (key === "vaccinated" && dates === "") {
      sortData = stateData.sort((a, b) => {
        let districtA = dropdown.find((list) => {
          return (
            list.state === a.state && !Object.keys(stateCode).includes(a.state)
          );
        });
        let districtB = dropdown.find((list) => {
          return (
            list.state === b.state && !Object.keys(stateCode).includes(a.state)
          );
        });
        let vaccinatedA =
          typeof districtA === "object"
            ? ((a.count?.districts[districtA?.value]?.total?.vaccinated1 ?? 0) +
                (a.count?.districts[districtA?.value]?.total?.vaccinated2 ??
                  0)) /
              2
            : ((a.count?.total?.vaccinated1 ?? 0) +
                (a.count?.total?.vaccinated2 ?? 0)) /
              2;
        let populationA =
          typeof districtA === "object"
            ? a.count?.districts[districtA.value]?.meta?.population ?? 0
            : a.count?.meta?.population ?? 0;
        let percentA = (vaccinatedA / populationA) * 100;
        let vaccinatedB =
          typeof districtB === "object"
            ? ((b.count?.districts[districtB?.value]?.total?.vaccinated1 ?? 0) +
                (b.count?.districts[districtB?.value]?.total?.vaccinated2 ??
                  0)) /
              2
            : ((b.count?.total?.vaccinated1 ?? 0) +
                (b.count?.total?.vaccinated2 ?? 0)) /
              2;
        let populationB =
          typeof districtB === "object"
            ? b.count?.districts[districtB.value]?.meta?.population ?? 0
            : b.count?.meta?.population ?? 0;
        let percentB = (vaccinatedB / populationB) * 100;
        return type === 0 ? percentA - percentB : percentB - percentA;
      });
    } else if (key === "affected" && dates === "") {
      sortData = stateData.sort((a, b) => {
        let districtA = dropdown.find((list) => {
          return (
            list.state === a.state && !Object.keys(stateCode).includes(a.state)
          );
        });
        let districtB = dropdown.find((list) => {
          return (
            list.state === b.state && !Object.keys(stateCode).includes(a.state)
          );
        });
        let deceasedA =
          typeof districtA === "object"
            ? a.count?.districts[districtA?.value]?.total?.deceased ?? 0
            : a.count?.total?.deceased ?? 0;
        let populationA =
          typeof districtA === "object"
            ? a.count?.districts[districtA.value]?.meta?.population ?? 0
            : a.count?.meta?.population ?? 0;
        let percentA = (deceasedA / populationA) * 100;
        let deceasedB =
          typeof districtB === "object"
            ? b.count?.districts[districtB?.value]?.total?.deceased ?? 0
            : b.count?.total?.deceased ?? 0;
        let populationB =
          typeof districtB === "object"
            ? b.count?.districts[districtB.value]?.meta?.population ?? 0
            : b.count?.meta?.population ?? 0;
        let percentB = (deceasedB / populationB) * 100;
        console.log(percentA, a.state, percentB, b.state);
        return type === 0 ? percentA - percentB : percentB - percentA;
      });
    }
    setStateList(sortData);
    setSortValue(value);
    isSelectChange && setSelectValue(Math.random());
  };

  let searchQuery = String(searchValue).trim();

  const covidList = useMemo(() => {
    return searchQuery.length === 0
      ? stateList
      : stateList.filter(({ state }) => {
          return String(state)
            .toLowerCase()
            .includes(String(searchQuery).toLowerCase());
        });
  }, [searchValue, stateList, sortValue, selectValue, dates]);

  const handleDate = (event) => {
    const { value } = event.target;
    setItem({ key: "listDate", value });
    sortByDate(value, sortValue === "" ? false : true, sortValue);
  };

  if (stateList === null) return <Loader />;

  return (
    <Fragment>
      <div className={styles.list_filter}>
        <div className={styles.search_box}>
          <span>States</span>
          <SearchInput
            placeholder="Search by state name"
            value={searchValue}
            onChange={debounce(handleSearch, 500)}
          />
        </div>
        <DateInput value={dates} onChange={handleDate} />
        <SortButton
          onChange={handleSort}
          value={sortValue}
          showPercentageOption={dates === "" ? true : false}
        />
      </div>
      {loading ? (
        <Loader />
      ) : covidList.length > 0 ? (
        <div className={styles.covid_list_container}>
          {covidList.map(({ state, count }, index) => {
            let { districts, delta = {}, delta7 = {}, total = {} } = count;
            let districtOptions =
              typeof districts === "object"
                ? Object.keys(districts).map((list) => {
                    return list;
                  })
                : [];
            return (
              <StateCard
                key={index}
                state={state}
                districts={districts ?? {}}
                stateTotal={total}
                stateDelta7={delta7}
                stateDelta={delta}
                districtOptions={districtOptions}
                showDropDown={true}
                onChange={(e) => sortByFilter(e, sortValue)}
              />
            );
          })}
        </div>
      ) : (
        <div className="no-record">
          <b>Result Not Found</b>
        </div>
      )}
    </Fragment>
  );
};

export default AllState;
