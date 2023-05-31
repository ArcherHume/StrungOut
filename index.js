function pluralize(literals, ...expressions) {
  let result = "";

  // Iterate over the expressions
  for (let i = 0; i < expressions.length; i++) {
    const expression = expressions[i];

    // If expression is an array with two elements, assume it contains singular and plural forms
    if (Array.isArray(expression) && expression.length === 2) {
      let countIndex = i - 1;

      // Find the nearest count expression (backward)
      while (countIndex >= 0 && typeof expressions[countIndex] !== "number") {
        countIndex--;
      }

      // If a valid count is found, set appropriate singular or plural form
      if (countIndex >= 0 && typeof expressions[countIndex] === "number") {
        const count = expressions[countIndex];
        const singular = expression[0];
        const plural = expression[1];

        // Choose singular or plural form based on the count
        expressions[i] = count === 1 ? singular : plural;
      }
    }

    // Combine literals and expressions into the result string
    result += literals[i] + expressions[i];
  }

  // Add the final literal
  result += literals[literals.length - 1];

  return result;
}

function humanizeNumber(num) {
  if (num > 18000000000000000000000) {
    throw new Error("Integer too high.");
  }
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const largeUnits = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
    "septillion",
    "octillion",
    "nonillion",
    "decillion",
  ];

  function convertToWords(n) {
    if (n < 10) {
      return ones[n];
    } else if (n >= 10 && n < 20) {
      return teens[n - 10];
    } else if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 > 0 ? " " + ones[n % 10] : "");
    } else if (n < 1000) {
      const hundred = ones[Math.floor(n / 100)] + " hundred";
      return hundred + (n % 100 > 0 ? " and " + convertToWords(n % 100) : "");
    } else {
      return "";
    }
  }

  let result = "";
  let groupIndex = 0;

  while (num > 0) {
    const groupValue = num % 1000;

    if (groupValue > 0) {
      const groupText =
        convertToWords(groupValue) + " " + largeUnits[groupIndex];
      result = groupText + (result.length > 0 ? ", " : "") + result;
    }

    num = Math.floor(num / 1000);
    groupIndex++;
  }

  return result;
}

function getOrdinalSuffix(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return number + "st";
  } else if (lastDigit === 2 && lastTwoDigits !== 12) {
    return number + "nd";
  } else if (lastDigit === 3 && lastTwoDigits !== 13) {
    return number + "rd";
  } else {
    return number + "th";
  }
}

function humanizeDuration(durationInMs) {
  const units = [
    { name: "year", ms: 1000 * 60 * 60 * 24 * 365 },
    { name: "month", ms: 1000 * 60 * 60 * 24 * 30 },
    { name: "week", ms: 1000 * 60 * 60 * 24 * 7 },
    { name: "day", ms: 1000 * 60 * 60 * 24 },
    { name: "hour", ms: 1000 * 60 * 60 },
    { name: "minute", ms: 1000 * 60 },
  ];

  for (const unit of units) {
    const value = Math.round(durationInMs / unit.ms);
    if (value >= 1) {
      return `${value} ${value > 1 ? unit.name + "s" : unit.name}`;
    }
  }

  return "just now";
}

function timeAgo(date) {
  const durationInMs = new Date().getTime() - date.getTime();
  if (durationInMs > 0) {
    return `${humanizeDuration(durationInMs)} ago`;
  }
  return "just now";
}

function timeUntil(date) {
  const durationInMs = date.getTime() - new Date().getTime();
  if (durationInMs > 0) {
    return `in ${humanizeDuration(durationInMs)}`;
  }
  return "just now";
}

function humanizeDate(date) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
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

  function getOrdinalSuffix(day) {
    return (
      day + (["th", "st", "nd", "rd"][(day % 100 >> 3) ^ 1 && day % 10] || "th")
    );
  }

  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = getOrdinalSuffix(date.getDate());
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek}, the ${dayOfMonth} of ${month}, ${year}`;
}

function possessive(name) {
  const lastChar = name.slice(-1).toLowerCase();

  if (lastChar === "s") {
    return name + "'";
  } else {
    return name + "'s";
  }
}

function simplifyFraction(numerator, denominator) {
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  const gcdValue = gcd(numerator, denominator);
  return [numerator / gcdValue, denominator / gcdValue];
}

function findClosestFraction(decimal, maxDenominator = 1000) {
  let minDifference = Math.abs(decimal);
  let closestNumerator, closestDenominator;

  for (let denominator = 1; denominator <= maxDenominator; denominator++) {
    const numerator = Math.round(decimal * denominator);
    const difference = Math.abs(decimal - numerator / denominator);

    if (difference < minDifference) {
      minDifference = difference;
      closestNumerator = numerator;
      closestDenominator = denominator;
    }
  }

  return simplifyFraction(closestNumerator, closestDenominator);
}

function convertPercentageFraction(value) {
  function toPercentage(fraction) {
    const [numerator, denominator] = fraction;
    return (parseInt(numerator) / parseInt(denominator)) * 100;
  }

  // Check if input is a percentage (contains '%')
  if (value.includes("%")) {
    const percentageValue = parseFloat(value.replace("%", "")) / 100;
    return findClosestFraction(percentageValue).join("/");
  }
  // Check if input is a fraction (contains '/')
  else if (value.includes("/")) {
    const fraction = value.split("/").map(Number);
    return `${toPercentage(fraction)}%`;
  }
  // Invalid input
  else {
    return "Invalid input";
  }
}

exports.pluralize = pluralize;
exports.humanizeNumber = humanizeNumber;
exports.getOrdinalSuffix = getOrdinalSuffix;
exports.humanizeDuration = humanizeDuration;
exports.timeAgo = timeAgo;
exports.timeUntil = timeUntil;
exports.humanizeDate = humanizeDate;
exports.possessive = possessive;
exports.simplifyFraction = simplifyFraction;
exports.findClosestFraction = findClosestFraction;
exports.convertPercentageFraction = convertPercentageFraction;
