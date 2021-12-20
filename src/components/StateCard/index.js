import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "hooks";

import styles from "./StateCard.module.scss";
import { StatsCard } from "./StatsCard";

export const StateCard = ({
  state,
  districts,
  districtOptions,
  stateTotal,
  stateDelta,
  stateDelta7,
  onChange,
  showDropDown,
}) => {
  const { getItem, setItem } = useLocalStorage();

  const navigate = useNavigate();

  const cardRef = useRef();

  const [activeIndex, setActiveIndex] = useState(0);

  let [value, setValue] = useState("");

  useEffect(() => {
    let dropDown = getItem("dropdown");
    if (dropDown) {
      let dropDownValue = dropDown.find((list) => {
        return list.state === state;
      });
      if (dropDownValue) {
        setValue(dropDownValue.value);
      }
    }
  }, [state]);

  const handleDropDown = ({ target: { value } }) => {
    let dropDown = getItem("dropdown");
    if (dropDown) {
      let isExist = dropDown.find((list) => {
        return list.state === state;
      });
      if (isExist) {
        let index = dropDown.findIndex((list) => {
          return list.state === state;
        });
        dropDown[index].value = value;
      } else {
        dropDown.push({ state, value });
      }
      setItem({ key: "dropdown", value: dropDown });
    } else {
      let arr = [];
      arr.push({ state, value });
      setItem({ key: "dropdown", value: arr });
    }
    setValue(value);
    getItem("sortList") && onChange(true);
  };

  const handleSlide = (isNext) => {
    cardRef.current?.children[
      isNext ? activeIndex + 1 : activeIndex - 1
    ].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    setActiveIndex(isNext ? activeIndex + 1 : activeIndex - 1);
  };

  const isDistrict = useMemo(() => {
    let dropDown = getItem("dropdown");
    if (dropDown) {
      let dropDownValue = dropDown.find((list) => {
        return list.state === state;
      });
      return dropDownValue ? true : false;
    }
  }, [value]);

  return (
    <div
      className={styles.state_card}
      onClick={() => navigate(`/covid/state/${state}`)}
    >
      <div className={styles.card_head}>
        <b>{state}</b>
        {districtOptions.length > 0 && showDropDown && (
          <select
            value={value}
            onChange={handleDropDown}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="" disabled>
              Select District
            </option>
            {districtOptions.map((list, index) => {
              return (
                <option key={index} value={list}>
                  {list}
                </option>
              );
            })}
          </select>
        )}
      </div>
      <div className={styles.stats_container}>
        <div
          className={styles.prev_arrow}
          onClick={(e) => {
            e.stopPropagation();
            handleSlide(false);
          }}
          aria-hidden={activeIndex === 0 ? true : false}
        >
          <i className="fas fa-chevron-left"></i>
        </div>
        <div ref={cardRef} className={styles.stats_wrapper}>
          <StatsCard
            title="Total"
            count={isDistrict ? districts[value]?.total ?? {} : stateTotal}
          />
          <StatsCard
            title="Delta"
            count={isDistrict ? districts[value]?.delta ?? {} : stateDelta}
          />
          <StatsCard
            title="Delta7"
            count={isDistrict ? districts[value]?.delta7 ?? {} : stateDelta7}
          />
        </div>
        <div
          className={styles.next_arrow}
          onClick={(e) => {
            e.stopPropagation();
            handleSlide(true);
          }}
          aria-hidden={activeIndex === 2 ? true : false}
        >
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>
    </div>
  );
};
