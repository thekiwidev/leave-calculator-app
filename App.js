import React, { useState } from "react";
import { View, Text, Button, TextInput, SafeAreaView } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { addBusinessDays, isWeekend, isSameDay } from "date-fns";
import Header from "./components/Header";

const publicHolidays = [
  new Date("2023-12-25"), // Example public holiday 1
  new Date("2023-12-31"), // Example public holiday 2
  new Date("2023-05-15"), // Example public holiday 3
  new Date("2023-05-29"), // Example public holiday 3
  // Add more public holidays as needed
];

export default function App() {
  const [commencementDate, setCommencementDate] = useState(new Date());
  const [leaveEntitlement, setLeaveEntitlement] = useState("");
  const [resumptionDate, setResumptionDate] = useState(null);

  const isPublicHoliday = (date, holidays) => {
    return holidays.some((holiday) => isSameDay(holiday, date));
  };

  const calculateResumptionDate = () => {
    let count = 0;
    let currentDate = commencementDate;

    while (count < leaveEntitlement) {
      currentDate = addBusinessDays(currentDate, 1);

      if (
        !isWeekend(currentDate) &&
        !isPublicHoliday(currentDate, publicHolidays)
      ) {
        count++;
      }
    }

    setResumptionDate(currentDate);
  };

  // ! DATE PICKER
  const onChange = (event, selectedDate) => {
    setCommencementDate(selectedDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: commencementDate,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <SafeAreaView className="flex-1 pt-5 bg-emerald-400">
      <Header />
      <View className="flex-1 items-center justify-center bg-emerald-400">
        <Text style={{ fontSize: 20 }}>Leave Calculator</Text>
        <Text>Commencement Date:</Text>
        <Button onPress={showDatepicker} title="Show date picker!" />

        <Text>Leave Entitlement (in business days):</Text>
        <TextInput
          value={leaveEntitlement.toString()}
          onChangeText={(text) => setLeaveEntitlement(parseInt(text, 10))}
          placeholder="30"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            width: 100,
            height: 50,
            marginBottom: 10,
          }}
        />
        <Button title="Calculate" onPress={calculateResumptionDate} />
        {resumptionDate && (
          <Text className="text-lg">
            Resumption Date: {resumptionDate.toDateString()}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
