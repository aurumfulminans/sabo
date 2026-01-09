# BMI Calculator – User Stories

## Story 1 – Calculate BMI
As a user, I want to enter my height and weight so that I can see my Body Mass Index (BMI) calculated automatically.

**Acceptance Criteria**
1. BMI = weight_kg / (height_m)^2, where height_m = height_cm / 100.
2. BMI is displayed with one decimal place (e.g., "24.7 kg/m²").
3. Rounding is for display only; internal calculations use full precision.
4. If height or weight input is missing, non-numeric, or unrealistic, BMI is not calculated and an error message is displayed.
5. Pressing **Clear** resets all input fields and removes previous results.