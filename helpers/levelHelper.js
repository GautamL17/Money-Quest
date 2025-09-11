// export function calculateLevel({ points = 0, completedBits = 0, totalSavings = 0 }) {
//   // Example logic: You can adjust thresholds as needed
//   if (points >= 1000 && completedBits >= 30 && totalSavings >= 10000) return 10;
//   if (points >= 800 && completedBits >= 25 && totalSavings >= 8000) return 9;
//   if (points >= 650 && completedBits >= 20 && totalSavings >= 6500) return 8;
//   if (points >= 500 && completedBits >= 15 && totalSavings >= 5000) return 7;
//   if (points >= 400 && completedBits >= 12 && totalSavings >= 4000) return 6;
//   if (points >= 300 && completedBits >= 9 && totalSavings >= 3000) return 5;
//   if (points >= 200 && completedBits >= 6 && totalSavings >= 2000) return 4;
//   if (points >= 120 && completedBits >= 4 && totalSavings >= 1200) return 3;
//   if (points >= 60 && completedBits >= 2 && totalSavings >= 600) return 2;
//   return 1;
// }
export function calculateLevel({ points = 0, completedBits = 0, totalSavings = 0 }) {
    // Example logic: You can adjust thresholds as needed
    if (points >= 1000 && completedBits >= 30) return 10;
    if (points >= 800 && completedBits >= 25) return 9;
    if (points >= 650 && completedBits >= 20) return 8;
    if (points >= 500 && completedBits >= 15) return 7;
    if (points >= 400 && completedBits >= 12) return 6;
    if (points >= 300 && completedBits >= 9) return 5;
    if (points >= 200 && completedBits >= 6) return 4;
    if (points >= 120 && completedBits >= 4) return 3;
    if (points >= 60 && completedBits >= 2) return 2;
    return 1;
}