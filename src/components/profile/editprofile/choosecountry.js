import React from 'react';
import CountryPicker, {
  CountryCodeList,
} from 'react-native-country-picker-modal';
export default function ChooseCountryPicker({onSelect, ...props}) {
  return (
    <CountryPicker
      countryCodes={CountryCodeList.filter(e => e !== 'IL')}
      withAlphaFilter={true}
      withFilter={true}
      withCloseButton={false}
      onSelect={onSelect}
      visible={true}
      {...props}
    />
  );
}

// export function setPhoneNumber({ setPhone, setPhoneValid }) {

//     return (<PhoneInput
//         ref={phoneInput}
//         defaultValue={phone}
//         defaultCode={defaultCode}
//         layout="second"
//         containerStyle={{
//             width: "100%",
//             height: 50,
//             borderRadius: 5,
//             overflow: "hidden",
//             marginBottom: phoneValid !== null ? 0 : 24,
//             backgroundColor: colors["clr2"],
//         }}
//         textContainerStyle={{
//             height: 50,
//             backgroundColor: colors[isDark ? "clr1" : "back1"],
//         }}
//         codeTextStyle={{
//             height: 50,
//             lineHeight: 50,
//             color: colors["clr1"]
//         }}
//         textInputStyle={{
//             height: 50,
//             color: colors[isDark ? "back2" : "clr1"]
//         }}
//         onChangeFormattedText={(text) => {
//             setPhone(text);
//             setPhoneValid(phoneInput.current.isValidNumber(text));
//         }}
//         countryPickerProps={{
//             withFilter: false,
//             withCloseButton: false,
//             withAlphaFilter: true
//         }}
//     />)
// }
