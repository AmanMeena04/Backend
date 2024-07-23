const router = require('express').Router();
const User = require('../models/user');
const Project = require('../models/Project');
const jwtVerify = require('./auth');
// Create a new project
router.post('/create', async (req, res) => {
    const { projectName, reason, type, division, category, priority, department, location, status,action, userId } = req.body;

    try {      
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      };

      const newProject = new Project({
        projectName,
        reason,
        type,
        division,
        category,
        priority,
        department,
        location,
        status,
        action,
        user: user._id
      });
  
      await newProject.save();
      
      // Add project reference to user
      user.projects.push(newProject);
      await user.save();
  
      res.status(201).send(newProject);
    } catch (error) {
      res.status(400).send(error);
    }
});

router.put('/update', jwtVerify, async (req, res) => {
        
  const { projectName, reason, type, division, category, priority, department, location, status, action } = req.body;
  // const id = req.params.id;

  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).send('User not found');
    };
    const newProject = new Project({
      projectName,
      reason,
      type,
      division,
      category,
      priority,
      department,
      location,
      status,
      action,
      user: user._id
    });

    await newProject.save();
    
    // Add project reference to user
    user.projects.push(newProject);
    await user.save();

    res.status(201).send(newProject);
  } catch (error) {
    res.status(400).send(error);
  }
});
  // Get all projects
router.get('/read', async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).send(projects);
    } catch (error) {
      res.status(500).send(error);
    }
});

router.put('/action', jwtVerify, async(req, res)=> {
  const {action} = req.body;
  
  if(!req.userId) {
    res.json({msg:'You have restricted'});
  };

  const updateAction = await Project.findByIdAndUpdate(req.userId, {action:action});
  res.json({user:updateAction});
});

router.get('/count', async(req, res)=> {
try{
  const totalProject = await Project.countDocuments();
  const runningProject = await Project.countDocuments({ action: 'Start' });
  const closedProject = await Project.countDocuments({ action: 'close' });
  const cancelProject = await Project.countDocuments({ action: 'cancel' });
  res.json({totalProject:totalProject, runningProject:runningProject, closedProject:closedProject, cancelProject:cancelProject});
}
catch(error) {
res.send(error);
}
});

router.delete('/delete', async(req, res)=> {

  const del = await Project.findByIdAndDelete(req.id);
  res.json(del);
});

module.exports = router;