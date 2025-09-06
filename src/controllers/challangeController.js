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
  TasksSublevels,User
} = require('../models')
const {
  ValidateCreateChallange,
  ValidateCreate2Challange,
  ValidateTeacherChallange,
  ValidateCreate1Challange
} = require('../validations/challangeValidation')
const { date } = require('joi')

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
   
    const studentId = req.user.id
const challange = await Challenge.findOne({
  where :{student_id : studentId}
})
if(!challange){
  return res.status(200).json({
    message : "not found challenge for this student " ,date :[]
  })
}
   const challengeTask = await ChallengeTask.findAll({
  where: { challenge_id: challange.id},
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
if (challengeTask.length === 0) {
  return res.status(200).json({ message: 'No tasks found for this challenge.' });
}

const result = challengeTask.map(ct => ({
  id: ct.id,
  challenge_id: ct.challenge_id,
  is_done: ct.is_done,
  task: ct.task,
  sublevel: ct.sublevel
}));


    const wallet = await Wallet.findOne({
       where: { student_id: studentId } ,
      include: [
        {
          model: User,
          as: 'student',
        }
      ]
      })

    if (!wallet) {
      return res.status(404).json({ message: "You don't have a wallet" })
    }


    return res.status(200).json({
      message: 'Age group retrieved successfully',
      task: result,
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

    if (task.name === 'قران') {
      quranTask.push(task)
      continue
    } else {
      await ChallengeTask.create({
        challenge_id: challenge.id,
        task_id: task.id
      })
    }
  }

  return { quranTask }
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

    if (existingChallenge) {
      return res.status(400).json({ message: "This user already has a challenge" });
    }

    const challenge = await Challenge.create({
      student_id: studentId,
      teacher_id: req.body.teacher_id
    })

    const ageGroupId = parseInt(req.params.id)

    if (ageGroupId === 1) {
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
      const { quranTask } = await handleComplexChallenge(
        challenge,
        ageGroupId
      )

      return res.status(200).json({
        message:
          'Challenge created. Choose the Quran task and appropriate level.',
        challenge_id: challenge.id,
        quran: quranTask,
      })
    }

    return res.status(400).json({ message: 'Invalid age group id' })
  } catch (err) {
    console.error('Database error:', err)

    return res.status(500).json({
      message: 'Internal server error',
      details: err.stack // 
    })
  }
})
////////////////////////
const createLevel1 = asyncHandler(async (req, res) => {
  const { error } = ValidateCreate1Challange(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const challengeId = req.params.id;
  const taskQuranId = req.body.taskQuranId;

  const existingTask = await ChallengeTask.findOne({
    where: { challenge_id: challengeId, task_id: taskQuranId }
  });

  if (existingTask) {
    return res.status(400).json({ message: 'The task already assigned to this challenge' });
  }

  const existingTasks = await ChallengeTask.findAll({
    where: { challenge_id: challengeId },
    include: [
      { model: Task, as: 'task' }
    ]
  });

  for (const challengeTask of existingTasks) {
    if (challengeTask.task?.name === 'قران') {
      return res.status(403).json({ message: 'This challenge already has a task named Quran' });
    }
  }

  const task = await Task.findOne({ where: { id: taskQuranId } });
  if (!task) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  if (task.name !== 'قران') {
    return res.status(400).json({ message: "This task's name is not Quran." });
  }

  await ChallengeTask.create({
    challenge_id: challengeId,
    task_id: taskQuranId
  });

  const challengeTasks = await ChallengeTask.findAll({
    where: { challenge_id: challengeId }
  });

  const tasksWithSublevels = [];

  for (const challengeTask of challengeTasks) {
    const taskSublevels = await TasksSublevels.findAll({
      where: { task_id: challengeTask.task_id }
    });

    const subLevels = [];

    for (const taskSublevel of taskSublevels) {
      const subLevel = await Sublevel.findOne({
        where: { id: taskSublevel.sublevel_id }
      });

      if (subLevel) subLevels.push(subLevel);
    }

    if (challengeTask.sublevel_id !== null) {
      if(subLevels.length !=0){
           tasksWithSublevels.push({
        challange_task: challengeTask,
        subLevels
      }); 
      }
  
    }
  }

  return res.status(200).json({
    message: 'Added Quran task to challenge. Here are all tasks for this challenge.',
    result: tasksWithSublevels
  });
});


/////////////////////////////// put id challange and this step the last step for create challengeTask=>admin
const createLevel2 = asyncHandler(async (req, res) => {
  const { error } = ValidateCreate2Challange(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const challangeId = req.params.id;

  const existingTask = await ChallengeTask.findOne({
    where: { challenge_id: challangeId }
  });

  if (!existingTask) {
    return res.status(404).json({ message: 'Challenge not found' });
  }

  const data = [];
  const dataItems = req.body.data;

  for (const dataItem of dataItems) {
    const task = await ChallengeTask.findOne({
      where: {
        challenge_id: challangeId,
        task_id: dataItem.task_id
      }
    });

    if (!task) {
      return res
        .status(404)
        .json({ message: `Task with id ${dataItem.task_id} not found` });
    }

    const tasks_sublevels = await TasksSublevels.findOne({
      where: {
        sublevel_id: dataItem.lavel_id, 
        task_id: dataItem.task_id
      }
    });

    if (!tasks_sublevels) {
      return res.status(404).json({ message:` Level not found for this task id = ${dataItem.task_id}.` });
    }

    task.sublevels_id = dataItem.lavel_id || task.sublevels_id;
    await task.save();

    if (task.sublevels_id !== null) {
      data.push(task);
    }
  }

  const filteredTasks = data.filter(task => task.sublevels_id !== null);

  return res.status(200).json({
    message: 'Finish create challenge',
    updatedTasks: filteredTasks
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////
const challangeTeasher = asyncHandler(async (req, res) => {
  const { error } = ValidateTeacherChallange(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const studentId = req.params.id;

  const challenge = await Challenge.findOne({
    where: { student_id: studentId }
  });

  if (!challenge) {
    return res.status(404).json({ message: 'Challenge not found' ,date :[]});
  }

  const wallet = await Wallet.findOne({ where: { student_id: studentId } });
  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  const updatedTasks = [];
  const dataItems = req.body.data;

  let totalPointsToAdd = 0;

  for (const dataItem of dataItems) {
    const challengeTasks = await ChallengeTask.findAll({
      where: {
        challenge_id: challenge.id,
        task_id: dataItem.task_id
      }
    });

    for (const task of challengeTasks) {
      if (dataItem.is_done !== undefined) {
        const oldStatus = task.is_done;
        const newStatus = dataItem.is_done;

        // تحديث حالة المهمة
        task.is_done = newStatus;
        await task.save();
        updatedTasks.push(task);

        // حساب النقاط فقط إذا تغيرت الحالة
        if (oldStatus !== newStatus) {
          if (newStatus === true) {
            if (task.sublevels_id !== null) {
              const sublevel = await Sublevel.findOne({
                where: { id: task.sublevels_id }
              });

              if (!sublevel) {
                return res.status(404).json({ message: 'Sublevel not found' });
              }

              console.log(` Adding ${sublevel.point} points from sublevel`);
              wallet.scores += sublevel.point;
              totalPointsToAdd += sublevel.point;
            } else {
              const taskCh = await Task.findOne({
                where: { id: dataItem.task_id }
              });

              if (!taskCh) {
                return res.status(404).json({ message: 'Task not found' });
              }

              console.log(`Adding ${taskCh.point} points from task`);
              wallet.scores += taskCh.point;
              totalPointsToAdd += taskCh.point;
            }
          } else if (newStatus === false) {
            if (task.sublevels_id !== null) {
              const sublevel = await Sublevel.findOne({
                where: { id: task.sublevels_id }
              });

              if (!sublevel) {
                return res.status(404).json({ message: 'Sublevel not found' });
              }

              console.log(` Removing ${sublevel.point} points from sublevel`);
              wallet.scores -= sublevel.point;
              totalPointsToAdd -= sublevel.point;
            } else {
              const taskCh = await Task.findOne({
                where: { id: dataItem.task_id }
              });

              if (!taskCh) {
                return res.status(404).json({ message: 'Task not found' });
              }

              console.log(` Removing ${taskCh.point} points from task`);
              wallet.scores -= taskCh.point;
              totalPointsToAdd -= taskCh.point;
            }
          }

          await wallet.save();
        }
      }
    }
  }

  return res.status(200).json({
    message: `Tasks updated successfully. ${totalPointsToAdd} points ${totalPointsToAdd >= 0 ? 'added to' : 'removed from'} wallet.`,
    updatedTasks,
    wallet
  });
});



/////////////////////////////////////////////////////////////////////////////////////////////////////
const AllTaskChallenge = asyncHandler (async (req,res)=>{
  try{
const studentId = req.params.id;
const challange = await Challenge.findOne({
  where :{student_id : studentId}
})
if(!challange){
  return res.status(404).json({
    message : "not found challenge for this student ",date :[]
  })
}
   const challengeTask = await ChallengeTask.findAll({
  where: { challenge_id: challange.id},
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
if (challengeTask.length === 0) {
  return res.status(200).json({ message: 'No tasks found for this challenge.' ,date :[]});
}

const result = challengeTask.map(ct => ({
  id: ct.id,
  challenge_id: ct.challenge_id,
  is_done: ct.is_done,
  task: ct.task,
  sublevel: ct.sublevel
}));

return res.status(200).json({
  message: 'Fetched all tasks for this challenge successfully.',
  data: result
});

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
  createLevel1,
AllTaskChallenge
}
