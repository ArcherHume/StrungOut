# StrungOut
General Node utility library for pluralisation, string formatting, and humanisation.
## Installation
```bash
npm install strungout
```

## Usage
```javascript
const strungOut = require('strungout');

// Pluralization
const count = 3;
console.log(strungOut.pluralize`${count} ${['apple', 'apples']}`); // "3 apples"

// Humanize Number
console.log(strungOut.humanizeNumber(1234567)); // "one million, two hundred thirty-four thousand, five hundred sixty-seven"

// Get Ordinal Suffix
console.log(strungOut.getOrdinalSuffix(42)); // "42nd"

// Humanize Duration
console.log(strungOut.humanizeDuration(86400000)); // "1 day"

// Time Ago
const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
console.log(strungOut.timeAgo(pastDate)); // "1 hour ago"

// Time Until
const futureDate = new Date(Date.now() + 86400000); // 1 day in the future
console.log(strungOut.timeUntil(futureDate)); // "in 1 day"

// Humanize Date
console.log(strungOut.humanizeDate(new Date('2022-10-12T00:00:00'))); // "Wednesday, the 12th of October, 2022"

// Possessive
console.log(strungOut.possessive("Chris")); // "Chris'"


// Convert Percentage <-> Fraction
console.log(strungOut.convertPercentageFraction("33.33%")); // "1/3"
console.log(strungOut.convertPercentageFraction("1/3")); // "33.33333333333333%"
```

## API
### pluralize(literals, ...expressions)
A tagged template literal for handling pluralization. Provides a concise syntax for defining singular and plural forms.

### humanizeNumber(num)
Converts a number to its word form.

### getOrdinalSuffix(number)
Returns the ordinal suffix for any number (e.g. "st" for 1, "nd" for 2, "rd" for 3, and "th" for 4).

### humanizeDuration(durationInMs)
Converts a duration in milliseconds to a human-readable string.

### timeAgo(date)
Returns a string representing the time elapsed since the given date.

### timeUntil(date)
Returns a string representing the time remaining until the given date.

### humanizeDate(date)
Converts a `Date` object to a human-readable string in the format "Day, Month Date, Year".

### possessive(name)
Returns the possessive form of a name or noun.

### convertPercentageFraction(value)
Converts a percentage to a fraction or a fraction to a percentage, depending on the input. Returns an error message if the input is invalid.

## License
[MIT](LICENSE)