// backend/server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || '579b464db66ec23bdd0000011ff356e4faeb4e8876488d919bb77fe5';
const RESOURCE_ID = process.env.RESOURCE_ID || 'ee03643a-ee4c-48c2-ac30-9f2ff26ab722';
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

const CACHE_FILE = path.join(__dirname, 'cache.json');
const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10) * 1000;

// ensure cache file exists
if (!fs.existsSync(CACHE_FILE)) fs.writeFileSync(CACHE_FILE, JSON.stringify({}), 'utf8');

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8') || '{}');
  } catch (e) {
    return {};
  }
}
function writeCache(obj) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(obj, null, 2), 'utf8');
}

function makeCacheKey(params) {
  // sort keys to make stable key
  const keys = Object.keys(params).sort();
  const parts = keys.map(k => `${k}=${params[k]}`);
  return parts.join('&');
}

app.get('/api/mgnrega', async (req, res) => {
  try {
    const state = req.query.state_name?.trim();
    const fin_year = req.query.fin_year?.trim();
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;

    if (!state || !fin_year)
      return res.status(400).json({ error: "State name and financial year are required" });

    const params = {
      'api-key': API_KEY,
      format: 'json',
      offset,
      limit,
      [`filters[state_name]`]: state,
      [`filters[fin_year]`]: fin_year,
    };

    const cacheKey = makeCacheKey(params);
    const cache = readCache();

    // serve from cache if fresh
    if (cache[cacheKey] && (Date.now() - cache[cacheKey].ts) < CACHE_TTL_MS) {
      return res.json({ source: 'cache', ...cache[cacheKey].data });
    }

    // fetch from government API
    const response = await axios.get(BASE_URL, { params });
    const data = response.data;

    // log message if API fails
    if (data.status !== 'ok') {
      console.error('API returned:', data.message);
    }

    // save to cache
    cache[cacheKey] = { ts: Date.now(), data };
    writeCache(cache);

    return res.json({ source: 'upstream', ...data });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Error fetching data from API' });
  }
});


// small endpoint to return the static list of states
app.get('/api/states', (req, res) => {
  const STATES = [
    "UTTAR PRADESH", "MADHYA PRADESH", "BIHAR", "ASSAM", "MAHARASHTRA",
    "GUJARAT", "RAJASTHAN", "TAMIL NADU", "CHHATTISGARH", "KARNATAKA",
    "TELANGANA", "ODISHA", "ANDHRA PRADESH", "PUNJAB", "JHARKHAND",
    "HARYANA", "ARUNACHAL PRADESH", "JAMMU AND KASHMIR", "MANIPUR",
    "UTTARAKHAND", "KERALA", "HIMACHAL PRADESH", "MEGHALAYA", "WEST BENGAL",
    "MIZORAM", "NAGALAND", "TRIPURA", "SIKKIM", "ANDAMAN AND NICOBAR",
    "LADAKH", "PUDUCHERRY", "GOA", "DN HAVELI AND DD", "LAKSHADWEEP"
  ];
  res.json(STATES);
});

app.listen(PORT, () => {
  console.log(`MGNREGA proxy server running on port ${PORT}`);
});
