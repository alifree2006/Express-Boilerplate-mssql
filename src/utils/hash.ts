const bcrypt = require("bcryptjs");
export default async function hash(input: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(input, salt);
}
