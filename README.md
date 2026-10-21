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

Branding currently uses a provisional Herts Tutors navy/teal palette, pending confirmation against the supplied brand reference.
