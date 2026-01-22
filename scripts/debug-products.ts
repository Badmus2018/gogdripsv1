import getProducts from "../actions/get-products";
import fs from "fs";

async function main() {
  const products = await getProducts({ category: null });
  try {
    fs.writeFileSync("products-debug.json", JSON.stringify(products, (key, value) => {
      // Convert BigInt to string
      if (typeof value === "bigint") return value.toString();
      // Convert Buffer to base64
      if (value && value.type === "Buffer" && Array.isArray(value.data)) {
        return Buffer.from(value.data).toString("base64");
      }
      return value;
    }, 2));
    console.log("Products data written to products-debug.json");
  } catch (e) {
    console.error("Failed to write products-debug.json:", e);
  }
}

main();
