const express = require("express");

const Posts = require("../data/db");

const router = express.Router();

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    Posts.insert(req.body)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((error) => {
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  }
});

router.get("/", (req, res) => {
  // console.log(req.query);
  Posts.find(req.query)
    .then((post) => {
      // note the "200" response... 2xx responses are "success" responses.
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  
  Posts.findById(id)
    .then((post) => {
      if(post.length > 0){
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: `The post with the specified ID: ${id} does not exist.`
        })
      }


      
    })
    .catch((error) => {
      res.status(500).json({
        message: `The post with the specified ID ${id} could not be removed`,
        error: "The post could not be removed"
      });
    });
});

router.delete("/:id", (req, res) => {
  Posts.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "This post has been deleted" });
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error removing the post",
        error: "The post could not be removed",
      });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    const changes = req.body;
    Posts.update(id, changes)
      .then((post) => {
        if (post) {
            res.status(200).json(changes);
        } else {
          res
            .status(404)
            .json({
              message: "The post with the specified ID does not exist.",
            });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: `Error updating the post ${id}`,
          error: "The post information could not be modified.",
        });
      });
  }
});

//comments routers

router.post("/:id/comments", async (req, res) => {
  const id = req.params.id;
  const commentInfo = { ...req.body, post_id: id };
  //console.log(id);
  const { text } = req.body;
  if (!text) {
    res.status(400).json({
      errorMessage: "Please provide text for the comment.",
    });
  } else {
      try {
        const thisComment = await Posts.insertComment(commentInfo);
        res.status(201).json(commentInfo);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
  }
});

router.get("/:id/comments", async (req, res) => {
  const id = req.params.id;
  //console.log(id);

  try {
    const message = await Posts.findPostComments(id);
    //console.log(message);
    if (message.length > 0) {
      res.status(200).json(message);
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: `The comments for the post with the specified ID: ${id} does not exist.`,
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        error: "The comments information could not be retrieved.",
        message: err,
      });
  }
});

module.exports = router;
