import React, { useCallback, useState } from "react";
import { DatePicker, Row } from "antd";
import dayjs from "dayjs";
import "./DateCalender.scss";
import Icon from "@ant-design/icons/lib/components/Icon";

import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { FloatDatePickerProps } from "../../interface/Dates";
import { MdDateRange } from "react-icons/md";

const FloatDatePicker: React.FC<FloatDatePickerProps> = (props) => {
  const {
    name,
    label,
    value,
    placeholder,
    disableDates,
    size = "large",
    picker = "date",
    format = "MM/DD/YYYY",
    allowClear = false,
  } = props;
  const [labelFloating, setLabelFloating] = useState(false);

  const handleFocus = useCallback(() => {
    setLabelFloating(true);
  }, []);

  const handleBlur = useCallback((e: any) => {
    if (!e.target.value) {
      setLabelFloating(false);
    }
  }, []);

  const disabledDate: RangePickerProps["disabledDate"] = useCallback(
    (current: dayjs.Dayjs) => {
      // Disable the future dates and dates before the provided date
      if (disableDates && dayjs(disableDates).isValid()) {
        return (
          current &&
          (current < dayjs(disableDates).startOf("day") ||
            current > dayjs().endOf("day"))
        );
      }
      // Can not select days after today
      if (disableDates === "FUTURE")
        return current && current > dayjs().endOf("day");

      // Can not select days before today
      if (disableDates === "PAST")
        return current && current < dayjs().startOf("day");

      if (disableDates === "PAST-FUTURE14") {
        const today = dayjs().startOf("day");
        const fourteenDaysFromNow = dayjs().add(14, "days").endOf("day");
        return current && (current < today || current > fourteenDaysFromNow);
      }

      // Can not select days before today - X days
      if (disableDates?.startsWith("PAST-")) {
        const days = parseInt(disableDates.split("-")[1], 10);
        const pastDateLimit = dayjs().subtract(days, "day").startOf("day");
        return current && current < pastDateLimit;
      }
      return false;
    },
    [disableDates],
  );

  const handleChange: DatePickerProps["onChange"] = useCallback(
    (date: dayjs.Dayjs | any) => {
      const utcDate = date ? date.toISOString() : "";

      props?.onChange(utcDate);
    },
    [props],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === "Backspace") {
        handleChange(null, "");
        return;
      }

      if (event.target instanceof HTMLInputElement) {
        let value = event.target.value;
        value = value.replace(/[^0-9/]/g, "");

        const dateParts = value.split("/");
        if (dateParts.length > 0) {
          dateParts[0] = dateParts[0].slice(0, 2);
          if (parseInt(dateParts[0]) > 12) dateParts[0] = "12";
        }
        if (format === "MM/DD/YYYY" && dateParts.length > 1) {
          dateParts[1] = dateParts[1].slice(0, 2);
          if (parseInt(dateParts[1]) > 31) dateParts[1] = "31";
        }

        value = dateParts.join("/");

        if (format === "MM/YY" && value.length > 4) {
          value = value.slice(0, 4);
          event.target.value = value;
        }

        if (
          value.length === 2 ||
          (format === "MM/DD/YYYY" && value.length === 5)
        ) {
          event.target.value = value + "/";
        }

        if (format !== "MM/DD/YYYY" && value.length > 6) {
          value = value.slice(0, 6);
          event.target.value = value;
        } else if (format === "MM/DD/YYYY" && value.length > 9) {
          value = value.slice(0, 9);
          event.target.value = value;
        }
      }
    },
    [format, handleChange],
  );
  return (
    <Row gutter={[8, 8]} className="float-input-light">
      <Row className="floating-label">
        <DatePicker
          placement="bottomRight"
          className={`floating-input ${props?.error ? "error-border" : ""} `}
          value={dayjs(value).isValid() ? dayjs(value) : null}
          name={name}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          size="large"
          
          picker={picker}
          format={format}
          placeholder={labelFloating ? placeholder : ""}
          suffixIcon={
            <Icon
              component={allowClear && value ? undefined : MdDateRange}
              className={
                props?.error ? "text-error-red" : "text-sec-text-color"
              }
            />
          }
          disabledDate={disabledDate}
          allowClear={allowClear}
          bordered={false}
          disabled={props.disabled}
          changeOnBlur
          onKeyDown={onKeyDown}
        />
        {props.error && <Row className="error">{props.error}</Row>}

        <label
          className={`label ${props?.error ? "error-label" : ""} ${
            labelFloating || value ? "floating" : ""
          }`}
        >
          {label}
        </label>
      </Row>
    </Row>
  );
};

export default React.memo(FloatDatePicker);