const db = require("../config/connection")
const { User, Activity } = require("../models")
const bcrypt = require("bcrypt")
const seedDiscussions = require("./discussionSeeds")
require("dotenv").config()

db.once("open", async () => {
  try {
    // Clean up existing data
    await Activity.deleteMany({})
    await User.deleteMany({})

    console.log("All data cleared. Starting seed...")

    // Create users
    const users = [
      {
        username: "sarah_teacher",
        email: "sarah@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        username: "john_educator",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        username: "maria_instructor",
        email: "maria@example.com",
        password: await bcrypt.hash("password123", 10),
      },
      {
        username: "david_professor",
        email: "david@example.com",
        password: await bcrypt.hash("password123", 10),
      },
    ]

    const createdUsers = await User.insertMany(users)
    console.log("Users seeded successfully!")

    // Create activities
    const activities = [
      {
        lessonName: "Exploring Fractions Through Art",
        subjects: ["Math", "Art"],
        gradeLevel: ["3", "4", "5"],
        description:
          "Students will learn about fractions by creating art projects that involve dividing shapes into equal parts and coloring them to represent different fractions.",
        objectives:
          "Understand fractions as parts of a whole. Compare fractions with like denominators. Represent fractions visually.",
        materialsNeeded: "Construction paper, scissors, glue, colored pencils, rulers",
        duration: "1 hour",
        instructions:
          "Begin by discussing fractions as parts of a whole. Show examples of fractions represented visually. Have students create their own fraction art by dividing shapes into equal parts and coloring them to represent different fractions. Display the artwork and have students explain their representations.",
        tags: ["fractions", "math", "art", "visual learning"],
        username: "sarah_teacher",
      },
      {
        lessonName: "Building Simple Machines",
        subjects: ["Science", "Engineering"],
        gradeLevel: ["4", "5"],
        description:
          "Students will learn about simple machines by designing and building their own examples using everyday materials.",
        objectives:
          "Identify the six types of simple machines. Understand how simple machines make work easier. Design and build working models of simple machines.",
        materialsNeeded: "Cardboard, wooden dowels, string, rubber bands, plastic bottles, tape, scissors",
        duration: "2 hours",
        instructions:
          "Introduce the six types of simple machines: lever, pulley, wheel and axle, inclined plane, wedge, and screw. Demonstrate how each one works. Divide students into groups and assign each group a simple machine to build. Provide materials and guidance as needed. Have groups present their machines and explain how they work.",
        tags: ["simple machines", "physics", "engineering", "hands-on", "STEM"],
        username: "john_educator",
      },
      {
        lessonName: "Poetry in Motion",
        subjects: ["English", "Physical Education"],
        gradeLevel: ["4", "5"],
        description:
          "Students will combine poetry and movement by creating and performing poems that incorporate physical actions.",
        objectives:
          "Understand different types of poetry. Create original poems. Express ideas through movement and words.",
        materialsNeeded: "Paper, pencils, open space for movement",
        duration: "45 minutes",
        instructions:
          "Begin by reading examples of action poems. Discuss how words can convey movement. Have students write their own action poems. Then have them create movements to accompany their poems. Students will perform their poems with movements for the class.",
        tags: ["poetry", "language arts", "movement", "expression"],
        username: "maria_instructor",
      },
      {
        lessonName: "Historical Time Capsule",
        subjects: ["History", "Art"],
        gradeLevel: ["4", "5"],
        description:
          "Students will create a time capsule representing a specific historical period, including artifacts, letters, and news items from that time.",
        objectives:
          "Research historical periods in depth. Understand daily life in different time periods. Create historically accurate artifacts.",
        materialsNeeded: "Shoeboxes, art supplies, research materials, access to computers for research",
        duration: "1 week",
        instructions:
          "Assign each student or group a different historical period. Have them research daily life, major events, and cultural aspects of that period. Students will create a time capsule containing at least five items that represent their historical period, including a newspaper, a letter from a person living in that time, and three artifacts. Students will present their time capsules to the class, explaining the significance of each item.",
        tags: ["history", "research", "project-based learning", "artifacts"],
        username: "david_professor",
      },
      {
        lessonName: "Coding with Scratch",
        subjects: ["Computer Science", "Math"],
        gradeLevel: ["3", "4", "5"],
        description:
          "Introduction to coding concepts using the Scratch visual programming language. Students will create simple animations and games while learning fundamental programming concepts.",
        objectives:
          "Understand basic programming concepts like loops and conditionals. Create simple programs using Scratch. Develop problem-solving skills through coding challenges.",
        materialsNeeded: "Computers with internet access, Scratch accounts",
        duration: "1 hour",
        instructions:
          "Begin with a brief introduction to Scratch interface. Demonstrate basic blocks and how to connect them. Guide students through creating a simple animation. Present a challenge for students to modify their animation or create a simple game. Allow time for students to share their creations.",
        tags: ["coding", "computer science", "Scratch", "programming", "STEM"],
        username: "sarah_teacher",
      },
      {
        lessonName: "Ecosystem in a Bottle",
        subjects: ["Science", "Environmental Studies"],
        gradeLevel: ["3", "4", "5"],
        description:
          "Students will create self-contained ecosystems in plastic bottles to observe and learn about ecological principles, nutrient cycles, and interdependence.",
        objectives:
          "Understand the components of an ecosystem. Observe the water cycle in a closed system. Learn about plant growth and decomposition.",
        materialsNeeded: "Clear 2-liter plastic bottles, small plants, soil, small rocks, water, scissors, tape",
        duration: "1 hour setup, ongoing observation",
        instructions:
          "Discuss ecosystems and their components. Demonstrate how to create a terrarium in a bottle. Have students create their own ecosystems with layers of rocks, soil, and plants. Seal the bottles and place them in a location with indirect sunlight. Have students observe and journal about changes over several weeks.",
        tags: ["ecosystems", "biology", "environmental science", "long-term project"],
        username: "john_educator",
      },
      {
        lessonName: "World Music Exploration",
        subjects: ["Music", "Social Studies"],
        gradeLevel: ["K", "1", "2", "3", "4"],
        description:
          "Students will learn about music from different cultures around the world, including instruments, rhythms, and cultural significance.",
        objectives:
          "Recognize music from different cultures. Understand how music reflects cultural values. Create simple instruments inspired by world music traditions.",
        materialsNeeded:
          "Audio recordings of world music, materials for making simple instruments (containers, beans, rice, rubber bands, cardboard)",
        duration: "45 minutes",
        instructions:
          "Begin by listening to music from a specific culture. Discuss the instruments, rhythms, and cultural context. Show pictures or videos of the instruments being played. Have students create simple versions of instruments from that culture. Allow students to play their instruments along with the recorded music.",
        tags: ["music", "cultural studies", "instruments", "global awareness"],
        username: "maria_instructor",
      },
      {
        lessonName: "Debate Club: Current Events",
        subjects: ["Social Studies", "English"],
        gradeLevel: ["5"],
        description:
          "Students will research current events and participate in structured debates, developing critical thinking, research, and public speaking skills.",
        objectives:
          "Research topics thoroughly from multiple perspectives. Construct logical arguments supported by evidence. Practice respectful debate techniques.",
        materialsNeeded: "Research materials, note cards, timer",
        duration: "1 hour",
        instructions:
          "Select an age-appropriate current event topic. Divide students into affirmative and negative teams. Provide time for research and preparation. Conduct a structured debate with timed segments for opening statements, rebuttals, and closing arguments. After the debate, discuss the strengths of arguments on both sides and what students learned about the topic.",
        tags: ["debate", "current events", "critical thinking", "public speaking"],
        username: "david_professor",
      },
      {
        lessonName: "Storytelling Through Photography",
        subjects: ["Art", "English"],
        gradeLevel: ["4","5"],
        description:
          "Students will learn to tell stories through photography, capturing images that convey narrative elements and emotions.",
        objectives:
          "Understand visual storytelling techniques. Use photography to communicate ideas and emotions. Create a cohesive visual narrative.",
        materialsNeeded: "Cameras or smartphones with cameras, access to photo printing or digital display",
        duration: "2 hours",
        instructions:
          "Discuss elements of visual storytelling and composition. Show examples of narrative photography. Assign students a theme or allow them to choose their own. Have students plan a 5-7 image photo story. Allow time for taking photos around the school or neighborhood. Have students arrange their photos in sequence and write brief captions. Share and discuss the photo stories.",
        tags: ["photography", "visual arts", "storytelling", "digital media"],
        username: "sarah_teacher",
      },
      {
        lessonName: "Geometry Scavenger Hunt",
        subjects: ["Math"],
        gradeLevel: ["3", "4", "5"],
        description:
          "Students will search for geometric shapes and concepts in the real world, reinforcing their understanding of geometry through practical application.",
        objectives:
          "Identify geometric shapes and concepts in everyday objects. Understand the practical applications of geometry. Document and classify geometric principles.",
        materialsNeeded: "Cameras or smartphones with cameras, geometry checklist, clipboards, pencils",
        duration: "45 minutes",
        instructions:
          "Review geometric shapes and concepts. Provide students with a checklist of shapes and concepts to find. Divide students into small groups and assign areas to search. Have students photograph examples of each item on their checklist. Return to class and share findings, discussing how geometry appears in everyday objects and architecture.",
        tags: ["geometry", "math", "scavenger hunt", "real-world application"],
        username: "john_educator",
      },
    ]

    const createdActivities = await Activity.insertMany(activities)
    console.log("Activities seeded successfully!")

    // Update users with their activities
    for (const activity of createdActivities) {
      await User.findOneAndUpdate({ username: activity.username }, { $push: { activities: activity._id } })
    }

    // Set up some saved activities
    // Sarah saves John's and Maria's activities
    const sarahUser = await User.findOne({ username: "sarah_teacher" })
    const johnActivities = await Activity.find({ username: "john_educator" })
    const mariaActivities = await Activity.find({ username: "maria_instructor" })

    await User.findByIdAndUpdate(sarahUser._id, {
      $push: { savedActivities: { $each: [johnActivities[0]._id, mariaActivities[0]._id] } },
    })

    // John saves David's activities
    const johnUser = await User.findOne({ username: "john_educator" })
    const davidActivities = await Activity.find({ username: "david_professor" })

    await User.findByIdAndUpdate(johnUser._id, { $push: { savedActivities: { $each: [davidActivities[0]._id] } } })

    // Maria saves Sarah's activities
    const mariaUser = await User.findOne({ username: "maria_instructor" })
    const sarahActivities = await Activity.find({ username: "sarah_teacher" })

    await User.findByIdAndUpdate(mariaUser._id, {
      $push: { savedActivities: { $each: [sarahActivities[0]._id, sarahActivities[1]._id] } },
    })

    console.log("User saved activities updated successfully!")

    // Seed discussions
    await seedDiscussions()

    console.log("All seeds completed successfully!")
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})
