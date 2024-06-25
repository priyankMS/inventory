import { SizeType } from "antd/es/config-provider/SizeContext";

type PickerType = "week" | "date" | "month" | "quarter" | "year";
declare const DisableDates: readonly [
  "FUTURE",
  "PAST",
  `PAST-${number}`,
  string,
];
export type DisableDate = (typeof DisableDates)[number];

export interface FloatDatePickerProps {
  label?: string;
  value: string | dayjs.Dayjs | null;
  placeholder?: string;
  size?: SizeType;
  className?: string;
  onChange: (date: any) => void;
  name?: string;
  format?: string;
  picker?: PickerType;
  disabled?: boolean;
  allowClear?: boolean;
  error?: string;
  disableDates?: DisableDate;
}


