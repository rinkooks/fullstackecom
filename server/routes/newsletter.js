const express = require("express");
const Newsletter = require("../models/Newsletter");

const router = express.Router();

router.post("/subscribe", async(req,res)=>{

    try{

        const exists = await Newsletter.findOne({
            email:req.body.email
        });

        if(exists){
            return res.json({
                success:false,
                message:"Email already subscribed."
            });
        }

        await Newsletter.create({
            email:req.body.email
        });

        res.json({
            success:true,
            message:"Subscribed Successfully."
        });

    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});

router.get("/", async (req, res) => {
  try {
    const newsletterList = await Newsletter.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      newsletterList,
      total: newsletterList.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/count", async (req, res) => {
  try {
    const total = await Newsletter.countDocuments();

    res.status(200).json({
      success: true,
      total
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.delete("/:id", async (req, res) => {
  try {

    const newsletter = await Newsletter.findByIdAndDelete(req.params.id);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Subscriber deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;