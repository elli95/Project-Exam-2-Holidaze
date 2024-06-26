import { create } from "zustand";

const useValidation = create((set) => ({
  validateField: (value, rule) => {
    switch (rule) {
      case "email":
        return /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(value);
      case "imgUrl":
        return (
          value === "" || /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/.test(value)
        );
      case "minInputLength":
        return value.length >= 1;
      case "inputLength":
        return value.length >= 1 && value.length <= 20;
      case "inputLengthPassword":
        const validCharacters = /^[A-Za-z0-9_]+$/;
        return value.length >= 8 && validCharacters.test(value);
      case "date":
        const date = new Date(value);
        return !isNaN(date.getTime());
      case "numbersOnly":
        return /^\d+$/.test(value);
      case "latitude":
        return value >= -90 && value <= 90;
      case "longitude":
        return value >= -180 && value <= 180;
      default:
        return true;
    }
  },
}));

export default useValidation;
