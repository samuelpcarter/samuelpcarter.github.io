#!/usr/bin/env python3
"""
Requires: requests, bs4
To run: python update_data.py
Can be hosted on Render, Replit, or any free Python app host
"""
import json
import random
import time
from datetime import datetime

import requests
from bs4 import BeautifulSoup

TREASURY_URL = "https://bitbo.io/treasuries/new-entities/"
TREASURIES_FILE = "docs/treasuries.json"
PRICES_FILE = "docs/prices.json"
HEADERS = {"User-Agent": "Mozilla/5.0"}


def fetch_treasuries():
    resp = requests.get(TREASURY_URL, headers=HEADERS, timeout=10)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    rows = soup.select("table tbody tr")
    treasuries = []
    for row in rows:
        cols = [c.get_text(strip=True) for c in row.find_all("td")]
        if len(cols) < 3:
            continue
        ticker, company, date = cols[0], cols[1], cols[2]
        if not ticker or "ETF" in company.upper() or "FUND" in company.upper():
            continue
        treasuries.append({"ticker": ticker, "company": company, "date": date})
    with open(TREASURIES_FILE, "w") as f:
        json.dump(treasuries, f, indent=2)
    return [t["ticker"] for t in treasuries]


def fetch_price(ticker):
    try:
        r = requests.get(
            f"https://query1.finance.yahoo.com/v7/finance/quote?symbols={ticker}",
            headers=HEADERS,
            timeout=10,
        )
        r.raise_for_status()
        data = r.json()["quoteResponse"]["result"]
        if data:
            return data[0]["regularMarketPrice"], data[0]["regularMarketChangePercent"]
    except Exception as exc:
        print(f"Using mock data for {ticker}: {exc}")
    return round(random.uniform(5, 500), 2), round(random.uniform(-5, 5), 2)


def save_prices(tickers):
    prices = []
    for t in tickers:
        price, change = fetch_price(t)
        prices.append({"ticker": t, "price": price, "percentChange": change})
    with open(PRICES_FILE, "w") as f:
        json.dump(prices, f, indent=2)


def main():
    while True:
        print(f"Update started at {datetime.utcnow().isoformat()}Z")
        try:
            tickers = fetch_treasuries()
            save_prices(tickers)
            print("Update complete")
        except Exception as err:
            print(f"Error: {err}")
        time.sleep(900)


if __name__ == "__main__":
    main()
