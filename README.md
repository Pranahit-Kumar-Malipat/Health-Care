# Health-Care
# First Aid Assistant

A responsive student project prototype for sharing general first-aid information. It includes an account screen, an AI health guide chat demo, and a health profile with a BMI calculation.

> **Important:** This is a prototype, not a doctor, emergency service, or medical diagnosis tool. The chat is not connected to an AI service and does not prescribe medicines. For emergencies, contact your local emergency services.

## Features

- Sign-up and login screens
- Health profile for age, height, weight, blood pressure, cholesterol, and blood sugar
- BMI calculation based on height and weight
- Responsive layout for phones, tablets, and computers
- General safety messages for some urgent symptom phrases
- Off-white, deep navy, and warm accent colour palette

## Run the project

1. Download or clone this repository.
2. Keep `index.html`, `styles.css`, and `script.js` in the same folder.
3. Open `index.html` in a modern browser.

No API key or installation is needed for this demo.

## Project files

- `index.html` — page content and forms
- `styles.css` — layout, colours, and responsive design
- `script.js` — page behavior, demo account flow, chat responses, and BMI calculation
- `START-HERE.md` — additional setup and security guidance

## Demo account limitations

The account flow runs only in the browser. Demo account details and passwords are held temporarily in page memory and are lost when the page is refreshed or closed. This is **not secure authentication**. Do not enter real personal, medical, or password information.

## AI integration

The chat is not connected to ChatGPT. To add an AI service, build a server-side endpoint and keep the API key in private server settings. Never put an API key in browser JavaScript, HTML, or a public GitHub repository.

## Disclaimer

This student prototype provides general information only. It cannot diagnose conditions, recommend prescription medicines, or replace advice from a qualified healthcare professional. Emergency keyword checks can miss urgent situations.
