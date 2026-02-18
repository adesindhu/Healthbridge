// Realistic Health Score Calculation Logic

export function calculateHealthScore(data) {
  let score = 100;

  // Blood Pressure
  if (data.bpSystolic > 140 || data.bpDiastolic > 90) score -= 15;
  else if (data.bpSystolic > 130) score -= 8;

  // Sugar Level
  if (data.sugar > 180) score -= 15;
  else if (data.sugar > 140) score -= 8;

  // BMI
  if (data.bmi > 30 || data.bmi < 18) score -= 10;
  else if (data.bmi > 25) score -= 5;

  // Sleep (hours)
  if (data.sleep < 6) score -= 8;

  // Activity (minutes per day)
  if (data.activity < 20) score -= 8;

  // Stress Level (1–10)
  score -= data.stress * 1.5;

  // Keep score between 0–100
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return Math.round(score);
}
