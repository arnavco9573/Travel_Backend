import Tour from "../models/Tour.js";

// create new tour for admin pannel
export const createTour = async (req, res) => {
  const newTour = new Tour(req.body);
  try {
    const savedTour = await newTour.save();
    res.status(200).json({
      success: true,
      message: "Successfully created",
      data: savedTour,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create. Try again" });
  }
};

// update Tour
export const updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: updatedTour,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: "Failed to Update",
    });
  }
};

// delete Tour
export const deleteTour = async (req, res) => {
  const id = req.params.id;

  try {
    await Tour.findByIdAndDelete(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Delete",
    });
  }
};

// getSingle Tour
export const getSingleTour = async (req, res) => {
  const id = req.params.id;

  try {
    const tour = await Tour.findById(id).populate("reviews");

    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not Found",
    });
  }
};

// getAll Tour
export const getAllTour = async (req, res) => {
  // for pagination
  const page = parseInt(req.query.page);

  try {
    const tours = await Tour.find({})
      .populate("reviews")
      .skip(page * 8)
      .limit(8);
    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Fetched Successfully",
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not Found",
    });
  }
};

// get tour by search

export const getTourBySearch = async (req, res) => {
  const city = new RegExp(req.query.city, "i");
  const distance = parseInt(req.query.distance);
  const maxGroupSize = parseInt(req.query.maxGroupSize);

  try {
    // gte means greater than equal
    const tours = await Tour.find({
      city,
      distance: { $gte: distance },
      maxGroupSize: { $gte: maxGroupSize },
    }).populate("reviews");
    res.status(200).json({
      success: true,
      message: "Fetched Successfully",
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not Found",
    });
  }
};

// get featured Tour
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate("reviews")
      .limit(8);
    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Fetched Successfully",
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not Found",
    });
  }
};

// get tour counts
export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();
    res.status(200).json({ success: true, data: tourCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "failed  to fetch" });
  }
};
