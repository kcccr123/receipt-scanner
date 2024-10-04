import { Button } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import MonthPicker from "react-native-month-year-picker";
import { LinearGradient } from "react-native-linear-gradient";
import { GroupType, LineDataPoints } from "@/app/(tabs)/types";
import { searchGroups } from "@/app/database/groups";
import { connectToDb } from "@/app/database/db";

export const LineGraph: React.FC <{refreshOn:GroupType[]; date: Date; setDate: React.Dispatch<React.SetStateAction<Date>>;}> = ({setDate, date, refreshOn}) => {
  const [selector, setSelector] = useState(false);
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [days, setDays] = useState(new Date(year, month + 1, 0).getDate());
  const [spending, setSpending] = useState(
    Array.from({ length: days }, () => 0)
  );

  console.log(date)
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
        console.log("here")
    setSelector(false);
      if(newDate){
        console.log("inside")
        const input = newDate;
        setDate(input);
        const newMonth = input.getMonth();
        const newYear = input.getFullYear();
        const newdays = new Date(newYear, newMonth + 1, 0).getDate();
        setMonth(newMonth);
        setYear(newYear);
        setDays(newdays);
      }
    },
    [setDate]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await connectToDb();
        const points = await searchGroups(db, month + 1, year);
        setSpending(date2points(points, days));
      } catch (error) {
        console.error("Failed to fetch group data:", error);
      }
    };

    fetchData();
  }, [refreshOn, month]);

  const date2points = (input:LineDataPoints[], length:number) => {
    const yvalues = Array.from({ length: length }, (_, i) => 0);
    for (let i = 0; i <input.length; i++){
        yvalues[input[i].date.getUTCDate()-1] += input[i].amount;
    }
    return yvalues
  }

  const data = {
    labels: Array.from({ length: days }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        data: spending,
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
        titleStyle={{ fontFamily:"monospace", color: "white", fontWeight: "bold", fontSize: 19}}
        onPress={() => setSelector(true)}
        buttonStyle={{
          borderRadius: 15,
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
        height={250}
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
            borderRadius:5,
          },

          propsForDots: {
            r: "3",
            strokeWidth: "2",
            stroke: "white",
          },
        }}
        style={{
          margin: 1,
          borderRadius: 15,
        }}
        formatXLabel={(value) => {
          const index = data.labels.indexOf(value) + 1;
          return index == 1 || index % 5 === 0 ? value : "";
        }}
      />
    </>
  );
};
