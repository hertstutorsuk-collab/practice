# Practice

A GCSE maths question generator with fractions, percentages and algebra, three difficulty levels, unique questions per worksheet, worked answers, and print styles.

## Run

Requires Python 3 and Node.js 18+ for tests. No package installation or API keys needed.

```sh
npm start
```

Open port 3000 in your development environment. Choose your settings and select **Generate my worksheet**. **Show answers** reveals solutions; **Print** opens the browser print dialog, where you can save a PDF. Hide answers before printing a student copy.

```sh
npm test
```

Question generation runs locally in the browser. No student accounts, data collection, or AI service is used. Fonts optionally load from Google Fonts; system fonts work offline. Difficulty varies the numbers and question structure; this is a starter question bank, not full GCSE curriculum coverage.

## Publish with GitHub Pages

This app is ready for static hosting; no build or API keys are required.

In the GitHub repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then select **main** and **/ (root)** and click **Save**. GitHub will show the published URL when deployment completes. The expected project URL is `https://hertstutorsuk-collab.github.io/practice/`; it is not live until Pages deployment succeeds.

If GitHub asks you to upgrade or change repository visibility, Pages availability depends on the repository owner's plan. Do not change visibility just to deploy without the owner's approval.

## Answer checking

Enter an answer below each question and select **Mark my answers** for a score and feedback. **Retry missed questions** clears only missed answers, hides worked solutions, and focuses the first retry. Correct answers remain filled. Fraction answers accept a/b notation; equivalent fractions needing simplification receive a prompt. Numeric decimals and `x = ...` are supported. This checks final answers only, not GCSE method marks. Scores are practice feedback, not predicted GCSE grades, and are not stored.

Branding follows the supplied Herts Tutors website screenshot: deep navy (#122b62), gold (#c99a26), white backgrounds and bold headings. Colours are visual approximations from the reference; the original uploaded stag logo is used in the header and as the browser tab icon.

## Mixed revision and saved work

Choose **Mixed revision** to balance fractions, percentages and algebra in one worksheet. Marking shows a per-topic summary, with buttons to create focused practice for topics with missed questions. This reflects the current worksheet, not a GCSE grade prediction.

Questions and entered answers automatically save in local browser storage. Returning on the same browser and site restores the latest worksheet and answers; marking and answer visibility reset. No account or server is involved. Avoid entering personal information on a shared device. **Clear saved work** removes the stored worksheet and pauses saving until a new worksheet is generated. Private browsing, cleared storage, or another device may not retain work; if saving is unavailable the app remains usable and displays a message.
