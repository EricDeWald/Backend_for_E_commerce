const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// find all categories
// be sure to include its associated Products

router.get('/', async(req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product },{ model: Tag }],
    });
    res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // find one category by its `id` value
  // be sure to include its associated Products
  router.get('/:id', async (req, res) => {
    try {
      const categoryData = await Category.findByPk(req.params.id, {
        include: [{ model: Products }],
      });
      if (!categoryData) {
        res.status(404).json({ message: 'No category data found with that id!' });
        return;
      }
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  })
  .then((createdCategory) => res.status(200).json(createdCategory))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});
  // update a category by its `id` value
router.put('/:id', (req, res) => {

  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // find all associated tags from CatagoryTag
      return CatagoryTag.findAll({ where: { category_id: req.params.id } });
    })
    .then((categoryTags) => {
      // get list of current tag_ids
      const categoryTagIds = categoryTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newCatagoryTags = req.body.tagIds
        .filter((tag_id) => !categoryTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            category_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const categoryTagsToRemove = categoryTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        CatagoryTag.destroy({ where: { id: categoryTagsToRemove } }),
        CatagoryTag.bulkCreate(newCatagoryTags),
      ]);
    })
    .then((updatedCatagoryTags) => res.json(updatedCatagoryTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


   // delete a category by its `id` value
router.delete('/:id', async (req, res) => {
    try {
      const categoryData = await Category.destroy({
        where: {
          id: req.params.id,
        },
      });
  
      if (!categoryData) {
        res.status(404).json({ message: 'No category found with that id!' });
        return;
      }
  
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;
