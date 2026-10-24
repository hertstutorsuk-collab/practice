# Herts Tutors revision hubs

The main page (`index.html`) is the GCSE revision hub for grade 3→5 and grade 5→7 programmes. The WA ATAR Methods app remains at `methods.html` and links back to the GCSE hub. Both retain the original Herts Tutors branding.

## GCSE hub

- Timetable maker: choose Edexcel, AQA or OCR, grade-target pathway, start date, 2–12 weeks, study days, 20–60 minutes per session, and priority topics.
- Dated sessions combine recall, practice, marking, and a mixed review every third session. Completion ticks and the plan save on the current browser. Print to retain a PDF. Replacing or clearing a plan requests confirmation.
- Foundation pathway targets grade 5; Higher pathway targets grade 7. These are goals, not guarantees or grade predictions. Tier selection should be confirmed with the school.
- Official past paper libraries for all three boards. No PDFs are copied. Link destinations were previously blocked by the cloud network policy and are not live-verified.
- Original 12-question, 24-indicative-mark topic samplers with worked answers, reveal controls and print-to-PDF. These are new templates, not adapted copies, full mocks, complete syllabus coverage, or board-matched assessments. A tutor should review mark allocations before assessment use.
- GCSE sampler topics include fractions, percentages, ratio, equations, area and probability for the 3→5 route; indices, quadratics, simultaneous equations, trigonometry, compound change and probability without replacement for 5→7.

The community link/integration is not configured. Student profiles remain browser-local names, not secure login. Tutor dashboards, cloud progress and AI marking are not connected. No community messages are sent. Example papers can guide a separate tutor-reviewed original paper bank.

## Run

Python 3 serves the app, and Node.js 18+ runs `npm test`. No dependency installation or API keys are needed. `npm start` serves port 3000. GitHub Pages uses the main branch and root folder. Printing uses the browser print dialog; visual print layout should be checked in the target browser.

---

## WA ATAR Mathematics Methods archive

A browser-based starter practice bank for Western Australian ATAR Mathematics Methods. This is independent practice, not an endorsed SCSA product, complete syllabus, exam simulation, ATAR predictor or AI marker.

## Run and test

Requires Python 3 and Node.js 18+. No package installation or API keys required.

```sh
npm start
npm test
```

The server uses port 3000. Static files can also be hosted on GitHub Pages, using main and / (root). The project site is https://hertstutorsuk-collab.github.io/practice/ . Site changes require successful GitHub Pages deployment.

## Practice coverage

- Functions: quadratic evaluation, exponential evaluation, natural logarithms.
- Calculus: quadratic gradients, definite integrals of quadratic expressions, a chain-rule gradient.
- Probability: binomial expectation, point probabilities, cumulative probabilities.
- Statistics: sample proportions, estimated standard errors, approximate 95% confidence interval margins using z = 1.96.

Three difficulty levels vary the selected skills; they do not map to grades or official unit boundaries. Mixed revision balances all four topics. Questions take numerical answers, with four-decimal-place instructions where needed. Rounding tolerance accepts sufficiently precise values; marking checks final answers only, not working or method marks. There is no AI service or symbolic algebra marker. Full trigonometry, normal distributions and extended modelling remain outside this bank.

Enter answers, mark the worksheet, review the topic summary, and retry missed questions or create focused practice. Show answers reveals worked steps. Print opens the browser print dialog; hide answers first for a student copy. A calculator may be useful; this generator does not simulate official calculator restrictions.

## Local profiles and saving

The welcome screen shows “Hi, [name]”. Remembering a first name or nickname is optional. This is a local browser profile, not secure login; no passwords, private per-user accounts or cross-device syncing exist. Work is shared on the browser. Profile lets you edit or forget a name.

The latest worksheet and entered answers save locally, with restoration on the same browser and site. Marking and answer visibility reset on return. Clear saved work removes the stored worksheet and pauses saving until a new one is generated. Storage failure does not prevent practice. Methods worksheets use a separate storage key; earlier GCSE sheets are not loaded or deleted.

## Official resources

The site links to SCSA's past ATAR examinations and Mathematics Methods course resource pages. Students choose the course, year, paper and matching marking key on the official site. PDFs are not copied into this repository. Live destination checks may be blocked by the cloud network policy; no individual download or syllabus-year match is claimed verified. Follow current SCSA instructions for technology and examination rules.

## Branding

Original uploaded Herts Tutors stag logo, white backgrounds, deep navy (#122b62), gold (#c99a26), and bold headings based on the supplied reference. Optional Google Fonts have system fallbacks.

## Exam mistake log

Use Mistake log to record a paper/question reference, Methods topic, marks lost, question text or reminder, the mistake and a plan for next time. Entries can be edited, marked resolved, reopened and deleted. Filters show open, resolved or all records. The summary totals marks lost on open entries; this is not a predicted exam result.

The log holds up to 200 records in this browser's local storage, shared across local profile names. A failed save leaves the previous log unchanged; unreadable saved data is not overwritten. JSON export downloads a backup of the records, but automatic import is not yet supported. There is no photo attachment, cloud syncing or reminder notification. Worksheet clearing and forgetting a profile name do not delete the separate mistake log; delete its entries explicitly if using a shared device.
