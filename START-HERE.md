# First Aid Assistant — start here

This starter website has three pages: an AI health guide chat, a health profile, and a create-account form. The files are separate so you can learn from and edit each part:

- `index.html` — page content and controls
- `styles.css` — colours, layout, and responsive styling
- `script.js` — page switching, chat demo, and BMI calculation

## Open the website

1. Keep all three files in the same folder.
2. Open `index.html` in a recent browser such as Chrome, Edge, Safari, or Firefox. The layout adapts to phones, tablets, and computers.
3. Try the suggested questions, switch to **My health profile**, enter sample height and weight, and use **Clear details** afterward.

You can also open the folder in Visual Studio Code and use its Live Server extension while learning. This is a front-end demo; it does not require an API key to open.

## What the demo does

- Shows a conversational interface and safe, limited sample responses. It is **not connected to ChatGPT** and does not provide a diagnosis or prescribe medicine.
- Recognizes a small set of urgent phrases and tells the visitor to contact emergency services. Keyword checks can miss emergencies, so they are not a substitute for professional triage.
- Calculates BMI from height and weight as a rough screening measure, not a diagnosis.
- Keeps profile fields in this browser tab's temporary session storage. They are not sent to a server by this demo. Do not enter real patient details on a shared device.
- Checks the account form fields and password confirmation in the browser. It does not create an account, save the password, or send personal details anywhere. The account page is only a visual and form-validation demo; it is not a functioning login system.
- Uses the off-white, deep navy, and warm accent palette in an approximate 60/30/10 balance. A Google Fonts connection is used for typography; system fonts remain as fallbacks.

## Connecting an AI service safely

The browser files deliberately contain no ChatGPT API key. A key in JavaScript or HTML that visitors can download is exposed to anyone who opens the site, and can be copied and misused.

For real accounts or an AI connection, add a server-side application that:

1. Stores passwords using a well-established password hashing method through a trusted authentication framework. Never save plain-text passwords or send them to an AI service.
2. Verifies email addresses and handles phone numbers only if your app needs them. Collect only the personal and health details you truly need, with a clear privacy notice and an appropriate deletion process.
3. Reads any AI API key from a server-only environment setting. Never put it in `index.html`, `script.js`, a public repository, or a variable named with a `VITE_`, `NEXT_PUBLIC_`, or similar public prefix.
4. Accepts only the fields it needs, checks message size and format, limits request rates, and does not log passwords, health messages, or API keys.
5. Calls the AI provider from the server and returns a short, clearly labelled general-information response. Keep provider credentials and access rules on the server.
6. Shows a safety notice, treats emergency cases as urgent, avoids diagnosis and prescription instructions, and directs users to qualified clinicians. An AI prompt alone cannot make medical advice safe or reliable.
7. Uses HTTPS when deployed, restricts who can call the endpoints, and explains what personal information is sent, where it goes, and how long it is kept.

Then replace the demo reply handler in `script.js` with a request to your own endpoint. Do not send profile readings unless users have a clear reason and have been told where that information goes. Get a qualified healthcare professional to review the wording and emergency flows before presenting this as a health service or entering a hackathon's live judging.

## Beginner-friendly build plan

1. First, present this as a **first-aid information prototype**, not a doctor replacement. Ask your mentor to help you choose one narrow, reviewable use case.
2. Learn the three files separately: change a heading in HTML, a colour in the CSS variables near the top of `styles.css`, then a button behavior in `script.js`.
3. If you add a server and AI endpoint, keep the key in the deployment host's private settings. Test with fake sample messages and an adult mentor; never use real patient details.
4. Before sharing, check the pages on a narrow phone screen and a laptop, keyboard navigation, urgent wording, and that no secret key appears in browser files or the public repository.
5. Deploy the static files on an HTTPS-enabled host. A static host can serve this demo, but an AI feature needs a separately deployed server endpoint; static hosting cannot keep an API key secret.

This project is a student prototype, not a medical device or emergency service. It does not guarantee that a website or account can never be attacked. Security depends on the hosting setup, server code, access controls, dependencies, and ongoing maintenance.

## Account screen in this prototype

The first screen is account creation, with a separate login tab. After account creation, the site greets the user by first name and pre-fills height and weight in their profile. The demo account (including its password for matching a login during the same open page) lives only in the page's temporary JavaScript memory. Refreshing or closing the page clears it, so the user must create a demo account again. The logout button returns to the entry screen and clears the in-memory demo account.

This is **not real authentication**. Anyone can bypass browser-only checks with developer tools, and browser code cannot safely protect passwords, phone numbers, or health data. Do not deploy this demo for real users or use real personal data. Before using accounts for a real service, connect a trusted authentication provider or a server that stores salted password hashes, verifies accounts, limits login attempts, and protects private data. Do not collect phone numbers unless your service needs them and explains how they will be used. Keep the interface's reduced-motion setting for people who prefer less animation.
