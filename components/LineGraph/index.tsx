import { Button } from "@rneui/themed";
import React, { useCallback, useState } from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import MonthPicker from "react-native-month-year-picker";
import { LinearGradient } from "react-native-linear-gradient";

export const LineGraph: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [selector, setSelector] = useState(false);
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [days, setDays] = useState(new Date(year, month + 1, 0).getDate());
  const [spending, setSpending] = useState(
    Array.from({ length: days }, () => 0)
  );
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const new_date = useCallback(
    (event: any, newDate: Date) => {
      const input = newDate || date;
      setSelector(false);
      setDate(input);
      const newMonth = input.getMonth();
      const newYear = input.getFullYear();
      setMonth(newMonth);
      setYear(newYear);
      setDays(new Date(newYear, newMonth + 1, 0).getDate());
    },
    [date]
  );

  const data = {
    labels: Array.from({ length: days }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        data: Array.from({ length: days }, () => Math.random() * 1000),
      },
    ],
  };
  return (
    <>
      <Button
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ["#6c7869", "#A9D2AA"],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        title={monthNames[month] + " " + year.toString()}
        titleStyle={{ color: "white", fontWeight: "bold" }}
        onPress={() => setSelector(true)}
        buttonStyle={{
          borderRadius: 12,
          marginHorizontal: 1,
        }}
      />
      {selector && (
        <MonthPicker
          onChange={new_date}
          value={date}
          maximumDate={new Date(3000, 11)}
          minimumDate={new Date(1900, 0)}
        />
      )}
      <LineChart
        data={data}
        width={Dimensions.get("window").width} // from react-native
        height={320}
        fromZero={false}
        yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#6c7869",
          backgroundGradientFrom: "#6c7869",
          backgroundGradientTo: "#A9D2AA",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },

          propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: "white",
          },
        }}
        style={{
          margin: 1,
          borderRadius: 12,
        }}
        formatXLabel={(value) => {
          const index = data.labels.indexOf(value) + 1;
          return index == 1 || index % 5 === 0 ? value : "";
        }}
      />
    </>
  );
};
