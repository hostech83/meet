// src/__tests__/EndToEnd.test.js
import puppeteer from "puppeteer";
import "@testing-library/jest-dom";

describe("filter events by city", () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      //   headless: false,
      //   slowMo: 100, // slow down by 100ms,
      //   timeout: 0 // removes any puppeteer/browser timeout limitations (this isn't the same as the timeout of jest)
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
    await page.waitForSelector(".event");
  });

  afterAll(async () => {
    browser.close();
  });

  test("When user hasn’t searched for a city, show upcoming events from all cities.", async () => {
    const eventListItems = await page.$$('[data-testid="eventlist"] .event');
    const inputValue = await page.$eval(
      '[data-testid="city-search-input"]',
      (el) => el.value
    );
    expect(inputValue).toBe("");
    expect(eventListItems).toHaveLength(32);
  });

  test("User should see a list of suggestions when they search for a city.", async () => {
    await page.click('[data-testid="city-search-input"]');
    await page.type('[data-testid="city-search-input"]', "Berlin");
    await page.waitForSelector('[data-testid="suggestions-list"] li');
    await page.click('[data-testid="suggestions-list"] li:first-child');

    const selectedCity = await page.$eval(
      '[data-testid="city-search-input"]',
      (el) => el.value
    );
    expect(selectedCity).toBe("Berlin, Germany");

    const eventListItems = await page.$$('[data-testid="eventlist"] .event');
    const berlinEventCount = await page.$$eval(
      ".event",
      (events) =>
        events.filter((event) => event.textContent.includes("Berlin, Germany"))
          .length
    );
    expect(eventListItems).toHaveLength(berlinEventCount);
  });
});

describe("show/hide event details", () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 250, // slow down by 250ms,
      // timeout: 0 // removes any puppeteer/browser timeout limitations (this isn't the same as the timeout of jest)
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
    await page.waitForSelector(".event");
    await page.waitForSelector('[data-testid="eventlist"]');
  });
  console.log("event");
  afterAll(async () => {
    browser.close();
  });

  test("An event element is collapsed by default", async () => {
    const eventDetails = await page.$(".event .details");
    expect(eventDetails).toBeNull();
  });

  test("User can expand an event to see details", async () => {
    await page.click(".event .details-btn");
    const eventDetails = await page.$(".event .details");
    expect(eventDetails).toBeDefined();
  });

  test("User can collapse an event to hide details", async () => {
    await page.click(".event .details-btn");
    const eventDetails = await page.$(".event .details");
    expect(eventDetails).toBeNull();
  });

  test("User expands multiple event details", async () => {
    const showDetailsButtons = await page.$$('[data-testid^="btn-"]');

    await showDetailsButtons[1].click();
    expect(await page.$(".event:nth-of-type(0) .details")).toBeDefined();
    await showDetailsButtons[2].click();
    expect(await page.$(".event:nth-of-type(1) .details")).toBeDefined();
    await showDetailsButtons[3].click();
    expect(await page.$(".event:nth-of-type(2) .details")).toBeDefined();
  });

  test("User collapses all expanded event details", async () => {
    const showDetailsButtons = await page.$$('[data-testid^="btn-"]');

    await showDetailsButtons[1].click();
    expect(await page.$(".event:nth-of-type(0) .details")).toBeDefined();
    await showDetailsButtons[2].click();
    expect(await page.$(".event:nth-of-type(1) .details")).toBeDefined();
    await showDetailsButtons[3].click();
    expect(await page.$(".event:nth-of-type(2) .details")).toBeDefined();

    const collapseAllButton = await page.$$(".toggleBtn");
    await collapseAllButton[0].click();
    const eventDetails = await page.$(".event .details");
    expect(eventDetails).toBeNull();
  });
});

describe("specify number of events", () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      //   headless: false,
      //   slowMo: 100, // slow down by 100ms,
      //   timeout: 0 // removes any puppeteer/browser timeout limitations (this isn't the same as the timeout of jest)
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000/");
    await page.waitForSelector(".event");
    await page.waitForSelector('[data-testid="eventlist"]');
  });

  afterAll(async () => {
    browser.close();
  });
  test("When user hasn't specified a number, 32 events are shown by default", async () => {
    const eventListItems = await page.$$('[data-testid="eventlist"] .event');
    expect(eventListItems).toHaveLength(32);
  });

  test("User can change the number of events displayed", async () => {
    await page.click('[data-testid="number-of-events-input"]');
    await page.type('[data-testid="number-of-events-input"]', "5");
    const eventListItems = await page.$$('[data-testid="eventlist"] .event');
    expect(eventListItems).toHaveLength(5);
  });

  test("User requests more events than available", async () => {
    // Mock data has 77 total events
    await page.click('[data-testid="number-of-events-input"]');
    await page.type('[data-testid="number-of-events-input"]', "100");
    const eventListItems = await page.$$('[data-testid="eventlist"] .event');
    expect(eventListItems).toHaveLength(77);
  });

  test("User changes number of events while filtered", async () => {
    await page.click('[data-testid="city-search-input"]');
    await page.type('[data-testid="city-search-input"]', "Berlin");
    await page.waitForSelector('[data-testid="suggestions-list"] li');
    await page.click('[data-testid="suggestions-list"] li:first-child');

    const selectedCity = await page.$eval(
      '[data-testid="city-search-input"]',
      (el) => el.value
    );
    expect(selectedCity).toBe("Berlin, Germany");

    const eventListItems = await page.$$('[data-testid="eventlist"] .event');
    // Mock data has 21 events in Berlin
    expect(eventListItems).toHaveLength(21);

    await page.click('[data-testid="number-of-events-input"]');
    await page.type('[data-testid="number-of-events-input"]', "5");

    const filteredeventListItems = await page.$$(
      '[data-testid="eventlist"] .event'
    );
    // verify each item is in Berlin
    const eventItemsCheck = await page.$$eval(
      ".event",
      (events) =>
        events.filter((event) => event.textContent.includes("Berlin, Germany"))
          .length
    );
    expect(eventItemsCheck).toBe(5);
    expect(filteredeventListItems).toHaveLength(5);
  });
});
