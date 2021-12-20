import React from "react";

import styles from "./DateInput.module.scss";

export const DateInput = ({ value, onChange }) => {
  return (
    <input
      className={styles.date_field}
      type="date"
      value={value}
      max={new Date().toISOString().split("T")[0]}
      onChange={onChange}
    />
  );
};
