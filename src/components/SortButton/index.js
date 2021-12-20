import React, { useRef, useState, Fragment } from "react";
import { Radio } from "components/Radio";
import { useOnClickOutSide } from "hooks";

import styles from "./SortButton.module.scss";

export const SortButton = ({
  onChange,
  value,
  showPercentageOption = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortRef = useRef();

  useOnClickOutSide(sortRef, () => setIsOpen(false));

  return (
    <div
      className={styles.sort_btn}
      ref={sortRef}
      aria-hidden={isOpen ? true : false}
    >
      <button onClick={() => setIsOpen(true)}>Sort By</button>
      <div className={styles.sort_dropdown}>
        <div>
          <div>
            <label className={styles.dropdown_title}>Confirmed Count</label>
          </div>
          <div>
            <Radio
              id="confirmed-ascending"
              label="Ascending"
              color="#766ceb"
              name="sort"
              value="confirmed-0"
              checked={value === "confirmed-0" ? true : false}
              onChange={onChange}
            />
            <Radio
              id="confirmed-decending"
              label="Decending"
              color="#766ceb"
              name="sort"
              value="confirmed-1"
              checked={value === "confirmed-1" ? true : false}
              onChange={onChange}
            />
          </div>
        </div>
        {showPercentageOption && (
          <Fragment>
            <div>
              <div>
                <label className={styles.dropdown_title}>
                  Affected Percentage
                </label>
              </div>
              <div>
                <Radio
                  id="affected-ascending"
                  label="Ascending"
                  color="#766ceb"
                  name="sort"
                  value="affected-0"
                  checked={value === "affected-0" ? true : false}
                  onChange={onChange}
                />
                <Radio
                  id="affected decending"
                  label="Decending"
                  color="#766ceb"
                  name="sort"
                  value="affected-1"
                  checked={value === "affected-1" ? true : false}
                  onChange={onChange}
                />
              </div>
            </div>
            <div>
              <div>
                <label className={styles.dropdown_title}>
                  Vaccinated Percentage
                </label>
              </div>
              <div>
                <Radio
                  id="vaccinated-ascending"
                  label="Ascending"
                  color="#766ceb"
                  name="sort"
                  value="vaccinated-0"
                  checked={value === "vaccinated-0" ? true : false}
                  onChange={onChange}
                />
                <Radio
                  id="vaccinated-deceding"
                  label="Decending"
                  color="#766ceb"
                  name="sort"
                  value="vaccinated-1"
                  checked={value === "vaccinated-1" ? true : false}
                  onChange={onChange}
                />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};
