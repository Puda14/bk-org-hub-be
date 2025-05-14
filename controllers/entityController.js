const Entity = require("../models/Entity");

// Get all entities
exports.getEntities = async (req, res) => {
  try {
    const entities = await Entity.find();
    res.json(entities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get entity by id
exports.getEntityById = async (req, res) => {
  try {
    const entity = await Entity.findById(req.params.id);
    if (!entity) return res.status(404).json({ message: "Entity not found" });
    res.json(entity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new entity
exports.createEntity = async (req, res) => {
  try {
    const newEntity = new Entity(req.body);
    await newEntity.save();
    res.status(201).json(newEntity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update entity by id
exports.updateEntity = async (req, res) => {
  try {
    const updatedEntity = await Entity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEntity)
      return res.status(404).json({ message: "Entity not found" });
    res.json(updatedEntity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete entity by id
exports.deleteEntity = async (req, res) => {
  try {
    const deletedEntity = await Entity.findByIdAndDelete(req.params.id);
    if (!deletedEntity)
      return res.status(404).json({ message: "Entity not found" });
    res.json({ message: "Entity deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
