import hre from "hardhat";
import { keccak256 } from "js-sha3";

export async function verifyContract(
  address: string,
  constructorArgs: any[] = []
) {
  console.log(`Verifying contract at address ${address}...`);
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArgs,
    });
  } catch (error: any) {
    console.error(`- Error verifying ${address}`);
  }
}

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export const isAddress = function (address: string) {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (
    /^(0x)?[0-9a-f]{40}$/.test(address) ||
    /^(0x)?[0-9A-F]{40}$/.test(address)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return isChecksumAddress(address);
  }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
const isChecksumAddress = function (address: string) {
  // Check each case
  address = address.replace("0x", "");
  const addressHash = keccak256(address.toLowerCase());
  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
};


export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))