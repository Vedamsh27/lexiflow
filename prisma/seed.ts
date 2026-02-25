import 'dotenv/config'
import prisma from '../lib/prisma'

async function main() {
  const words = [
    { word: 'ephemeral', definition: 'Lasting for a very short time', example: 'The ephemeral beauty of cherry blossoms makes them special.' },
    { word: 'serendipity', definition: 'Finding something good without looking for it', example: 'It was pure serendipity that they met at the airport.' },
    { word: 'eloquent', definition: 'Fluent and persuasive in speaking or writing', example: 'She gave an eloquent speech that moved the audience.' },
    { word: 'resilient', definition: 'Able to recover quickly from difficulties', example: 'Children are often more resilient than we expect.' },
    { word: 'ambiguous', definition: 'Open to more than one interpretation', example: 'The message was ambiguous and confused everyone.' },
    { word: 'meticulous', definition: 'Very careful and precise about details', example: 'He was meticulous in his research.' },
    { word: 'candid', definition: 'Truthful and straightforward', example: 'She gave a candid answer about her mistakes.' },
    { word: 'diligent', definition: 'Having steady and careful effort', example: 'A diligent student always does their homework.' },
    { word: 'profound', definition: 'Very deep in meaning or insight', example: 'The book had a profound effect on her life.' },
    { word: 'tenacious', definition: 'Holding firmly to a goal despite obstacles', example: 'His tenacious spirit helped him finish the marathon.' },
  ]

  for (const w of words) {
    await prisma.word.upsert({
      where: { word: w.word },
      update: {},
      create: w,
    })
  }

  console.log('✅ Seeded 10 words!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())