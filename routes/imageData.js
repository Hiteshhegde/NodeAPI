const express = require("express");
const router = express.Router();
const userData = require("../models/imageData");
const fs = require("fs");
upload = require("../middlewares/uploader");
validator = require("../middlewares/validator");
// var jsonParser = bodyParser.json();
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get("/", (req, res) => {
  userData
    .find()
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.post("/add", (req, res) => {
  user = new userData({
    email: req.body.email,
    username: req.body.username,
  });
  user
    .save()
    .then(() => res.json("New article added"))
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.post("/create/response/:mailid", (req, res) => {
  userData
    .findOneAndUpdate(
      { email: req.params.mailid },
      {
        $push: {
          responses: req.body.response,
        },
      }
    )
    .then((data) => {
      res.json({ message: "New article added", data });
    })
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.get("/response/:mailid/:uid", (req, res) => {
  userData
    .findOne({
      email: req.params.mailid,
      "response.uniqueFormId": req.params.uid,
    })
    .then((data) => {
      for (var i in data.responses) {
        if (data.responses[i].uniqueFormId == req.params.uid) {
          res.status(200).json(data.responses[i].answers);
        }
      }

      res.status(404).json("No responses");
    })
    .catch((err) => res.status(404).json({ error: err }));
});
router.put("/add/response/:mailid/:uid", (req, res) => {
  userData
    .findOneAndUpdate(
      { email: req.params.mailid, "responses.uniqueFormId": req.params.uid },
      {
        $push: {
          "responses.$.answers": req.body.answers,
        },
      }
    )
    .then((data) => {
      res.json({ message: "New article added", data });
    })
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.delete("/remove/response/:mailid/:uid", (req, res) => {
  userData
    .findOneAndUpdate(
      {
        email: req.params.mailid,
        "responses.uniqueFormId": req.params.uid,
      },
      {
        // const array = "responses.$[response].answers"
        $set: {
          "responses.$[response].answers": [],
        },
      },
      {
        arrayFilters: [
          {
            "response.uniqueFormId": req.params.uid,
            // "response.answers[1]": req.params.posuid,
          },
          // {
          //   "answer"
          // },
        ],
      }
    )
    .then((data) => res.json({ data: " Article Deleted " + data }))
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.put("/add/image/:mailid", upload, validator, (req, res) => {
  userData
    .findOneAndUpdate(
      { email: req.params.mailid },
      {
        $push: {
          imageHolder: {
            formid: req.body.formid,
            desc: req.body.desc,
            image: req.file.filename,
          },
        },
      }
    )
    .then(() => res.json("New article added"))
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.patch(
  "/replace/image/:mailid/:uid/:fname",
  upload,
  validator,
  (req, res) => {
    try {
      fs.unlinkSync("./client/totext/public/uploads/" + req.params.fname);
      //file removed
    } catch (err) {
      console.error(err);
    }
    userData
      .findOneAndUpdate(
        { email: req.params.mailid, "imageHolder.formid": req.params.uid },
        {
          $set: {
            "imageHolder.$.image": req.file.filename,
          },
        }
      )
      .then(() => {
        res.json("New article added");
      })
      .catch((err) => res.status(400).json({ Error: "Error " + err }));
  }
);
router.put("/add/form/:mailid/:formid", (req, res) => {
  userData
    .findOneAndUpdate(
      { "forms._id": req.params.formid },
      {
        $push: {
          "forms.$.questions": req.body.questions,
        },
      }
    )
    .then((data) => res.status(201).json({ Stat: "created : ", data }))
    .catch((err) => res.status(500).json({ Error: "Error " + err }));
});
router.patch("/queschange/:mailid/:ufid", (req, res) => {
  userData
    .findOneAndUpdate(
      { "forms.uniqueFormId": req.params.ufid },
      {
        $set: {
          "forms.$.questions": req.body.questions,
        },
      }
    )
    .then((data) => res.status(201).json({ Stat: "updated : ", data }))
    .catch((err) => res.status(500).json({ Error: "Error " + err }));
});
router.get("/form/:formid", (req, res) => {
  userData
    .findOne({ "forms._id": req.params.formid })
    .then((data) => {
      var replace = data.email;
      for (let i in data.forms) {
        if (data.forms[i]._id == req.params.formid) {
          res.status(200).json({
            data: data.forms[i],
            email: replace,
          });
        }
      }
      res.status(404).json("could'nt find a form");
    })
    .catch((err) => res.status(404).json({ Error: "Error " + err }));
});

router.get("/image/:formid", (req, res) => {
  userData
    .findOne({ "forms._id": req.params.formid })
    .then((data) => {
      let userImages = data.imageHolder;
      res.status(200).json(userImages);
    })
    .catch((err) => res.status(404).json(err));
});
router.put("/add/form/:mailid", (req, res) => {
  userData
    .findOneAndUpdate(
      { email: req.params.mailid },
      {
        $push: {
          forms: req.body.forms,
        },
      }
    )
    .then((data) => {
      res.json({ message: "New article added", data });
    })
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.get("/:mailid", (req, res) => {
  userData
    .findOne({ email: req.params.mailid })
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(404).json(err));
});
router.patch("/pagename/:mailid/:ufid", (req, res) => {
  userData
    .findOneAndUpdate(
      { email: req.params.mailid, "forms.uniqueFormId": req.params.ufid },
      {
        $pull: {
          forms: { uniqueFormId: req.params.ufid },
        },
      }
    )
    .then((data) => {
      res.json({ message: "New article added", data });
    })
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.patch("/pagedesc/:mailid/:ufid", (req, res) => {
  userData
    .findOneAndUpdate(
      { email: req.params.mailid, "imageHolder.formid": req.params.ufid },
      {
        $set: {
          "imageHolder.$.desc": req.body.desc,
        },
      }
    )
    .then((data) => {
      res.json({ message: "New article added", data });
    })
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.delete("/delete/form/:email/:uid", (req, res) => {
  userData
    .findOneAndUpdate(
      {
        email: req.params.email,
        "forms.uniqueFormId": req.params.uid,
      },
      {
        $set: {
          "forms.$": {},
        },
      }
    )
    .then((data) => {
      res.json({ message: "New article added", data });
    })
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
router.delete("/delete/image/:mailid/:uid/:fname", (req, res) => {
  try {
    fs.unlinkSync("./client/totext/public/uploads/" + req.params.fname);
    //file removed
  } catch (err) {
    console.error(err);
  }
  userData
    .findOneAndUpdate(
      { email: req.params.mailid, "imageHolder.formid": req.params.uid },
      {
        $set: {
          "imageHolder.$.image": "",
          "imageHolder.$.desc": "",
          "imageHolder.$.formid": "",
        },
      }
    )
    .then(() => {
      res.json("New article added");
    })
    .catch((err) => res.status(400).json({ Error: "Error " + err }));
});
module.exports = router;
