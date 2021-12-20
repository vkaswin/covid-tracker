import React from "react";

import styles from "./Radio.module.scss";

export const Radio = ({
  id,
  label,
  name,
  checked,
  onChange,
  color,
  value = "",
  disabled = false,
}) => {
  return (
    <div className={styles.custom_radio_wrapper}>
      <div style={{ "--radio-color": color }}>
        <input
          className={styles.custom_radio}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
