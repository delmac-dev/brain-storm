# **App Name**: BrainBoost

## Core Features:

- Question Import: Import questions from a JSON list according to the specified schema. Data is stored in local storage.
- Question Card Grid: Display questions as cards in a grid layout. Each card shows the question title, difficulty, and last score.
- Test Runner: Test view that displays the question, options, and explanation after submission, supports multiple choice types. Update localStorage for attempts and scores.
- Question Editor: Enable CRUD operations (Create, Read, Update, Delete) for managing questions directly in the UI.
- Retake Test Button: Button on each question card to quickly retake the test for that question, resetting the score.
- Score Dashboard: Display the score history with detailed performance metrics like total score, average score, number of attempts in a dashboard view.

## Style Guidelines:

- Primary color: A vibrant purple (#9D4EDD) to convey intelligence and creativity. It stands out well in both light and dark modes and pairs nicely with a wide range of secondary colors.
- Background color: Light gray (#F5F5F5) to provide a clean and modern backdrop that is easy on the eyes, ensuring a comfortable user experience during prolonged use.
- Accent color: A lively orange (#FFA500) as an accent to highlight important actions or information. It draws attention effectively and enhances the interactive elements of the app.
- Body and headline font: 'Inter' sans-serif for a modern and readable style
- Use simple, clear icons from a library like FontAwesome or Feather to visually represent different question types, difficulty levels, and actions like 'edit' or 'retake'.
- Cards in a responsive grid layout that adapts to different screen sizes. Ensure sufficient spacing and padding around each element.
- Subtle transitions using Framer Motion when cards appear, tests are submitted, and scores update to provide smooth user feedback and enhance engagement.