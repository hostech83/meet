import puppeteer from "puppeteer";

//jest.setTimeout(60000); // Set Jest timeout to 60 seconds

describe("show/hide event details", () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250, // slow down by 250ms,
      timeout: 0, // removes any puppeteer/browser timeout limitations (this isn't the same as the timeout of jest)
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
    await page.waitForSelector(".event");
  });

  afterAll(async () => {
    await browser.close();
  });

  test("An event element is collapsed by default", async () => {
    const eventDetails = await page.$(".event .eventDetails");
    expect(eventDetails).toBeNull();
  });

  test("User can expand an event to see details", async () => {
    await page.click(".event .details-btn"); // Expand first
    await page.click(".event .details-btn"); // Collapse
    const eventDetails = await page.$(".event .eventDetails");
    expect(eventDetails).toBeDefined();
  });

  test("User can collapse an event to hide details", async () => {
    const eventDetails = await page.$(".event .eventDetails");
    expect(eventDetails).toBeNull();
  });
});
