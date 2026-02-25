export interface SM2Result {
  easeFactor: number
  interval: number
  repetitions: number
}

export function calculateSM2(
  quality: number,       // 0-5 rating from user
  repetitions: number,
  easeFactor: number,
  interval: number
): SM2Result {
  // Update ease factor
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEF < 1.3) newEF = 1.3  // minimum ease factor

  let newInterval: number
  let newReps: number

  if (quality < 3) {
    // Failed — reset back to day 1
    newReps = 0
    newInterval = 1
  } else {
    // Success — grow the interval
    newReps = repetitions + 1
    if (newReps === 1) newInterval = 1
    else if (newReps === 2) newInterval = 6
    else newInterval = Math.round(interval * newEF)
  }

  return { easeFactor: newEF, interval: newInterval, repetitions: newReps }
}
