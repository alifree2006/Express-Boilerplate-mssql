export default function isOnlyLettersAndNumbers(str: string) {
  return /^[A-Za-z0-9 ]*$/.test(str);
}
