import { CustomTheme } from "@/utils/theme/theme";
import { useTheme } from "@/utils/theme/useTheme";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { vw } from "react-native-expo-typescript-viewport-units";

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  autoFocus?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length,
  onComplete,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [activeInput, setActiveInput] = useState<number>(0);
  const inputRefs = useRef<TextInput[]>([]);
  const { theme } = useTheme();
  const ref = useRef<View>(null);

  const styles = makeStyles(theme);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "") {
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        inputRefs.current[index]?.blur();
      }
      setActiveInput(index + 1);
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  return (
    <View ref={ref} style={styles.container}>
      {otp.map((digit, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => inputRefs.current[index]?.focus()}
          style={[
            styles.inputContainer,
            index === activeInput && styles.activeInput,
          ]}
        >
          <TextInput
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={styles.input}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="numeric"
            maxLength={1}
            inputMode="numeric"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const makeStyles = (theme: CustomTheme) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: vw(2.5),
    },
    inputContainer: {
      width: vw(12),
      height: vw(12), // Changed to vw to match width
      borderWidth: vw(0.5),
      borderColor: theme.colors.border,
      borderRadius: vw(2),
      justifyContent: "center",
      alignItems: "center",
    },
    activeInput: {
      borderColor: "#007AFF",
    },
    input: {
      fontSize: vw(5),
      textAlign: "center",
      color: theme.colors.text,
    },
  });
};

export default OTPInput;
