const Section = require('../models/Section');

exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find({ isActive: true })
      .populate('adviser', 'name email')
      .sort({ name: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sections', error: error.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    const { name, grade, telegramChannel, adviser } = req.body;
    
    const section = new Section({
      name,
      grade,
      telegramChannel,
      adviser
    });

    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create section', error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const section = await Section.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update section', error: error.message });
  }
};