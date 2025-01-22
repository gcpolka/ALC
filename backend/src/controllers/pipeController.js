const pipeModel = require("../models/pipeModel");

// Create a new pipe
const createPipe = async (req, res) => {
    try {
        const { pipe } = req.body;

        const newPipe = new pipeModel({
            pipe,
        });

        await newPipe.save();

        res.status(201).json({ message: "Pipe created successfully", data: newPipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// List all pipes
const listPipe = async (req, res) => {
    try {
        const pipes = await pipeModel.find();
        res.status(200).json({ message: "Pipes retrieved successfully", data: pipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a pipe by ID
const getPipeById = async (req, res) => {
    try {
        const { id } = req.params;

        const pipe = await pipeModel.findById(id);
        if (!pipe) {
            return res.status(404).json({ message: "Pipe not found" });
        }

        res.status(200).json({ message: "Pipe retrieved successfully", data: pipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a pipe
const updatePipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { pipe } = req.body;

        const updatedPipe = await pipeModel.findByIdAndUpdate(
            id,
            { pipe },
            { new: true, runValidators: true }
        );

        if (!updatedPipe) {
            return res.status(404).json({ message: "Pipe not found" });
        }

        res.status(200).json({ message: "Pipe updated successfully", data: updatedPipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a pipe
const deletePipe = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedPipe = await pipeModel.findByIdAndDelete(id);
        if (!deletedPipe) {
            return res.status(404).json({ message: "Pipe not found" });
        }

        res.status(200).json({ message: "Pipe deleted successfully", data: deletedPipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createPipe,
    listPipe,
    getPipeById,
    updatePipe,
    deletePipe,
};
