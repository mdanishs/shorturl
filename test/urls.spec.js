import { expect } from "chai"

console.log(process.env.DB_NAME)
import app from '../index';

describe("index test", () => {
  it("an", () => {
    expect(4).to.be.equal(4);
  })
})