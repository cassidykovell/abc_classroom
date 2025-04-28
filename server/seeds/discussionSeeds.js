const { Question, Answer } = require("../models")

const seedDiscussions = async () => {
  console.log("Seeding discussions...")

  // Clean up existing data
  await Question.deleteMany({})
  await Answer.deleteMany({})

  // Create questions
  const questions = [
    {
      title: "Best strategies for teaching fractions to 3rd graders?",
      content:
        "I'm struggling to help my 3rd grade students understand fractions. They seem to get confused with the concept of parts of a whole. What strategies or activities have worked well for you?",
      username: "sarah_teacher",
      tags: ["math", "fractions", "elementary", "3rd grade"],
    },
    {
      title: "Classroom management techniques for middle school",
      content:
        "I'm a new teacher working with 7th graders and finding it challenging to keep the class focused. What classroom management techniques have been effective for you with middle school students?",
      username: "john_educator",
      tags: ["classroom management", "middle school", "behavior"],
    },
    {
      title: "Incorporating technology in history lessons",
      content:
        "I want to make my history lessons more engaging by incorporating technology. Any suggestions for apps, websites, or activities that have worked well in your history classes?",
      username: "maria_instructor",
      tags: ["history", "technology", "digital learning"],
    },
    {
      title: "Supporting students with ADHD",
      content:
        "I have several students with ADHD in my class this year. I want to ensure I'm providing the right support and accommodations. What strategies have you found effective?",
      username: "david_professor",
      tags: ["ADHD", "accommodations", "special education"],
    },
    {
      title: "Creative writing prompts for high school",
      content:
        "Looking for some fresh creative writing prompts for my high school English class. What prompts have sparked the most engagement and creativity from your students?",
      username: "sarah_teacher",
      tags: ["english", "creative writing", "high school"],
    },
  ]

  const createdQuestions = await Question.insertMany(questions)
  console.log(`${createdQuestions.length} questions seeded successfully!`)

  // Create answers
  const answers = [
    {
      content:
        "I've had great success using physical manipulatives like fraction circles and fraction strips. Having students physically handle and see the parts of a whole makes a big difference. Also, relating fractions to food (like pizza slices or chocolate bars) helps make the concept more concrete.",
      username: "john_educator",
      questionId: createdQuestions[0]._id,
      isAccepted: true,
    },
    {
      content:
        "I use a lot of visual models in my classroom. Drawing pictures, using fraction bars, and number lines have been helpful. I also found that starting with unit fractions (1/2, 1/3, 1/4) before moving to non-unit fractions helps build understanding.",
      username: "maria_instructor",
      questionId: createdQuestions[0]._id,
    },
    {
      content:
        "Establishing clear routines and expectations from day one has been key for me. I use a points system where students can earn class rewards, and I'm consistent with consequences. Also, keeping lessons varied and interactive helps maintain engagement.",
      username: "david_professor",
      questionId: createdQuestions[1]._id,
    },
    {
      content:
        "I've found that giving students more ownership and responsibility works well at this age. Having class jobs, student-led discussions, and choice in assignments helps them feel invested. Also, short activities with clear transitions keeps the pace moving.",
      username: "sarah_teacher",
      questionId: createdQuestions[1]._id,
      isAccepted: true,
    },
    {
      content:
        "Virtual reality tours have been amazing for my history classes! Google Expeditions lets students 'visit' historical sites. I also use Timeline JS for interactive timelines and have students create digital museums with artifacts they research.",
      username: "sarah_teacher",
      questionId: createdQuestions[2]._id,
    },
    {
      content:
        "I've had success with documentary film-making projects where students research a historical event and create a short documentary. They love the creative aspect, and it deepens their understanding of the subject matter.",
      username: "david_professor",
      questionId: createdQuestions[2]._id,
      isAccepted: true,
    },
    {
      content:
        "Flexible seating options have made a huge difference in my classroom. Some students do better standing, sitting on exercise balls, or working at higher tables. I also build in movement breaks and chunk assignments into smaller parts with clear checkpoints.",
      username: "maria_instructor",
      questionId: createdQuestions[3]._id,
      isAccepted: true,
    },
    {
      content:
        "I use a lot of visual schedules and timers to help with transitions. Providing written instructions alongside verbal ones helps too. I've also found that allowing fidget tools (the non-distracting kind) helps some students focus better.",
      username: "john_educator",
      questionId: createdQuestions[3]._id,
    },
    {
      content:
        "One prompt that worked really well was having students write a story from the perspective of an everyday object (like a pencil, backpack, or cell phone). The stories were creative and often quite humorous!",
      username: "john_educator",
      questionId: createdQuestions[4]._id,
    },
    {
      content:
        "I like to use image prompts - showing an unusual photograph and asking students to write about what happened just before or just after the image was taken. Also, having them write alternative endings to well-known stories or films gets their creativity flowing.",
      username: "david_professor",
      questionId: createdQuestions[4]._id,
      isAccepted: true,
    },
  ]

  const createdAnswers = await Answer.insertMany(answers)
  console.log(`${createdAnswers.length} answers seeded successfully!`)

  // Update questions with answer IDs
  for (const answer of createdAnswers) {
    await Question.findByIdAndUpdate(answer.questionId, { $push: { answers: answer._id } }, { new: true })
  }

  console.log("Questions updated with answer references!")
}

module.exports = seedDiscussions
