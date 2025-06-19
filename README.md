# BTC Treasury Tickers

A simple site that tracks publicly listed companies holding Bitcoin in their treasuries.
Data is scraped from [bitbo.io](https://bitbo.io/treasuries/new-entities/) and
stock prices are fetched from Yahoo Finance.

## Running the updater

1. Install dependencies:
   ```bash
   pip install requests beautifulsoup4
   ```
2. Run the updater script which refreshes the JSON data every 15 minutes:
   ```bash
   python update_data.py
   ```

The JSON files are written to the `docs/` folder, which can be deployed as a
GitHub Pages site.

Each run compares scraped tickers to the previous data and flags new companies
with a `"new": true` field. The site highlights these tickers.
