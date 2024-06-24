const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Get a thought by id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.json(thought);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // POST create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.status(201).json({ message: 'Thought created successfully', thought });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // PUT update a thought by id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.status(200).json({ message: 'Thought updated successfully', thought });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // DELETE a thought by id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.status(200).json({ message: 'Thought deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Add a reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.status(200).json({ message: 'Reaction added successfully', thought });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // Delete a reaction from a thought
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }
      res.status(200).json({ message: 'Reaction deleted successfully', thought });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};
