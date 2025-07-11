const asyncHandler = require('express-async-handler')
const { where } = require('sequelize')
const {
  Wallet,
  Task,
  TaskAgeGroup,
  Sublevel,
  ChallengeTask,
  Challenge,
  AgeGroup,
  TasksSublevels
} = require('../models')
const {
  ValidateCreateChallange,
  ValidateCreate2Challange,
  ValidateTeacherChallange,
  ValidateCreate1Challange
} = require('../validations/challangeValidation')

/////////////////// show all age groups =>(student , admin)
const AllAgeGroups = asyncHandler(async (req, res) => {
  try {
    const ageGroups = await AgeGroup.findAll()
    if (!ageGroups) {
      return res.status(404).json({ message: 'Not found' })
    }
    return res.status(200).json({
      message: 'All age groups',
      ageGroups
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

/////////////// show group by id =>studentOnly
const AgeGroupById = asyncHandler(async (req, res) => {
  try {
    const ID = Number(req.params.id) // ✅ تصحيح اسم الباراميتر وتحويله لرقم

    const ageGroupById = await AgeGroup.findOne({ where: { id: ID } })

    if (!ageGroupById) {
      return res.status(404).json({ message: 'Not found' })
    }

    const studentId = req.user.id
    const wallet = await Wallet.findOne({ where: { student_id: studentId } })

    if (!wallet) {
      return res.status(404).json({ message: "You don't have a wallet" })
    }

    return res.status(200).json({
      message: 'Age group retrieved successfully',
      ageGroup: ageGroupById,
      wallet: wallet
    })
  } catch (err) {
    console.error('Database error:', err)
    return res.status(500).json({
      message: 'Database error',
      details: err.message
    })
  }
})

////////////put id age Id ///create challenge for student =>admin
const handleComplexChallenge = async (challenge, ageGroupId) => {
  const taskAgeGroups = await TaskAgeGroup.findAll({
    where: { age_groups_id: ageGroupId },
    include: [{ model: Task, as: 'task' }]
  })

  const quranTask = []
  const tasksWithSublevels = []

  for (const group of taskAgeGroups) {
    const task = group.task
    if (!task) continue

    if (task.name === 'Quran') {
      quranTask.push(task)
      continue
    } else {
      await ChallengeTask.create({
        challenge_id: challenge.id,
        task_id: task.id
      })
    }

    if (task.is_sublevels == true) {
      const taskSublevels = await TasksSublevels.findAll({
        where: { task_id: task.id }
      })

      const subLevels = []
      for (const taskSublevel of taskSublevels) {
        const subLevel = await Sublevel.findOne({
          where: { id: taskSublevel.sublevel_id }
        })

        if (subLevel) {
          subLevels.push(subLevel)
        }
      }

      tasksWithSublevels.push({
        task,
        subLevels
      })
    }
  }

  return { quranTask, tasksWithSublevels }
}

const createChallenge = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateCreateChallange(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message })
    }

    const studentId = req.body.student_id

    const existingChallenge = await Challenge.findOne({
      where: { student_id: studentId }
    })

    // if (existingChallenge) {
    //   return res.status(400).json({ message: "This user already has a challenge" });
    // }

    const challenge = await Challenge.create({
      student_id: studentId,
      teacher_id: req.body.teacher_id
    })

    const ageGroupId = parseInt(req.params.id)

    if (ageGroupId === 1) {
      // جلب جميع العلاقات بين العمر والمهام
      const taskAgeGroups = await TaskAgeGroup.findAll({
        where: { age_groups_id: ageGroupId }
      })

      const taskIds = taskAgeGroups.map(group => group.tasks_id)
      const tasks = await Task.findAll({
        where: { id: taskIds }
      })

      const challengeTasks = await Promise.all(
        tasks.map(task =>
          ChallengeTask.create({
            challenge_id: challenge.id,
            task_id: task.id
          })
        )
      )

      return res.status(200).json({
        message: 'All tasks created for this student.',
        challenge_id: challenge.id,
        challangeTaskCreate: challengeTasks
      })
    }

    if ([2, 3, 4].includes(ageGroupId)) {
      const { quranTask, tasksWithSublevels } = await handleComplexChallenge(
        challenge,
        ageGroupId
      )

      return res.status(200).json({
        message:
          'Challenge created. Choose the Quran task and appropriate level.',
        challenge_id: challenge.id,
        quran: quranTask,
        tasks_with_sublevels: tasksWithSublevels
      })
    }

    return res.status(400).json({ message: 'Invalid age group id' })
  } catch (err) {
    console.error('Database error:', err)

    return res.status(500).json({
      message: 'Internal server error',
      details: err.stack // 👈 يعرض السطر والموقع الكامل للخطأ
    })
  }
})
////////////////////////
const createLevel1 = asyncHandler(async (req, res) => {
  try {
    const { error } = ValidateCreate1Challange(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const challangeId = req.params.id;

    // التأكد من عدم تكرار المهمة
    const existingQuranTask = await ChallengeTask.findOne({
      where: {
        challenge_id: challangeId,
        task_id: req.body.taskQuranId
      }
    });

    if (existingQuranTask) {
      return res
        .status(400)
        .json({ message: 'Quran task already assigned to this challenge' });
    }

    // إضافة المهمة
    await ChallengeTask.create({
      challenge_id: challangeId,
      task_id: req.body.taskQuranId
    });

    // جلب جميع المهام المرتبطة بالتحدي
    const challengeTasks = await ChallengeTask.findAll({
      where: { challenge_id: challangeId }
    });

    const tasksWithSublevels = [];

    for (const task of challengeTasks) {
      const taskSublevels = await TasksSublevels.findAll({
        where: { task_id: task.task_id }
      });

      const subLevels = [];

      for (const taskSublevel of taskSublevels) {
        const subLevel = await Sublevel.findOne({
          where: { id: taskSublevel.sublevel_id }
        });

        if (subLevel) {
          subLevels.push(subLevel);
        }
      }

      tasksWithSublevels.push({
        task,
        subLevels
      });
    }

    return res.status(200).json({
      message: 'Added Quran task to challenge. Here are all tasks for this challenge.',
      result: tasksWithSublevels
    });
  } catch (err) {
    console.error('Database error:', err);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

/////////////////////////////// put id challange and this step the last step for create challengeTask=>admin
const createLevel2 = asyncHandler(async (req, res) => {
  try{const { error } = ValidateCreate2Challange(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const challangeId = req.params.id

  const existingTask = await ChallengeTask.findOne({
    where: { Challenge_id: challangeId }
  })

  if (!existingTask) {
    return res.status(404).json({ message: 'not found' })
  }

  const data = []
  const dataItems = req.body.data

  for (const dataItem of dataItems) {
    const task = await ChallengeTask.findOne({
      where: {
        challenge_id: challangeId,
        task_id: dataItem.task_id
      }
    })

    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id ${dataItem.task_id} not found` })
    }

    task.level_id = dataItem.lavel_id || task.level_id
    await task.save()
    data.push(task)
  }

  return res.status(200).json({
    message: 'Finish create challenge',
    updatedTasks: data
  })}catch (err) {
    console.error('Database error:', err)

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
  
})

/////////////////////////////////////////////////////////////////////////////////////////////////
const challangeTeasher = asyncHandler(async (req, res) => {
  const { error } = ValidateTeacherChallange(req.body)
  if (error) {
    return res.status(400).json({ message: error.details[0].message })
  }

  const studentId = req.params.id
  const challange = await Challenge.findOne({
    where: { student_id: studentId }
  })

  if (!challange) {
    return res.status(404).json({ message: 'Challenge not found' })
  }

  const wallet = await Wallet.findOne({ where: { student_id: studentId } })
  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' })
  }

  const data = []
  let totalPointsToAdd = 0
  const dataItems = req.body.data

  for (const dataItem of dataItems) {
    const challengeTasks = await ChallengeTask.findAll({
      where: {
        challange_id: challange.id,
        task_id: dataItem.task_id
      }
    })

    for (const task of challengeTasks) {
      task.is_done = dataItem.is_done ?? task.is_done
      await task.save()
      data.push(task)

      if (task.is_done) {
        const sublevels = await Sublevel.findOne({
          where: { id: task.sublevels_id }
        })

        if (!sublevels) {
          return res.status(404).json({ message: 'Sublevel not found' })
        }

        totalPointsToAdd += sublevels.point
      }
    }
  }

  wallet.scores += totalPointsToAdd
  await wallet.save()

  return res.status(200).json({
    message: 'Tasks updated successfully',
    data,
    wallet
  })
})
/////////////////////////////////////////////////////////////////////////////////////////////////////
const AllTaskChallenge = asyncHandler (async (req,res)=>{
  try{
const challangeId = req.params.id;
   const challengeTask = await ChallengeTask.findAll({
  where: { challenge_id: challangeId},
  include: [
    {
      model: Task,
      as: 'task'
    },
    {
      model: Sublevel,
      as: 'sublevel'
    }
  ]
});

    if (!challengeTask) {
      return res.status(200).json({ message: 'not found' })
    }
    ////هي منشان حدد شو بدي ينعرض
const result = challengeTask.map(ct => ({
  id: ct.id,
  challenge_id: ct.challenge_id,
  is_done: ct.is_done,
  task: ct.task,
  sublevel: ct.sublevel
}));

    return res.status(200).json({
      message:
        'Added Quran task to challenge. Here are all tasks for this challenge.',
         result
    })
  } catch (err) {
    console.error('Database error:', err)

    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

module.exports = {
  AllAgeGroups,
  AgeGroupById,
  createChallenge,
  createLevel2,
  challangeTeasher,
  createLevel1
}
