const Template = require('../models/Template');

exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find({ isActive: true })
      .sort({ usageCount: -1, createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch templates', error: error.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { name, content, category } = req.body;
    
    const template = new Template({
      name,
      content,
      category,
      createdBy: req.userId || 'test_user_id'
    });

    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create template', error: error.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const template = await Template.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update template', error: error.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete template', error: error.message });
  }
};